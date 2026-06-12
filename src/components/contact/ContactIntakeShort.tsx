"use client";

import { FormEvent, useState } from "react";
import { PROJECT_TYPES } from "@/lib/intake-options";

export function ContactIntakeShort() {
  const [projectType, setProjectType] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectType || !email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Prospect",
          email: email.trim(),
          projectType,
          problem: "Short intake — follow up requested",
          timeline: "Flexible",
          budget: "Not specified",
        }),
      });

      if (!response.ok) {
        setError("Could not submit. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="intake-short__success" style={{ color: "#a6ff00", fontFamily: "var(--font-body)" }}>
        Brief sent — we&apos;ll be in touch within 24 hours.
      </p>
    );
  }

  return (
    <form className="intake-short" onSubmit={handleSubmit}>
      <p className="admin-form-label" style={{ margin: 0 }}>
        What are you building?
      </p>
      <div className="intake-short__tiles">
        {PROJECT_TYPES.slice(0, 4).map((type) => (
          <button
            key={type}
            type="button"
            className={`intake-short__tile ${projectType === type ? "is-selected" : ""}`}
            onClick={() => setProjectType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="intake-email">
          Email
        </label>
        <input
          id="intake-email"
          type="email"
          className="admin-form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error ? <p className="admin-login__error">{error}</p> : null}

      <button
        type="submit"
        className="admin-btn admin-btn--primary"
        disabled={!projectType || !email.trim() || loading}
      >
        {loading ? "Sending…" : "Start brief"}
      </button>
    </form>
  );
}
