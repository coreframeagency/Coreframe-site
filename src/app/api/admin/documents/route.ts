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

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseDocumentBody(body);

    if (!data.number || !data.clientId || !data.projectName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        ...data,
        dueDate: data.type === "INVOICE" ? data.dueDate : null,
        validUntil: data.type === "QUOTATION" ? data.validUntil : null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
