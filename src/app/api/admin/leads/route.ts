import { NextRequest, NextResponse } from "next/server";
import type { LeadStatus } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const lead = await prisma.lead.create({
      data: {
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        company: body.company ? String(body.company) : null,
        projectType: String(body.projectType ?? ""),
        problem: String(body.problem ?? ""),
        timeline: String(body.timeline ?? ""),
        budget: String(body.budget ?? ""),
        referral: body.referral ? String(body.referral) : null,
        value: body.value != null ? Number(body.value) : null,
        notes: body.notes ? String(body.notes) : null,
      },
    });
    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
