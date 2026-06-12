import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { parseLineItems, parsePaymentSchedule } from "@/lib/admin-types";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDocumentPage({ params }: PageProps) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) notFound();

  return (
    <>
      <h1 className="admin-page-title">Edit {document.number}</h1>
      <DocumentForm
        mode="edit"
        initial={{
          id: document.id,
          type: document.type,
          number: document.number,
          clientId: document.clientId,
          projectName: document.projectName,
          currency: document.currency,
          issueDate: document.issueDate.toISOString().slice(0, 10),
          dueDate: document.dueDate?.toISOString().slice(0, 10) ?? "",
          validUntil: document.validUntil?.toISOString().slice(0, 10) ?? "",
          lineItems: parseLineItems(document.lineItems),
          paymentSchedule: parsePaymentSchedule(document.paymentSchedule),
          subtotal: document.subtotal,
          total: document.total,
          notes: document.notes ?? "",
          status: document.status,
        }}
      />
    </>
  );
}
