"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Row = { before: string; after: string; highlight: string };

export type WorkFormValues = {
  id?: string;
  name: string;
  url: string;
  category: string;
  tag: string;
  year: string;
  headline: string;
  problem: string;
  built: string;
  result: string;
  inDevelopment: boolean;
  published: boolean;
  beforeAfter: { rows: Row[] } | null;
};

const EMPTY_ROWS: Row[] = [
  { before: "", after: "", highlight: "" },
  { before: "", after: "", highlight: "" },
  { before: "", after: "", highlight: "" },
];

export const EMPTY_WORK: WorkFormValues = {
  name: "",
  url: "",
  category: "",
  tag: "",
  year: String(new Date().getFullYear()),
  headline: "",
  problem: "",
  built: "",
  result: "",
  inDevelopment: false,
  published: true,
  beforeAfter: null,
};

export function WorkForm({ initial }: { initial: WorkFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);
  const [values, setValues] = useState<WorkFormValues>(initial);
  const [rows, setRows] = useState<Row[]>(
    initial.beforeAfter?.rows?.length === 3 ? initial.beforeAfter.rows : EMPTY_ROWS,
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof WorkFormValues>(key: K, value: WorkFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setRow(index: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const rowsFilled = rows.filter((r) => r.before.trim() && r.after.trim()).length;
    if (rowsFilled > 0 && rowsFilled < 3) {
      setError("Before / after needs all 3 rows filled, or leave all 3 empty.");
      setSaving(false);
      return;
    }

    const payload = { ...values, beforeAfter: rowsFilled === 3 ? { rows } : null };

    try {
      const res = await fetch(isEdit ? `/api/admin/work/${initial.id}` : "/api/admin/work", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to save");
        return;
      }
      router.push("/admin/work");
      router.refresh();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial.id) return;
    if (!window.confirm(`Delete "${values.name}" from the work page? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/work/${initial.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete");
        return;
      }
      router.push("/admin/work");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const text = (key: "name" | "url" | "category" | "tag" | "year", label: string, hint?: string, required = true) => (
    <div className="admin-form-section">
      <label className="admin-form-label" htmlFor={key}>
        {label}
      </label>
      <input
        id={key}
        className="admin-form-input"
        value={values[key]}
        required={required}
        onChange={(e) => set(key, e.target.value)}
        placeholder={hint}
      />
    </div>
  );

  const area = (key: "headline" | "problem" | "built" | "result", label: string, hint: string) => (
    <div className="admin-form-section">
      <label className="admin-form-label" htmlFor={key}>
        {label}
      </label>
      <textarea
        id={key}
        className="admin-form-textarea admin-work__textarea"
        value={values[key]}
        required
        onChange={(e) => set(key, e.target.value)}
        placeholder={hint}
      />
    </div>
  );

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-work__grid">
        {text("name", "Name", "ajplink.com")}
        {text("url", "Live URL", "https://ajplink.com — leave empty if private", false)}
        {text("category", "Category", "Recruitment Platform")}
        {text("tag", "Card tag", "RECRUITMENT PLATFORM")}
        {text("year", "Year", "2026")}
      </div>

      {area("headline", "Headline", "One or two sentences shown on the card.")}
      {area("problem", "Problem", "What was broken before.")}
      {area("built", "What we built", "Name the system, modules, stack.")}
      {area("result", "Result", "The outcome, plainly.")}

      <div className="admin-form-section">
        <p className="admin-form-label">Before / after — optional, all 3 rows or none</p>
        {rows.map((row, i) => (
          <div key={i} className="admin-work__ba-row">
            <input
              className="admin-form-input"
              placeholder="Before"
              value={row.before}
              onChange={(e) => setRow(i, "before", e.target.value)}
            />
            <input
              className="admin-form-input"
              placeholder="After"
              value={row.after}
              onChange={(e) => setRow(i, "after", e.target.value)}
            />
            <input
              className="admin-form-input"
              placeholder="Lime highlight (word from After)"
              value={row.highlight}
              onChange={(e) => setRow(i, "highlight", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="admin-work__checks">
        <label className="admin-work__check">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Show on /work
        </label>
        <label className="admin-work__check">
          <input
            type="checkbox"
            checked={values.inDevelopment}
            onChange={(e) => set("inDevelopment", e.target.checked)}
          />
          Mark as in development
        </label>
      </div>

      {error ? <p className="admin-login__error">{error}</p> : null}

      <div className="admin-work__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add work"}
        </button>
        {isEdit ? (
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
