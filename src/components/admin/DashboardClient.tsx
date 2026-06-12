"use client";

import Link from "next/link";
import { CountUp } from "@/components/admin/CountUp";
import { LeadStatusPill } from "@/components/admin/LeadStatusPill";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatCurrency, formatDate } from "@/lib/admin-types";

type DashboardData = {
  invoiceCount: number;
  quotationCount: number;
  pipelineValue: number;
  outstanding: number;
  paidTotal: number;
  winRate: number;
  overdueCount: number;
  recentDocuments: Array<{
    id: string;
    number: string;
    type: string;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
    client: { name: string };
    projectName: string;
  }>;
  recentLeads: Array<{
    id: string;
    name: string;
    projectType: string;
    budget: string;
    status: string;
  }>;
};

export function DashboardClient({ data }: { data: DashboardData }) {
  const stats = [
    { label: "Total Invoices", value: data.invoiceCount, format: (n: number) => String(n) },
    { label: "Total Quotations", value: data.quotationCount, format: (n: number) => String(n) },
    {
      label: "Pipeline Value",
      value: data.pipelineValue,
      format: (n: number) => formatCurrency(n, "LKR"),
    },
    {
      label: "Outstanding",
      value: data.outstanding,
      format: (n: number) => formatCurrency(n, "LKR"),
    },
    {
      label: "Total Paid",
      value: data.paidTotal,
      format: (n: number) => formatCurrency(n, "LKR"),
    },
    {
      label: "Win Rate",
      value: data.winRate,
      format: (n: number) => `${n}%`,
    },
  ];

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stats admin-stats--six">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="admin-stat-card admin-animate-card"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="admin-stat-card__value">
              <CountUp value={stat.value} format={stat.format} />
            </div>
            <div className="admin-stat-card__label">{stat.label}</div>
            <div className="admin-stat-card__line" />
          </div>
        ))}
      </div>

      {data.overdueCount > 0 ? (
        <div className="admin-overdue-banner admin-animate-fade">
          {data.overdueCount} invoice(s) overdue — action required{" "}
          <Link href="/admin/invoices?status=OVERDUE">View overdue →</Link>
        </div>
      ) : null}

      <div className="admin-dashboard-columns">
        <section className="admin-panel admin-animate-card" style={{ animationDelay: "120ms" }}>
          <p className="admin-eyebrow">RECENT DOCUMENTS</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className="admin-animate-row"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <td className="admin-table__name">
                      <Link href={`/admin/documents/${doc.id}`} className="admin-btn--link">
                        {doc.number}
                      </Link>
                    </td>
                    <td className="admin-table__name">{doc.client.name}</td>
                    <td className="admin-table__mono">
                      {formatCurrency(doc.total, doc.currency)}
                    </td>
                    <td>
                      <StatusPill status={doc.status} />
                    </td>
                    <td className="admin-table__mono">{formatDate(doc.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel admin-animate-card" style={{ animationDelay: "180ms" }}>
          <p className="admin-eyebrow">PIPELINE</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className="admin-animate-row"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <td className="admin-table__name">{lead.name}</td>
                    <td className="admin-table__mono">{lead.projectType}</td>
                    <td className="admin-table__mono admin-table__lime">{lead.budget}</td>
                    <td>
                      <LeadStatusPill status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="admin-quick-actions admin-animate-card" style={{ animationDelay: "240ms" }}>
        <Link href="/admin/documents/new?type=INVOICE" className="admin-btn admin-btn--ghost">
          New Invoice →
        </Link>
        <Link href="/admin/documents/new?type=QUOTATION" className="admin-btn admin-btn--ghost">
          New Quotation →
        </Link>
        <Link href="/admin/leads/new" className="admin-btn admin-btn--ghost">
          New Lead →
        </Link>
        <Link href="/admin/projects/new" className="admin-btn admin-btn--ghost">
          New Project →
        </Link>
      </div>
    </>
  );
}
