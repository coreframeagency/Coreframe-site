import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/admin-types";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminDashboardPage() {
  const [invoices, quotations, recentDocuments] = await Promise.all([
    prisma.document.findMany({ where: { type: "INVOICE" } }),
    prisma.document.findMany({ where: { type: "QUOTATION" } }),
    prisma.document.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  const outstanding = invoices
    .filter((doc) => doc.status === "SENT" || doc.status === "OVERDUE")
    .reduce((sum, doc) => sum + doc.total, 0);

  const paidTotal = invoices
    .filter((doc) => doc.status === "PAID")
    .reduce((sum, doc) => sum + doc.total, 0);

  const stats = [
    { label: "Total Invoices", value: invoices.length },
    { label: "Total Quotations", value: quotations.length },
    { label: "Outstanding", value: formatCurrency(outstanding, "LKR") },
    { label: "Paid", value: formatCurrency(paidTotal, "LKR") },
  ];

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-card__value">{stat.value}</div>
            <div className="admin-stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Type</th>
              <th>Client</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <Link href={`/admin/documents/${doc.id}`} className="admin-btn--link">
                    {doc.number}
                  </Link>
                </td>
                <td>{doc.type}</td>
                <td>{doc.client.name}</td>
                <td>{doc.projectName}</td>
                <td>{formatCurrency(doc.total, doc.currency)}</td>
                <td>
                  <StatusPill status={doc.status} />
                </td>
                <td>{formatDate(doc.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
