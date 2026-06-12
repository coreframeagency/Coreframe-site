import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const [invoices, quotations, leads, recentDocuments, recentLeads] = await Promise.all([
    prisma.document.findMany({ where: { type: "INVOICE" } }),
    prisma.document.findMany({ where: { type: "QUOTATION" } }),
    prisma.lead.findMany(),
    prisma.document.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.lead.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
  ]);

  const outstanding = invoices
    .filter((doc) => doc.status === "SENT" || doc.status === "OVERDUE")
    .reduce((sum, doc) => sum + doc.total, 0);

  const paidTotal = invoices
    .filter((doc) => doc.status === "PAID")
    .reduce((sum, doc) => sum + doc.total, 0);

  const pipelineValue = leads
    .filter((lead) => lead.status !== "WON" && lead.status !== "LOST")
    .reduce((sum, lead) => sum + (lead.value ?? 0), 0);

  const closedLeads = leads.filter((lead) => lead.status === "WON" || lead.status === "LOST");
  const wonLeads = leads.filter((lead) => lead.status === "WON");
  const winRate =
    closedLeads.length > 0 ? Math.round((wonLeads.length / closedLeads.length) * 100) : 0;

  const overdueCount = invoices.filter((doc) => doc.status === "OVERDUE").length;

  return (
    <DashboardClient
      data={{
        invoiceCount: invoices.length,
        quotationCount: quotations.length,
        pipelineValue,
        outstanding,
        paidTotal,
        winRate,
        overdueCount,
        recentDocuments: recentDocuments.map((doc) => ({
          ...doc,
          createdAt: doc.createdAt.toISOString(),
        })),
        recentLeads,
      }}
    />
  );
}
