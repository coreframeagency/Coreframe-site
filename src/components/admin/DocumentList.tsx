"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, publicDocumentUrl } from "@/lib/admin-types";
import { StatusPill } from "@/components/admin/StatusPill";

type DocumentRow = {
  id: string;
  type: string;
  number: string;
  status: string;
  currency: string;
  total: number;
  createdAt: string;
  projectName: string;
  client: { name: string; company: string };
};

type DocumentListProps = {
  type: "INVOICE" | "QUOTATION";
  title: string;
  initialFilter?: string;
};

const INVOICE_TABS = [
  { key: "all", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Sent" },
  { key: "PAID", label: "Paid" },
  { key: "OVERDUE", label: "Overdue" },
] as const;

const QUOTATION_TABS = [
  { key: "all", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Sent" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "DECLINED", label: "Declined" },
] as const;

export function DocumentList({ type, title, initialFilter = "all" }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const tabs = type === "INVOICE" ? INVOICE_TABS : QUOTATION_TABS;

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    fetch("/api/admin/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data.filter((doc: DocumentRow) => doc.type === type)))
      .catch(() => setDocuments([]));
  }, [type]);

  const filtered = useMemo(() => {
    if (filter === "all") return documents;
    return documents.filter((doc) => doc.status === filter);
  }, [documents, filter]);

  async function copyLink(id: string) {
    const url = publicDocumentUrl(type, id);
    await navigator.clipboard.writeText(url);
  }

  return (
    <>
      <h1 className="admin-page-title">{title}</h1>
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`admin-tab ${filter === tab.key ? "is-active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Client</th>
              <th>Project</th>
              <th>Currency</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.number}</td>
                <td>{doc.client.name}</td>
                <td>{doc.projectName}</td>
                <td>{doc.currency}</td>
                <td>{formatCurrency(doc.total, doc.currency)}</td>
                <td>
                  <StatusPill status={doc.status} />
                </td>
                <td>{formatDate(doc.createdAt)}</td>
                <td>
                  <div className="admin-actions">
                    <a
                      href={publicDocumentUrl(type, doc.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn--icon"
                      title="View"
                    >
                      ↗
                    </a>
                    <Link
                      href={`/admin/documents/${doc.id}/edit`}
                      className="admin-btn--icon"
                      title="Edit"
                    >
                      ✎
                    </Link>
                    <button
                      type="button"
                      className="admin-btn--icon"
                      title="Copy link"
                      onClick={() => copyLink(doc.id)}
                    >
                      ⧉
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
