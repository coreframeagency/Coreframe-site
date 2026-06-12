import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentViewer } from "@/components/admin/DocumentViewer";
import { prisma } from "@/lib/prisma";
import "../../admin/admin.css";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pdf?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document || document.type !== "QUOTATION") {
    return { title: "Quotation" };
  }

  return {
    title: document.number,
    description: `${document.projectName} — ${document.client.company}`,
    openGraph: {
      title: document.number,
      description: `${document.projectName} — ${document.client.company}`,
      images: ["/og-image.png"],
    },
  };
}

export default async function PublicQuotationPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { pdf } = await searchParams;

  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document || document.type !== "QUOTATION") notFound();

  return (
    <DocumentViewer
      document={document}
      showActions={pdf !== "true"}
      pdfEndpoint={`/api/quotation/${document.id}/pdf`}
    />
  );
}
