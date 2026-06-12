import { DocumentList } from "@/components/admin/DocumentList";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminInvoicesPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  return <DocumentList type="INVOICE" title="Invoices" initialFilter={status ?? "all"} />;
}
