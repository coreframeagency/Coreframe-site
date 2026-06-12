"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/intake-options";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? "") || null,
      projectType: String(formData.get("projectType") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      referral: String(formData.get("referral") ?? "") || null,
      value: formData.get("value") ? Number(formData.get("value")) : null,
      notes: String(formData.get("notes") ?? "") || null,
    };

    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Failed to create lead");
        return;
      }

      router.push("/admin/pipeline");
      router.refresh();
    } catch {
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">New lead</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        {[
          { id: "name", label: "Name", required: true },
          { id: "email", label: "Email", required: true, type: "email" },
          { id: "company", label: "Company (optional)" },
        ].map((field) => (
          <div key={field.id} className="admin-form-section">
            <label className="admin-form-label" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type ?? "text"}
              className="admin-form-input"
              required={field.required}
            />
          </div>
        ))}

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="projectType">
            Project type
          </label>
          <select id="projectType" name="projectType" className="admin-form-select" required>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="problem">
            Problem / brief
          </label>
          <textarea id="problem" name="problem" className="admin-form-textarea" required />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="timeline">
            Timeline
          </label>
          <select id="timeline" name="timeline" className="admin-form-select" required>
            {TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="budget">
            Budget
          </label>
          <select id="budget" name="budget" className="admin-form-select" required>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="referral">
            Referral (optional)
          </label>
          <input id="referral" name="referral" className="admin-form-input" />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="value">
            Estimated value (optional)
          </label>
          <input id="value" name="value" type="number" className="admin-form-input" />
        </div>

        <div className="admin-form-section">
          <label className="admin-form-label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea id="notes" name="notes" className="admin-form-textarea" />
        </div>

        {error ? <p className="admin-login__error">{error}</p> : null}
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? "Creating…" : "Create lead"}
        </button>
      </form>
    </>
  );
}
