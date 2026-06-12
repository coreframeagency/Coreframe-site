import { NextRequest, NextResponse } from "next/server";
import type { Currency, DocumentStatus, DocumentType } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseDocumentBody(body: Record<string, unknown>) {
  return {
    type: body.type as DocumentType,
    number: String(body.number ?? ""),
    status: body.status as DocumentStatus,
    currency: body.currency as Currency,
    clientId: String(body.clientId ?? ""),
    projectName: String(body.projectName ?? ""),
    lineItems: body.lineItems ?? [],
    subtotal: Number(body.subtotal ?? 0),
    total: Number(body.total ?? 0),
    paymentSchedule: body.paymentSchedule ?? [],
    notes: body.notes ? String(body.notes) : null,
    issueDate: body.issueDate ? new Date(String(body.issueDate)) : new Date(),
    dueDate: body.dueDate ? new Date(String(body.dueDate)) : null,
    validUntil: body.validUntil ? new Date(String(body.validUntil)) : null,
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseDocumentBody(body);

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.type === "INVOICE" ? data.dueDate : null,
        validUntil: data.type === "QUOTATION" ? data.validUntil : null,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;

  await prisma.document.update({
    where: { id },
    data: { status: "DECLINED" },
  });

  return NextResponse.json({ ok: true });
}
