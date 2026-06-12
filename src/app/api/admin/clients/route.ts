import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { documents: true } },
    },
  });

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      company?: string;
      address?: string;
      country?: string;
      notes?: string;
    };

    if (!body.name || !body.email || !body.company || !body.address || !body.country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        address: body.address,
        country: body.country,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
