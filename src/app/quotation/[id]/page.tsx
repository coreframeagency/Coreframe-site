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

const PUBLIC_DOC_STYLES = `
  .public-doc-compact .doc-page {
    min-height: auto;
    padding: 0;
    background: #0b0b0b;
  }
  .public-doc-compact .doc-page__inner {
    max-width: 56rem;
    margin: 0 auto;
    padding: 0;
  }
  .public-doc-compact .doc-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .public-doc-compact .wordmark img,
  .public-doc-compact .wordmark {
    height: 1.75rem !important;
    width: auto !important;
    object-fit: contain;
    object-position: left;
  }
  .public-doc-compact .doc-header__type {
    font-size: 1rem;
  }
  .public-doc-compact .doc-header__meta {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-header__meta > div:first-child {
    font-size: 0.875rem;
  }
  .public-doc-compact .doc-hairline {
    margin: 12px 0;
  }
  .public-doc-compact .doc-parties {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 12px;
  }
  .public-doc-compact .doc-parties > div:not(.doc-parties__divider) {
    flex: 1;
  }
  .public-doc-compact .doc-parties__divider {
    width: 1px;
    min-width: 1px;
    align-self: stretch;
    background: #1f1f1f;
  }
  .public-doc-compact .doc-party__label {
    font-size: 0.75rem;
    margin-bottom: 4px;
  }
  .public-doc-compact .doc-party__name {
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .public-doc-compact .doc-party__detail {
    font-size: 0.75rem;
    line-height: 1.35;
  }
  .public-doc-compact .doc-project-row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 12px;
    align-items: flex-start;
  }
  .public-doc-compact .doc-project-row > div {
    flex: 1;
  }
  .public-doc-compact .doc-project-row__label {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-project-row__value {
    font-size: 0.875rem;
  }
  .public-doc-compact .doc-status {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-table th {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  .public-doc-compact .doc-table td {
    font-size: 0.875rem;
    padding: 4px 8px;
  }
  .public-doc-compact .doc-table td:last-child {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-align: right;
  }
  .public-doc-compact .doc-total-row {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  .public-doc-compact .doc-total-row--grand {
    font-size: 1rem;
  }
  .public-doc-compact .doc-schedule-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 0.5px solid #1f1f1f;
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-schedule-item strong {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-schedule-item .doc-party__detail {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-notes {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-footer {
    font-size: 0.75rem;
  }
  .public-doc-compact .doc-actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .public-doc-compact .doc-actions__primary,
  .public-doc-compact .doc-actions__ghost {
    padding: 6px 14px;
    font-size: 0.625rem;
  }

  @media (max-width: 640px) {
    .public-doc-compact .doc-page__inner {
      padding: 0;
    }
    .public-doc-compact .doc-header {
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    .public-doc-compact .doc-header__meta {
      text-align: left;
    }
    .public-doc-compact .doc-header__type {
      justify-content: flex-start;
      font-size: 0.875rem;
    }
    .public-doc-compact .doc-header__meta > div:first-child {
      font-size: 0.75rem;
    }
    .public-doc-compact .doc-header__meta {
      font-size: 0.75rem;
    }
    .public-doc-compact .wordmark img,
    .public-doc-compact .wordmark {
      height: 1.5rem !important;
    }
    .public-doc-compact .doc-parties {
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
    }
    .public-doc-compact .doc-parties__divider {
      width: 100%;
      height: 0.5px;
      min-height: 0.5px;
      min-width: 0;
    }
    .public-doc-compact .doc-project-row {
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
    }
    .public-doc-compact .doc-table th:nth-child(2),
    .public-doc-compact .doc-table th:nth-child(3),
    .public-doc-compact .doc-table td:nth-child(2),
    .public-doc-compact .doc-table td:nth-child(3) {
      display: none;
    }
    .public-doc-compact .doc-table th:first-child,
    .public-doc-compact .doc-table td:first-child {
      width: 100%;
    }
    .public-doc-compact .doc-table th,
    .public-doc-compact .doc-table td {
      font-size: 0.75rem;
    }
    .public-doc-compact .doc-table td:first-child {
      font-size: 0.75rem;
    }
    .public-doc-compact .doc-table td:last-child {
      font-size: 0.75rem;
    }
    .public-doc-compact .doc-total-row {
      font-size: 0.75rem;
    }
    .public-doc-compact .doc-total-row--grand {
      font-size: 0.875rem;
    }
    .public-doc-compact .doc-actions {
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .public-doc-compact .doc-actions__primary,
    .public-doc-compact .doc-actions__ghost {
      width: 100%;
      text-align: center;
    }
  }
`;

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
      <style>{PUBLIC_DOC_STYLES}</style>
      <div className="public-doc-compact max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <DocumentViewer
          document={document}
          showActions={pdf !== "true"}
          pdfEndpoint={`/api/quotation/${document.id}/pdf`}
        />
      </div>
    </>
  );
}
