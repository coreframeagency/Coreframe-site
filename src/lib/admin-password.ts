import { timingSafeEqual } from "node:crypto";
import { hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

type EnvSecret =
  | { kind: "none" }
  | { kind: "hash"; value: string }
  | { kind: "plain"; value: string; looksLikeHash: boolean };

/**
 * Clean up an ADMIN_PASSWORD env value so common paste mistakes don't lock us out:
 * surrounding whitespace/quotes, and `\$` escapes copied from .env.local.
 */
function normalizeEnvValue(raw: string | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  value = value.replace(/\\\$/g, "$");
  return value || null;
}

/**
 * A bcrypt hash never contains whitespace, so any inside it (wrapped paste, stray newline)
 * is stripped before the check. Anything that still isn't a bcrypt hash is treated as a
 * plain-text break-glass password.
 */
function readEnvSecret(): EnvSecret {
  const value = normalizeEnvValue(process.env.ADMIN_PASSWORD);
  if (!value) return { kind: "none" };

  const compact = value.replace(/\s+/g, "");
  if (BCRYPT_RE.test(compact)) return { kind: "hash", value: compact };

  return { kind: "plain", value, looksLikeHash: compact.startsWith("$2") };
}

function plainEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export type AdminPasswordCheck =
  | { ok: true; source: "db" | "env-hash" | "env-plain"; dbError?: string }
  | {
      ok: false;
      reason: "no password configured" | "env hash invalid" | "password mismatch";
      dbError?: string;
    };

export function shortError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { errorCode?: string; code?: string })?.errorCode ??
    (error as { code?: string })?.code;
  // Prisma leads with "Invalid `prisma.x()` invocation:" — skip it to reach the actual cause.
  const reason =
    message
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !/^Invalid `prisma\./.test(line)) ?? "unknown error";
  const text = code ? `${code}: ${reason}` : reason;
  // Never echo credentials from a connection string.
  return text.replace(/\/\/[^@\s/]+@/g, "//***@").slice(0, 200);
}

/**
 * The password set from /admin/settings/password lives in the database and wins.
 * ADMIN_PASSWORD (env) is the fallback / break-glass.
 */
export async function checkAdminPassword(password: string): Promise<AdminPasswordCheck> {
  let dbError: string | undefined;
  let hasDbCredential = false;

  if (password) {
    try {
      const stored = await prisma.adminCredential.findUnique({ where: { id: "singleton" } });
      hasDbCredential = Boolean(stored?.passwordHash);
      if (stored?.passwordHash && (await verifyPassword(password, stored.passwordHash))) {
        return { ok: true, source: "db" };
      }
    } catch (error) {
      dbError = shortError(error);
    }
  }

  const env = readEnvSecret();

  if (env.kind === "none") {
    return hasDbCredential
      ? { ok: false, reason: "password mismatch", dbError }
      : { ok: false, reason: "no password configured", dbError };
  }

  if (!password) return { ok: false, reason: "password mismatch", dbError };

  if (env.kind === "hash") {
    return (await verifyPassword(password, env.value))
      ? { ok: true, source: "env-hash", dbError }
      : { ok: false, reason: "password mismatch", dbError };
  }

  if (plainEquals(password, env.value)) return { ok: true, source: "env-plain", dbError };
  return { ok: false, reason: env.looksLikeHash ? "env hash invalid" : "password mismatch", dbError };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return (await checkAdminPassword(password)).ok;
}

/** Non-secret facts about ADMIN_PASSWORD for /api/admin/status. */
export function describeAdminPasswordEnv() {
  const raw = process.env.ADMIN_PASSWORD;
  const env = readEnvSecret();
  const compact = env.kind === "none" ? "" : env.value.replace(/\s+/g, "");
  return {
    present: Boolean(raw),
    length: raw?.length ?? 0,
    // Only hash prefixes ("$2b$") are shown — never the start of a plain-text password.
    startsWith: compact.startsWith("$") ? compact.slice(0, 4) : null,
    validBcrypt: env.kind === "hash",
    mode: env.kind === "none" ? "none" : env.kind === "hash" ? "bcrypt" : "plaintext",
    hasWhitespaceOrNewline: raw ? /\s/.test(raw) : false,
  };
}

export async function setAdminPassword(newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  await prisma.adminCredential.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", passwordHash },
    update: { passwordHash },
  });
}
