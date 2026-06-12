import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const lead = await prisma.lead.create({
      data: {
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        company: body.company ? String(body.company) : null,
        projectType: String(body.projectType ?? "Not sure yet"),
        problem: String(body.problem ?? body.message ?? "Submitted via intake form"),
        timeline: String(body.timeline ?? "Flexible"),
        budget: String(body.budget ?? "Not specified"),
        referral: body.referral ? String(body.referral) : null,
        status: "NEW",
      },
    });

    try {
      await sendLeadNotification(lead);
    } catch {
      // Lead saved even if email fails (e.g. placeholder Resend key)
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit brief" }, { status: 500 });
  }
}
