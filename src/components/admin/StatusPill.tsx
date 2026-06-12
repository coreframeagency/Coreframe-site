import type { DocumentStatus } from "@prisma/client";

const STATUS_CLASS: Record<DocumentStatus, string> = {
  DRAFT: "admin-pill--draft",
  SENT: "admin-pill--sent",
  PAID: "admin-pill--paid",
  OVERDUE: "admin-pill--overdue",
  ACCEPTED: "admin-pill--accepted",
  DECLINED: "admin-pill--declined",
};

export function StatusPill({ status }: { status: DocumentStatus | string }) {
  const key = status as DocumentStatus;
  return <span className={`admin-pill ${STATUS_CLASS[key] ?? "admin-pill--draft"}`}>{status}</span>;
}
