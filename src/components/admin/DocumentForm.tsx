"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DocumentFormData, LineItem, PaymentMilestone } from "@/lib/admin-types";

type ClientOption = {
  id: string;
  name: string;
  company: string;
};

type DocumentFormProps = {
  initial?: Partial<DocumentFormData> & { id?: string };
  mode: "create" | "edit";
};

const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"] as const;
const QUOTATION_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "DECLINED"] as const;

function emptyLineItem(): LineItem {
  return { description: "", quantity: 1, rate: 0, amount: 0 };
}

function emptyMilestone(): PaymentMilestone {
  return { label: "", description: "", amount: 0 };
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function DocumentForm({ initial, mode }: DocumentFormProps) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<"INVOICE" | "QUOTATION">(initial?.type ?? "INVOICE");
  const [number, setNumber] = useState(initial?.number ?? "");
  const [clientId, setClientId] = useState(initial?.clientId ?? "");
  const [projectName, setProjectName] = useState(initial?.projectName ?? "");
  const [currency, setCurrency] = useState<"LKR" | "USD">(initial?.currency ?? "LKR");
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? todayInputValue());
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [validUntil, setValidUntil] = useState(initial?.validUntil ?? "");
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initial?.lineItems?.length ? initial.lineItems : [emptyLineItem()],
  );
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentMilestone[]>(
    initial?.paymentSchedule?.length ? initial.paymentSchedule : [emptyMilestone()],
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => setClients([]));
  }, []);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0),
    [lineItems],
  );

  const statusOptions = type === "INVOICE" ? INVOICE_STATUSES : QUOTATION_STATUSES;

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    setLineItems((items) =>
      items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...patch };
        next.amount = Number(next.quantity) * Number(next.rate);
        return next;
      }),
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload: DocumentFormData = {
      type,
      number,
      clientId,
      projectName,
      currency,
      issueDate,
      dueDate: type === "INVOICE" ? dueDate || null : null,
      validUntil: type === "QUOTATION" ? validUntil || null : null,
      lineItems: lineItems.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
      subtotal,
      total: subtotal,
      paymentSchedule,
      notes: notes.trim() || null,
      status,
    };

    try {
      const url =
        mode === "create" ? "/api/admin/documents" : `/api/admin/documents/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Failed to save document");
        return;
      }

      const data = (await response.json()) as { id: string };
      router.push(`/admin/documents/${data.id}`);
      router.refresh();
    } catch {
      setError("Failed to save document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-section">
        <span className="admin-form-label">Document type</span>
        <div className="admin-toggle-group">
          {(["INVOICE", "QUOTATION"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`admin-toggle ${type === value ? "is-active" : ""}`}
              onClick={() => {
                setType(value);
                setStatus("DRAFT");
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="number">
          Document number
        </label>
        <input
          id="number"
          className="admin-form-input"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder={type === "INVOICE" ? "INV-2026-001" : "QUO-2026-001"}
          required
        />
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="clientId">
          Client
        </label>
        <select
          id="clientId"
          className="admin-form-select"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} — {client.company}
            </option>
          ))}
        </select>
        <Link href="/admin/clients/new" target="_blank" className="admin-btn--link">
          + Add new client
        </Link>
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="projectName">
          Project name
        </label>
        <input
          id="projectName"
          className="admin-form-input"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </div>

      <div className="admin-form-section">
        <span className="admin-form-label">Currency</span>
        <div className="admin-toggle-group">
          {(["LKR", "USD"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`admin-toggle ${currency === value ? "is-active" : ""}`}
              onClick={() => setCurrency(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="issueDate">
          Issue date
        </label>
        <input
          id="issueDate"
          type="date"
          className="admin-form-input"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
      </div>

      {type === "INVOICE" ? (
        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="dueDate">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            className="admin-form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      ) : (
        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="validUntil">
            Valid until
          </label>
          <input
            id="validUntil"
            type="date"
            className="admin-form-input"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
      )}

      <div className="admin-form-section">
        <span className="admin-form-label">Line items</span>
        <div className="admin-line-items">
          {lineItems.map((item, index) => (
            <div key={index} className="admin-line-item-row">
              <input
                className="admin-form-input"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(index, { description: e.target.value })}
                required
              />
              <input
                className="admin-form-input"
                type="number"
                min="0"
                step="1"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, { quantity: Number(e.target.value) })}
              />
              <input
                className="admin-form-input"
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => updateLineItem(index, { rate: Number(e.target.value) })}
              />
              <input
                className="admin-form-input"
                value={(item.quantity * item.rate).toFixed(2)}
                readOnly
                aria-label="Amount"
              />
              <button
                type="button"
                className="admin-btn--icon"
                onClick={() => setLineItems((items) => items.filter((_, i) => i !== index))}
                aria-label="Remove line item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => setLineItems((items) => [...items, emptyLineItem()])}
        >
          + Add line item
        </button>
        <div className="admin-totals">
          <div>Subtotal: {subtotal.toFixed(2)}</div>
          <div>Total: {subtotal.toFixed(2)}</div>
        </div>
      </div>

      <div className="admin-form-section">
        <span className="admin-form-label">Payment schedule</span>
        <div className="admin-line-items">
          {paymentSchedule.map((item, index) => (
            <div key={index} className="admin-line-item-row" style={{ gridTemplateColumns: "1fr 1fr 120px 32px" }}>
              <input
                className="admin-form-input"
                placeholder="Label"
                value={item.label}
                onChange={(e) =>
                  setPaymentSchedule((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)),
                  )
                }
              />
              <input
                className="admin-form-input"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  setPaymentSchedule((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, description: e.target.value } : row,
                    ),
                  )
                }
              />
              <input
                className="admin-form-input"
                type="number"
                min="0"
                step="0.01"
                value={item.amount}
                onChange={(e) =>
                  setPaymentSchedule((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, amount: Number(e.target.value) } : row,
                    ),
                  )
                }
              />
              <button
                type="button"
                className="admin-btn--icon"
                onClick={() =>
                  setPaymentSchedule((rows) => rows.filter((_, i) => i !== index))
                }
                aria-label="Remove milestone"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => setPaymentSchedule((rows) => [...rows, emptyMilestone()])}
        >
          + Add milestone
        </button>
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          className="admin-form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="admin-form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="admin-login__error">{error}</p> : null}

      <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
        {loading ? "Saving…" : mode === "create" ? "Create document" : "Save changes"}
      </button>
    </form>
  );
}
