import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminCookie,
  createAdminSession,
  setAdminCookie,
  validateAdminRequest,
} from "@/lib/auth";
import { hasAnyAdminPassword, verifyAdminPassword } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";
    if (!(await hasAnyAdminPassword())) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
    }

    const valid = await verifyAdminPassword(password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession();
    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, token, expiresAt);
    return response;
  } catch {
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
