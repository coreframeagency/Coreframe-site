import { hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

/**
 * Clean up an ADMIN_PASSWORD env value so common paste mistakes don't lock us out:
 * surrounding whitespace/quotes, and `\$` escapes copied from .env.local.
 */
function normalizeEnvHash(raw: string | undefined): string | null {
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
 * The password set from /admin/settings/password lives in the database and wins.
 * ADMIN_PASSWORD (env) is the fallback / break-glass.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  try {
    const stored = await prisma.adminCredential.findUnique({ where: { id: "singleton" } });
    if (stored?.passwordHash && (await verifyPassword(password, stored.passwordHash))) {
      return true;
    }
  } catch (error) {
    console.error("[admin-password] could not read AdminCredential", error);
  }

  const envHash = normalizeEnvHash(process.env.ADMIN_PASSWORD);
  if (!envHash) return false;

  if (!BCRYPT_RE.test(envHash)) {
    console.error(
      `[admin-password] ADMIN_PASSWORD is not a valid bcrypt hash (length ${envHash.length}, starts "${envHash.slice(0, 4)}")`,
    );
    return false;
  }

  return verifyPassword(password, envHash);
}

export async function hasAnyAdminPassword(): Promise<boolean> {
  if (normalizeEnvHash(process.env.ADMIN_PASSWORD)) return true;
  try {
    return Boolean(await prisma.adminCredential.findUnique({ where: { id: "singleton" } }));
  } catch {
    return false;
  }
}

export async function setAdminPassword(newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  await prisma.adminCredential.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", passwordHash },
    update: { passwordHash },
  });
}
