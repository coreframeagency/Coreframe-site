import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminCookie,
  createAdminSession,
  setAdminCookie,
  validateAdminRequest,
} from "@/lib/auth";
import { checkAdminPassword, shortError } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    const check = await checkAdminPassword(password);
    if (check.dbError) {
      console.error(`[admin-auth] DB unreachable while reading AdminCredential: ${check.dbError}`);
    }

    if (!check.ok) {
      console.error(`[admin-auth] login failed: ${check.reason}`);
      if (check.reason === "no password configured") {
        return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
      }
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    let session;
    try {
      session = await createAdminSession();
    } catch (error) {
      console.error(`[admin-auth] DB unreachable — cannot create session: ${shortError(error)}`);
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    console.info(`[admin-auth] login ok (source: ${check.source})`);
    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    console.error(`[admin-auth] login error: ${shortError(error)}`);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);
  return response;
}

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
