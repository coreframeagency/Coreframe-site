import { NextRequest, NextResponse } from "next/server";
import { parsePaymentSchedule } from "@/lib/admin-types";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const invoices = await prisma.document.findMany({ where: { type: "INVOICE" } });

  const totals = {
    billed: { LKR: 0, USD: 0 },
    paid: { LKR: 0, USD: 0 },
    outstanding: { LKR: 0, USD: 0 },
  };

  for (const doc of invoices) {
    const currency = doc.currency as "LKR" | "USD";
    totals.billed[currency] += doc.total;
    if (doc.status === "PAID") totals.paid[currency] += doc.total;
    if (doc.status === "SENT" || doc.status === "OVERDUE") totals.outstanding[currency] += doc.total;
  }

  const now = new Date();
  const forecastMonths: Array<{ key: string; label: string; LKR: number; USD: number }> = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    forecastMonths.push({ key: monthKey(d), label: monthLabel(monthKey(d)), LKR: 0, USD: 0 });
  }

  for (const doc of invoices.filter((d) => d.status === "SENT")) {
    const schedule = parsePaymentSchedule(doc.paymentSchedule);
    const currency = doc.currency as "LKR" | "USD";
    const perMonth = schedule.length ? schedule.reduce((s, m) => s + m.amount, 0) / 3 : 0;
    forecastMonths.forEach((month) => {
      month[currency] += perMonth;
    });
  }

  const forecastTotal = {
    LKR: forecastMonths.reduce((s, m) => s + m.LKR, 0),
    USD: forecastMonths.reduce((s, m) => s + m.USD, 0),
  };

  const monthly: Array<{
    key: string;
    label: string;
    invoiced: { LKR: number; USD: number };
    collected: { LKR: number; USD: number };
    outstanding: { LKR: number; USD: number };
    isCurrent: boolean;
  }> = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly.push({
      key: monthKey(d),
      label: monthLabel(monthKey(d)),
      invoiced: { LKR: 0, USD: 0 },
      collected: { LKR: 0, USD: 0 },
      outstanding: { LKR: 0, USD: 0 },
      isCurrent: i === 0,
    });
  }

  for (const doc of invoices) {
    const key = monthKey(doc.issueDate);
    const row = monthly.find((m) => m.key === key);
    if (!row) continue;
    const currency = doc.currency as "LKR" | "USD";
    row.invoiced[currency] += doc.total;
    if (doc.status === "PAID") row.collected[currency] += doc.total;
    if (doc.status === "SENT" || doc.status === "OVERDUE") row.outstanding[currency] += doc.total;
  }

  return NextResponse.json({ totals, forecastMonths, forecastTotal, monthly });
}
