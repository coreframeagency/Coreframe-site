import { Resend } from "resend";
import type { Document } from "@prisma/client";
import { prisma } from "./prisma";
import { publicDocumentUrl } from "./admin-types";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return new Resend(key);
}

function documentEmailHtml(params: {
  clientName: string;
  docType: string;
  number: string;
  url: string;
}) {
  const label = params.docType === "INVOICE" ? "Invoice" : "Quotation";
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px;background:#0B0B0B;color:#F5F3EB;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="font-family:Georgia,serif;font-size:24px;color:#F5F3EB;margin:0 0 24px;">coreframe.</p>
    <p style="font-size:16px;line-height:1.6;">Hi ${params.clientName},</p>
    <p style="font-size:16px;line-height:1.6;color:rgba(245,243,235,0.8);">
      Your ${label.toLowerCase()} <strong style="color:#F5F3EB;">${params.number}</strong> from COREFRAME is ready to view.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.url}" style="display:inline-block;background:#A6FF00;color:#0B0B0B;padding:16px 32px;text-decoration:none;font-family:monospace;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
        View ${label} →
      </a>
    </div>
    <p style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-top:48px;">
      coreframe.agency — SYSTEMS / STRATEGY / DESIGN
    </p>
  </div>
</body>
</html>`;
}

export async function buildDocumentEmailPreview(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { client: true },
  });
  if (!document) throw new Error("Document not found");

  const label = document.type === "INVOICE" ? "Invoice" : "Quotation";
  const url = publicDocumentUrl(document.type, document.id);
  const subject = `${label} ${document.number} from COREFRAME`;

  return {
    recipient: document.client.email,
    subject,
    previewHtml: documentEmailHtml({
      clientName: document.client.name,
      docType: document.type,
      number: document.number,
      url,
    }),
  };
}

export async function sendDocumentEmail(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { client: true },
  });
  if (!document) throw new Error("Document not found");

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL not configured");

  const preview = await buildDocumentEmailPreview(documentId);
  const resend = getResend();

  await resend.emails.send({
    from,
    to: preview.recipient,
    subject: preview.subject,
    html: preview.previewHtml,
  });

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "SENT" },
  });

  return preview;
}

export async function sendOverdueReport(overdueDocuments: Document[]) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) throw new Error("ADMIN_NOTIFY_EMAIL not configured");

  const today = new Date();
  const rows = await Promise.all(
    overdueDocuments.map(async (doc) => {
      const client = await prisma.client.findUnique({ where: { id: doc.clientId } });
      const days = doc.dueDate
        ? Math.floor((today.getTime() - doc.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #1F1F1F;font-family:monospace;">${doc.number}</td>
        <td style="padding:8px;border-bottom:1px solid #1F1F1F;">${client?.name ?? "—"}</td>
        <td style="padding:8px;border-bottom:1px solid #1F1F1F;font-family:monospace;">${doc.total.toFixed(2)} ${doc.currency}</td>
        <td style="padding:8px;border-bottom:1px solid #1F1F1F;font-family:monospace;">${days} days</td>
      </tr>`;
    }),
  );

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px;background:#0B0B0B;color:#F5F3EB;font-family:Inter,Arial,sans-serif;">
  <h1 style="font-family:Georgia,serif;font-size:24px;">Overdue invoices</h1>
  <p style="color:#555;">${overdueDocuments.length} invoice(s) require action.</p>
  <table style="width:100%;border-collapse:collapse;margin-top:24px;">
    <thead>
      <tr style="color:#555;font-family:monospace;font-size:11px;text-transform:uppercase;">
        <th align="left">Number</th>
        <th align="left">Client</th>
        <th align="left">Total</th>
        <th align="left">Overdue</th>
      </tr>
    </thead>
    <tbody>${rows.join("")}</tbody>
  </table>
</body>
</html>`;

  const resend = getResend();
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${overdueDocuments.length} overdue invoice(s) — COREFRAME`,
    html,
  });
}

export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  company?: string | null;
  projectType: string;
  problem: string;
  timeline: string;
  budget: string;
  referral?: string | null;
}) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) throw new Error("ADMIN_NOTIFY_EMAIL not configured");

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px;background:#0B0B0B;color:#F5F3EB;font-family:Inter,Arial,sans-serif;">
  <h1 style="font-family:Georgia,serif;font-size:24px;">New project brief — ${lead.name}</h1>
  <p><strong>Email:</strong> ${lead.email}</p>
  ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ""}
  <p><strong>Project type:</strong> ${lead.projectType}</p>
  <p><strong>Timeline:</strong> ${lead.timeline}</p>
  <p><strong>Budget:</strong> ${lead.budget}</p>
  ${lead.referral ? `<p><strong>Referral:</strong> ${lead.referral}</p>` : ""}
  <p style="margin-top:24px;"><strong>Problem:</strong></p>
  <p style="color:rgba(245,243,235,0.8);">${lead.problem.replace(/\n/g, "<br/>")}</p>
</body>
</html>`;

  const resend = getResend();
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `New project brief — ${lead.name}`,
    html,
  });
}
