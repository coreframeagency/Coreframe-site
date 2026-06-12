import Link from "next/link";
import { PipelineBoard } from "@/components/admin/PipelineBoard";

export default function PipelinePage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          pipeline.
        </h1>
        <Link href="/admin/leads/new" className="admin-btn admin-btn--primary">
          Add Lead
        </Link>
      </div>
      <PipelineBoard />
    </>
  );
}
