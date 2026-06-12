import { NextRequest, NextResponse } from "next/server";
import { sendOverdueReport } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueCandidates = await prisma.document.findMany({
    where: {
      type: "INVOICE",
      status: "SENT",
      reminderSent: false,
      dueDate: { lt: today },
    },
  });

  if (overdueCandidates.length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  const updated = await Promise.all(
    overdueCandidates.map((doc) =>
      prisma.document.update({
        where: { id: doc.id },
        data: { status: "OVERDUE", reminderSent: true },
      }),
    ),
  );

  try {
    await sendOverdueReport(updated);
  } catch {
    // Status updated even if email fails
  }

  return NextResponse.json({ updated: updated.length });
}
