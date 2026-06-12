import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { number?: string };
    const number = String(body.number ?? "").trim();

    if (!number) {
      return NextResponse.json({ error: "Invoice number required" }, { status: 400 });
    }

    const quotation = await prisma.document.findUnique({ where: { id } });
    if (!quotation || quotation.type !== "QUOTATION") {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    if (quotation.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Quotation must be accepted" }, { status: 400 });
    }

    const invoice = await prisma.document.create({
      data: {
        type: "INVOICE",
        number,
        status: "DRAFT",
        currency: quotation.currency,
        clientId: quotation.clientId,
        projectName: quotation.projectName,
        lineItems: quotation.lineItems as Prisma.InputJsonValue,
        subtotal: quotation.subtotal,
        total: quotation.total,
        paymentSchedule: quotation.paymentSchedule as Prisma.InputJsonValue,
        notes: quotation.notes,
        issueDate: new Date(),
        dueDate: null,
        validUntil: null,
        convertedFromId: quotation.id,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
