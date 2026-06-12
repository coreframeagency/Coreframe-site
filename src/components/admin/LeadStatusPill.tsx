import type { LeadStatus } from "@prisma/client";

const STATUS_CLASS: Record<LeadStatus, string> = {
  NEW: "admin-lead-pill--new",
  QUALIFIED: "admin-lead-pill--qualified",
  PROPOSAL_SENT: "admin-lead-pill--proposal",
  NEGOTIATING: "admin-lead-pill--proposal",
  WON: "admin-lead-pill--won",
  LOST: "admin-lead-pill--lost",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "NEW",
  QUALIFIED: "QUALIFIED",
  PROPOSAL_SENT: "PROPOSAL SENT",
  NEGOTIATING: "NEGOTIATING",
  WON: "WON",
  LOST: "LOST",
};

export function LeadStatusPill({ status }: { status: LeadStatus | string }) {
  const key = status as LeadStatus;
  return (
    <span className={`admin-lead-pill ${STATUS_CLASS[key] ?? "admin-lead-pill--new"}`}>
      {STATUS_LABEL[key] ?? status}
    </span>
  );
}
