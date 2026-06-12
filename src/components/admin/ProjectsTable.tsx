"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhasePill } from "@/components/admin/PhasePill";
import { formatCurrency, formatDate } from "@/lib/admin-types";

type ProjectRow = {
  id: string;
  name: string;
  phase: string;
  value: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  client: { id: string; name: string; company: string };
  _count: { sprintLogs: number };
};

export function ProjectsTable() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data: ProjectRow[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Phase</th>
            <th>Value</th>
            <th>Sprints</th>
            <th>Start</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="is-clickable"
              onClick={() => router.push(`/admin/projects/${project.id}`)}
            >
              <td className="admin-table__name">{project.name}</td>
              <td>{project.client.name}</td>
              <td>
                <PhasePill phase={project.phase} />
              </td>
              <td className="admin-table__mono">
                {project.value != null ? formatCurrency(project.value, "LKR") : "—"}
              </td>
              <td className="admin-table__mono">{project._count.sprintLogs}</td>
              <td className="admin-table__mono">{formatDate(project.startDate)}</td>
              <td className="admin-table__mono">{formatDate(project.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
