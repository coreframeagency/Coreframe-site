"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  formatDate,
  parseLineItems,
  parsePaymentSchedule,
  publicDocumentUrl,
} from "@/lib/admin-types";
import { StatusPill } from "@/components/admin/StatusPill";

type DocumentDetail = {
  id: string;
  type: string;
  number: string;
  status: string;
  currency: string;
  projectName: string;
  client: { name: string; company: string };
};

export function DocumentDetailActions({ document }: { document: DocumentDetail }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConvert() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/documents/${document.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: invoiceNumber }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Conversion failed");
        return;
      }
      const invoice = (await response.json()) as { id: string };
      router.push(`/admin/documents/${invoice.id}/edit`);
      router.refresh();
    } catch {
      setError("Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  const publicUrl = publicDocumentUrl(document.type, document.id);

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <Link href={`/admin/documents/${document.id}/edit`} className="admin-btn admin-btn--ghost">
          Edit
        </Link>
        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--ghost">
          View public page
        </a>
        {document.type === "QUOTATION" && document.status === "ACCEPTED" ? (
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => setShowModal(true)}
          >
            Convert to Invoice →
          </button>
        ) : null}
      </div>

      {showModal ? (
        <div className="admin-modal">
          <div className="admin-modal__panel">
            <h2 className="admin-page-title" style={{ fontSize: "1.25rem" }}>
              Convert to invoice
            </h2>
            <p>Enter the new invoice number.</p>
            <input
              className="admin-form-input"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2026-001"
            />
            {error ? <p className="admin-login__error">{error}</p> : null}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? "Converting…" : "Confirm"}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DocumentSummary({
  document,
}: {
  document: DocumentDetail & {
    subtotal: number;
    total: number;
    issueDate: string;
    dueDate: string | null;
    validUntil: string | null;
    lineItems: unknown;
    paymentSchedule: unknown;
  };
}) {
  const lineItems = parseLineItems(document.lineItems);
  const paymentSchedule = parsePaymentSchedule(document.paymentSchedule);

  return (
    <div className="admin-table-wrap" style={{ marginBottom: 24 }}>
      <table className="admin-table">
        <tbody>
          <tr>
            <td>Number</td>
            <td>{document.number}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{document.type}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <StatusPill status={document.status} />
            </td>
          </tr>
          <tr>
            <td>Client</td>
            <td>
              {document.client.name} — {document.client.company}
            </td>
          </tr>
          <tr>
            <td>Project</td>
            <td>{document.projectName}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{formatCurrency(document.total, document.currency)}</td>
          </tr>
          <tr>
            <td>Issue date</td>
            <td>{formatDate(document.issueDate)}</td>
          </tr>
          {document.dueDate ? (
            <tr>
              <td>Due date</td>
              <td>{formatDate(document.dueDate)}</td>
            </tr>
          ) : null}
          {document.validUntil ? (
            <tr>
              <td>Valid until</td>
              <td>{formatDate(document.validUntil)}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <div style={{ padding: 16 }}>
        <p className="admin-form-label">Line items ({lineItems.length})</p>
        <p className="admin-form-label">Payment milestones ({paymentSchedule.length})</p>
      </div>
    </div>
  );
}
