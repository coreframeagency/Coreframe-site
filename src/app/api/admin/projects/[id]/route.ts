import { NextRequest, NextResponse } from "next/server";
import type { ProjectPhase } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      sprintLogs: { orderBy: { date: "desc" } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (body.phase) data.phase = body.phase as ProjectPhase;
    if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;
    if (body.value !== undefined) data.value = body.value != null ? Number(body.value) : null;
    if (body.startDate !== undefined)
      data.startDate = body.startDate ? new Date(String(body.startDate)) : null;
    if (body.endDate !== undefined)
      data.endDate = body.endDate ? new Date(String(body.endDate)) : null;

    const project = await prisma.project.update({ where: { id }, data });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
