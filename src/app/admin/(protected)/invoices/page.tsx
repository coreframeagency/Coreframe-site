import { DocumentList } from "@/components/admin/DocumentList";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminInvoicesPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  return <DocumentList type="INVOICE" title="Invoices" initialFilter={status ?? "all"} />;
}
