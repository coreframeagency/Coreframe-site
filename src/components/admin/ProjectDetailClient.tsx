"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { ProjectPhase } from "@prisma/client";
import { PhasePill } from "@/components/admin/PhasePill";
import { formatCurrency, formatDate } from "@/lib/admin-types";

const PHASES: ProjectPhase[] = ["MAP", "DESIGN", "BUILD", "OPERATE"];

type SprintLog = {
  id: string;
  title: string;
  description: string;
  date: string;
};

type ProjectData = {
  id: string;
  name: string;
  phase: ProjectPhase;
  value: number | null;
  notes: string | null;
  startDate: string | null;
  endDate: string | null;
  client: { id: string; name: string; company: string; email: string };
  sprintLogs: SprintLog[];
};

export function ProjectDetailClient({ project: initial }: { project: ProjectData }) {
  const [project, setProject] = useState(initial);
  const [saving, setSaving] = useState(false);

  const phaseIndex = PHASES.indexOf(project.phase);

  async function patchProject(data: Record<string, unknown>) {
    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return;
    const updated = (await response.json()) as ProjectData;
    setProject((prev) => ({ ...prev, ...updated }));
  }

  async function handlePhaseClick(phase: ProjectPhase) {
    await patchProject({ phase });
    setProject((prev) => ({ ...prev, phase }));
  }

  async function handleAddSprint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}/sprint-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          date: String(formData.get("date") ?? "") || undefined,
        }),
      });
      if (!response.ok) return;
      const log = (await response.json()) as SprintLog;
      setProject((prev) => ({
        ...prev,
        sprintLogs: [log, ...prev.sprintLogs],
      }));
      event.currentTarget.reset();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 8 }}>
            {project.name}
          </h1>
          <PhasePill phase={project.phase} />
        </div>
        <Link href={`/admin/clients/${project.client.id}`} className="admin-btn admin-btn--ghost">
          {project.client.name} →
        </Link>
      </div>

      <div className="admin-phase-tracker" style={{ marginBottom: 32 }}>
        {PHASES.map((phase, index) => (
          <button
            key={phase}
            type="button"
            className={`admin-phase-tracker__step ${index === phaseIndex ? "is-active" : ""} ${index < phaseIndex ? "is-complete" : ""}`}
            onClick={() => handlePhaseClick(phase)}
          >
            {phase}
          </button>
        ))}
      </div>

      <div className="admin-project-layout">
        <div>
          <p className="admin-eyebrow">Sprint log</p>
          <div className="admin-sprint-feed" style={{ marginBottom: 32 }}>
            {project.sprintLogs.length ? (
              project.sprintLogs.map((log) => (
                <article key={log.id} className="admin-sprint-item">
                  <h3 className="admin-sprint-item__title">{log.title}</h3>
                  <p className="admin-sprint-item__date">{formatDate(log.date)}</p>
                  <p className="admin-sprint-item__body">{log.description}</p>
                </article>
              ))
            ) : (
              <p>No sprint logs yet.</p>
            )}
          </div>

          <form className="admin-form" onSubmit={handleAddSprint}>
            <p className="admin-eyebrow">Add sprint log</p>
            <div className="admin-form-section">
              <label className="admin-form-label" htmlFor="title">
                Title
              </label>
              <input id="title" name="title" className="admin-form-input" required />
            </div>
            <div className="admin-form-section">
              <label className="admin-form-label" htmlFor="description">
                Description
              </label>
              <textarea id="description" name="description" className="admin-form-textarea" required />
            </div>
            <div className="admin-form-section">
              <label className="admin-form-label" htmlFor="date">
                Date
              </label>
              <input id="date" name="date" type="date" className="admin-form-input" />
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? "Adding…" : "Add log"}
            </button>
          </form>
        </div>

        <aside>
          <p className="admin-eyebrow">Details</p>
          <div className="admin-detail-grid">
            <div>
              <p className="admin-detail-field__label">Client</p>
              <p className="admin-detail-field__value">
                <Link href={`/admin/clients/${project.client.id}`} className="admin-btn--link">
                  {project.client.name}
                </Link>
              </p>
              <p className="admin-detail-field__value">{project.client.company}</p>
              <p className="admin-detail-field__value">{project.client.email}</p>
            </div>
            <div>
              <p className="admin-detail-field__label">Value</p>
              <p className="admin-detail-field__value">
                {project.value != null ? formatCurrency(project.value, "LKR") : "—"}
              </p>
            </div>
            <div>
              <p className="admin-detail-field__label">Start</p>
              <p className="admin-detail-field__value">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="admin-detail-field__label">End</p>
              <p className="admin-detail-field__value">{formatDate(project.endDate)}</p>
            </div>
            <div className="admin-form-section">
              <label className="admin-form-label" htmlFor="project-notes">
                Notes
              </label>
              <textarea
                id="project-notes"
                className="admin-form-textarea"
                defaultValue={project.notes ?? ""}
                onBlur={(e) => patchProject({ notes: e.target.value })}
              />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
