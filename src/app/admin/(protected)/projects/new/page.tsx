"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ClientOption = { id: string; name: string; company: string };

const PHASES = ["MAP", "DESIGN", "BUILD", "OPERATE"] as const;

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then((data: ClientOption[]) => setClients(data))
      .catch(() => setClients([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      clientId: String(formData.get("clientId") ?? ""),
      phase: String(formData.get("phase") ?? "MAP"),
      startDate: String(formData.get("startDate") ?? "") || null,
      endDate: String(formData.get("endDate") ?? "") || null,
      value: formData.get("value") ? Number(formData.get("value")) : null,
      notes: String(formData.get("notes") ?? "") || null,
    };

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Failed to create project");
        return;
      }

      const project = (await response.json()) as { id: string };
      router.push(`/admin/projects/${project.id}`);
      router.refresh();
    } catch {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">New project</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="name">
            Project name
          </label>
          <input id="name" name="name" className="admin-form-input" required />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="clientId">
            Client
          </label>
          <select id="clientId" name="clientId" className="admin-form-select" required>
            <option value="">Select client…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.company}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="phase">
            Phase
          </label>
          <select id="phase" name="phase" className="admin-form-select" defaultValue="MAP">
            {PHASES.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="startDate">
            Start date
          </label>
          <input id="startDate" name="startDate" type="date" className="admin-form-input" />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="endDate">
            End date
          </label>
          <input id="endDate" name="endDate" type="date" className="admin-form-input" />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="value">
            Value (LKR)
          </label>
          <input id="value" name="value" type="number" className="admin-form-input" />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" name="notes" className="admin-form-textarea" />
        </div>

        {error ? <p className="admin-login__error">{error}</p> : null}
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? "Creating…" : "Create project"}
        </button>
      </form>
    </>
  );
}
