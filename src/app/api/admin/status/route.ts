import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { describeAdminPasswordEnv, shortError } from "@/lib/admin-password";

export const dynamic = "force-dynamic";

/** Public, secret-free diagnostics for the admin login. Never return env values here. */
function describeDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return { present: false, protocol: null, host: null };
  try {
    const url = new URL(raw.trim());
    return { present: true, protocol: url.protocol, host: url.hostname || null };
  } catch {
    return { present: true, protocol: null, host: null };
  }
}

export async function GET() {
  const adminPassword = describeAdminPasswordEnv();

  let db: { reachable: boolean; error?: string };
  let adminCredential: { exists: boolean } | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = { reachable: true };
    try {
      const row = await prisma.adminCredential.findUnique({
        where: { id: "singleton" },
        select: { id: true },
      });
      adminCredential = { exists: Boolean(row) };
    } catch (error) {
      db = { reachable: true, error: `AdminCredential: ${shortError(error)}` };
    }
  } catch (error) {
    db = { reachable: false, error: shortError(error) };
  }

  return NextResponse.json(
    {
      commit: process.env.RENDER_GIT_COMMIT ?? "local",
      env: {
        DATABASE_URL: describeDatabaseUrl(),
        ADMIN_PASSWORD: adminPassword,
        hasWhitespaceOrNewline: adminPassword.hasWhitespaceOrNewline,
      },
      db,
      adminCredential,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
