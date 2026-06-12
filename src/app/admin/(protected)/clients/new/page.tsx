"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
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
      company: String(formData.get("company") ?? ""),
      address: String(formData.get("address") ?? ""),
      country: String(formData.get("country") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Failed to create client");
        return;
      }

      router.push("/admin/clients");
      router.refresh();
    } catch {
      setError("Failed to create client");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">New client</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        {[
          { id: "name", label: "Name", required: true },
          { id: "email", label: "Email", required: true, type: "email" },
          { id: "company", label: "Company", required: true },
          { id: "address", label: "Address", required: true },
          { id: "country", label: "Country", required: true },
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
          <label className="admin-form-label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea id="notes" name="notes" className="admin-form-textarea" />
        </div>
        {error ? <p className="admin-login__error">{error}</p> : null}
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? "Creating…" : "Create client"}
        </button>
      </form>
    </>
  );
}
