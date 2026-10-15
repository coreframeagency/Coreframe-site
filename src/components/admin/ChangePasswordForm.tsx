"use client";

import { FormEvent, useState } from "react";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDone(false);

    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to change password.");
        return;
      }
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      setError("Failed to change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <p className="admin-work__hint" style={{ margin: 0 }}>
        Applies to this site and the live site. Both use the same database.
      </p>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="current">
          Current password
        </label>
        <input
          id="current"
          type="password"
          autoComplete="current-password"
          className="admin-form-input"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="next">
          New password — 10+ characters
        </label>
        <input
          id="next"
          type="password"
          autoComplete="new-password"
          className="admin-form-input"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          minLength={10}
          required
        />
      </div>

      <div className="admin-form-section">
        <label className="admin-form-label" htmlFor="confirm">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          className="admin-form-input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={10}
          required
        />
      </div>

      {error ? <p className="admin-login__error">{error}</p> : null}
      {done ? (
        <p className="admin-work__save admin-work__save--saved" style={{ margin: 0 }}>
          Password changed. Use the new one next time you log in.
        </p>
      ) : null}

      <div>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? "Saving…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
