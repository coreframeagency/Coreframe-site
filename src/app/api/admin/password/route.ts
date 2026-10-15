import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { setAdminPassword, verifyAdminPassword } from "@/lib/admin-password";

const MIN_LENGTH = 10;

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as { current?: string; next?: string };
    const current = body.current ?? "";
    const next = body.next ?? "";

    if (!(await verifyAdminPassword(current))) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 400 });
    }
    if (next.length < MIN_LENGTH) {
      return NextResponse.json(
        { error: `New password must be at least ${MIN_LENGTH} characters` },
        { status: 400 },
      );
    }
    if (next.trim() !== next) {
      return NextResponse.json(
        { error: "New password can't start or end with a space" },
        { status: 400 },
      );
    }

    await setAdminPassword(next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
