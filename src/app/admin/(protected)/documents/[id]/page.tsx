import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentDetailActions, DocumentSummary } from "@/components/admin/DocumentDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document) notFound();

  return (
    <>
      <h1 className="admin-page-title">{document.number}</h1>
      <DocumentDetailActions document={document} />
      <DocumentSummary
        document={{
          ...document,
          issueDate: document.issueDate.toISOString(),
          dueDate: document.dueDate?.toISOString() ?? null,
          validUntil: document.validUntil?.toISOString() ?? null,
        }}
      />
    </>
  );
}
