import Link from "next/link";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Projects
        </h1>
        <Link href="/admin/projects/new" className="admin-btn admin-btn--primary">
          New Project
        </Link>
      </div>
      <ProjectsTable />
    </>
  );
}
