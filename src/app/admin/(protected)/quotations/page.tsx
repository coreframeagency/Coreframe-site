import { DocumentList } from "@/components/admin/DocumentList";

export const dynamic = "force-dynamic";

export default function AdminQuotationsPage() {
  return <DocumentList type="QUOTATION" title="Quotations" />;
}
