import { NextRequest, NextResponse } from "next/server";
import type { ProjectPhase } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      _count: { select: { sprintLogs: true } },
    },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const project = await prisma.project.create({
      data: {
        name: String(body.name ?? ""),
        clientId: String(body.clientId ?? ""),
        phase: (body.phase as ProjectPhase) ?? "MAP",
        startDate: body.startDate ? new Date(String(body.startDate)) : null,
        endDate: body.endDate ? new Date(String(body.endDate)) : null,
        value: body.value != null ? Number(body.value) : null,
        notes: body.notes ? String(body.notes) : null,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
