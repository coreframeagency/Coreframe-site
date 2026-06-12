import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const logs = await prisma.sprintLog.findMany({
    where: { projectId: id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const log = await prisma.sprintLog.create({
      data: {
        projectId: id,
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        date: body.date ? new Date(String(body.date)) : new Date(),
      },
    });
    return NextResponse.json(log, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create sprint log" }, { status: 500 });
  }
}
