import { NextRequest, NextResponse } from "next/server";
import type { LeadStatus } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (body.status) data.status = body.status as LeadStatus;
    if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;
    if (body.value !== undefined) data.value = body.value != null ? Number(body.value) : null;

    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
