import { DocumentForm } from "@/components/admin/DocumentForm";

export const dynamic = "force-dynamic";

export default function NewDocumentPage() {
  return (
    <>
      <h1 className="admin-page-title">New document</h1>
      <DocumentForm mode="create" />
    </>
  );
}
