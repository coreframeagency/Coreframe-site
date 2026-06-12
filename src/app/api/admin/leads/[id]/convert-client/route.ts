import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const client = await prisma.client.create({
      data: {
        name: lead.name,
        email: lead.email,
        company: lead.company ?? "Independent",
        address: "—",
        country: "—",
        notes: lead.notes,
      },
    });

    await prisma.lead.update({
      where: { id },
      data: { status: "WON" },
    });

    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to convert lead" }, { status: 500 });
  }
}
