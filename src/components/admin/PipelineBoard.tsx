"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@prisma/client";
import { LeadStatusPill } from "@/components/admin/LeadStatusPill";
import { formatCurrency, formatDate } from "@/lib/admin-types";

const COLUMNS: LeadStatus[] = [
  "NEW",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATING",
  "WON",
  "LOST",
];

const COLUMN_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATING: "Negotiating",
  WON: "Won",
  LOST: "Lost",
};

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  problem: string;
  timeline: string;
  budget: string;
  referral: string | null;
  status: LeadStatus;
  value: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export function PipelineBoard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [converting, setConverting] = useState(false);

  const loadLeads = useCallback(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data: Lead[]) => setLeads(data))
      .catch(() => setLeads([]));
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((s) => [s, [] as Lead[]])) as Record<
      LeadStatus,
      Lead[]
    >;
    for (const lead of leads) {
      map[lead.status]?.push(lead);
    }
    return map;
  }, [leads]);

  const totals = useMemo(() => {
    return COLUMNS.map((status) => ({
      status,
      count: byStatus[status].length,
      value: byStatus[status].reduce((sum, lead) => sum + (lead.value ?? 0), 0),
    }));
  }, [byStatus]);

  async function patchLead(id: string, data: Partial<Pick<Lead, "status" | "notes" | "value">>) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return;
    const updated = (await response.json()) as Lead;
    setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)));
    setSelected((prev) => (prev?.id === id ? updated : prev));
  }

  async function handleConvert() {
    if (!selected) return;
    setConverting(true);
    try {
      const response = await fetch(`/api/admin/leads/${selected.id}/convert-client`, {
        method: "POST",
      });
      if (!response.ok) return;
      const client = (await response.json()) as { id: string };
      router.push(`/admin/clients/${client.id}`);
    } finally {
      setConverting(false);
    }
  }

  return (
    <>
      <div className="admin-kanban-totals">
        {totals.map((row) => (
          <div key={row.status} className="admin-kanban-total">
            <p className="admin-kanban-total__label">{COLUMN_LABELS[row.status]}</p>
            <p className="admin-kanban-total__value">{row.count}</p>
            <p className="admin-kanban__card-meta">{formatCurrency(row.value, "LKR")}</p>
          </div>
        ))}
      </div>

      <div className="admin-kanban">
        {COLUMNS.map((status) => (
          <div key={status} className="admin-kanban__column">
            <div className="admin-kanban__header">
              {COLUMN_LABELS[status]} ({byStatus[status].length})
            </div>
            <div className="admin-kanban__cards">
              {byStatus[status].map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  className="admin-kanban__card"
                  onClick={() => setSelected(lead)}
                >
                  <p className="admin-kanban__card-name">{lead.name}</p>
                  <p className="admin-kanban__card-meta">{lead.projectType}</p>
                  <p className="admin-kanban__card-meta">{lead.budget}</p>
                  {lead.value != null ? (
                    <p className="admin-kanban__card-meta">{formatCurrency(lead.value, "LKR")}</p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected ? (
        <div className="admin-slideover">
          <button
            type="button"
            className="admin-slideover__backdrop"
            aria-label="Close panel"
            onClick={() => setSelected(null)}
          />
          <div className="admin-slideover__panel admin-slideover__panel--wide">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 className="admin-page-title" style={{ fontSize: "1.5rem", margin: 0 }}>
                {selected.name}
              </h2>
              <LeadStatusPill status={selected.status} />
            </div>

            <div className="admin-detail-grid">
              <div className="admin-form-section">
                <label className="admin-form-label" htmlFor="lead-status">
                  Status
                </label>
                <select
                  id="lead-status"
                  className="admin-form-select"
                  value={selected.status}
                  onChange={(e) => patchLead(selected.id, { status: e.target.value as LeadStatus })}
                >
                  {COLUMNS.map((s) => (
                    <option key={s} value={s}>
                      {COLUMN_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="admin-detail-field__label">Email</p>
                <p className="admin-detail-field__value">{selected.email}</p>
              </div>
              {selected.company ? (
                <div>
                  <p className="admin-detail-field__label">Company</p>
                  <p className="admin-detail-field__value">{selected.company}</p>
                </div>
              ) : null}
              <div>
                <p className="admin-detail-field__label">Project type</p>
                <p className="admin-detail-field__value">{selected.projectType}</p>
              </div>
              <div>
                <p className="admin-detail-field__label">Problem</p>
                <p className="admin-detail-field__value">{selected.problem}</p>
              </div>
              <div>
                <p className="admin-detail-field__label">Timeline</p>
                <p className="admin-detail-field__value">{selected.timeline}</p>
              </div>
              <div>
                <p className="admin-detail-field__label">Budget</p>
                <p className="admin-detail-field__value">{selected.budget}</p>
              </div>
              {selected.referral ? (
                <div>
                  <p className="admin-detail-field__label">Referral</p>
                  <p className="admin-detail-field__value">{selected.referral}</p>
                </div>
              ) : null}
              <div>
                <p className="admin-detail-field__label">Created</p>
                <p className="admin-detail-field__value">{formatDate(selected.createdAt)}</p>
              </div>

              <div className="admin-form-section">
                <label className="admin-form-label" htmlFor="lead-value">
                  Value (LKR)
                </label>
                <input
                  id="lead-value"
                  type="number"
                  className="admin-form-input"
                  defaultValue={selected.value ?? ""}
                  onBlur={(e) => {
                    const raw = e.target.value;
                    patchLead(selected.id, { value: raw ? Number(raw) : null });
                  }}
                />
              </div>

              <div className="admin-form-section">
                <label className="admin-form-label" htmlFor="lead-notes">
                  Notes
                </label>
                <textarea
                  id="lead-notes"
                  className="admin-form-textarea"
                  defaultValue={selected.notes ?? ""}
                  onBlur={(e) => patchLead(selected.id, { notes: e.target.value })}
                />
              </div>
            </div>

            <div className="doc-hairline" />

            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={converting || selected.status === "WON"}
              onClick={handleConvert}
            >
              {converting ? "Converting…" : "Convert to Client"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
