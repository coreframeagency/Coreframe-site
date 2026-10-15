import Link from "next/link";
import { WorkList } from "@/components/admin/WorkList";

export const dynamic = "force-dynamic";

export default function AdminWorkPage() {
  return (
    <>
      <div className="admin-work__header">
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Work
        </h1>
        <div className="admin-work__header-actions">
          <Link href="/work" target="_blank" className="admin-btn admin-btn--ghost">
            View /work ↗
          </Link>
          <Link href="/admin/work/new" className="admin-btn admin-btn--primary">
            Add work
          </Link>
        </div>
      </div>
      <WorkList />
    </>
  );
}
