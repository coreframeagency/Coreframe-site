import { NextRequest, NextResponse } from "next/server";
import type { AvailabilityStatus } from "@prisma/client";
import { getSiteSettings } from "@/lib/site-settings";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as { availability?: AvailabilityStatus };
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: { availability: body.availability ?? "OPEN" },
      create: { id: "singleton", availability: body.availability ?? "OPEN" },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
