import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentViewer } from "@/components/admin/DocumentViewer";
import { prisma } from "@/lib/prisma";
import "../../admin/admin.css";

export const dynamic = "force-dynamic";

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
    <>
      <style>{`
        .public-doc-compact .doc-page { min-height: auto; padding: 24px; }
        .public-doc-compact .doc-page__inner { max-width: 960px; margin: 0 auto; padding: 24px; }
        .public-doc-compact .doc-header { gap: 12px; margin-bottom: 12px; }
        .public-doc-compact .wordmark { height: 16px !important; }
        .public-doc-compact .doc-header__type { font-size: 16px; }
        .public-doc-compact .doc-header__meta { font-size: 10px; }
        .public-doc-compact .doc-header__meta > div:first-child { font-size: 11px; }
        .public-doc-compact .doc-hairline { margin: 12px 0; }
        .public-doc-compact .doc-parties { gap: 12px; }
        .public-doc-compact .doc-party__label { font-size: 9px; margin-bottom: 4px; }
        .public-doc-compact .doc-party__name { font-size: 13px; margin-bottom: 2px; }
        .public-doc-compact .doc-party__detail { font-size: 10px; line-height: 1.35; }
        .public-doc-compact .doc-project-row { gap: 12px; }
        .public-doc-compact .doc-project-row__label { font-size: 9px; }
        .public-doc-compact .doc-project-row__value { font-size: 13px; }
        .public-doc-compact .doc-status { font-size: 9px; }
        .public-doc-compact .doc-table th { font-size: 9px; padding: 4px 8px; }
        .public-doc-compact .doc-table td { font-size: 11px; padding: 4px 8px; }
        .public-doc-compact .doc-total-row { font-size: 10px; padding: 4px 8px; }
        .public-doc-compact .doc-total-row--grand { font-size: 14px; }
        .public-doc-compact .doc-schedule-item { padding: 4px 0; font-size: 10px; }
        .public-doc-compact .doc-schedule-item strong { font-size: 10px; }
        .public-doc-compact .doc-schedule-item .doc-party__detail { font-size: 10px; }
        .public-doc-compact .doc-notes { font-size: 10px; }
        .public-doc-compact .doc-footer { font-size: 9px; }
        .public-doc-compact .doc-actions { gap: 8px; margin-top: 12px; }
        .public-doc-compact .doc-actions__primary,
        .public-doc-compact .doc-actions__ghost { padding: 6px 14px; font-size: 10px; }
      `}</style>
      <div className="public-doc-compact">
        <DocumentViewer
          document={document}
          showActions={pdf !== "true"}
          pdfEndpoint={`/api/quotation/${document.id}/pdf`}
        />
      </div>
    </>
  );
}
