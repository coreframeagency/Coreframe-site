"use client";

import { useEffect, useState } from "react";
import type { AvailabilityStatus } from "@prisma/client";
import { AvailabilityIndicator } from "@/components/admin/AvailabilityIndicator";

const OPTIONS: Array<{ status: AvailabilityStatus; title: string; desc: string }> = [
  { status: "OPEN", title: "Open", desc: "Taking new projects — full capacity available." },
  { status: "LIMITED", title: "Limited", desc: "Selective intake — limited slots this quarter." },
  { status: "FULL", title: "Full", desc: "Not accepting new projects right now." },
];

export function AvailabilityClient() {
  const [status, setStatus] = useState<AvailabilityStatus>("OPEN");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/availability")
      .then((res) => res.json())
      .then((data: { availability: AvailabilityStatus }) => setStatus(data.availability))
      .catch(() => setStatus("OPEN"));
  }, []);

  async function handleSelect(next: AvailabilityStatus) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: next }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { availability: AvailabilityStatus };
      setStatus(data.availability);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">availability.</h1>

      <div className="admin-availability-cards">
        {OPTIONS.map((option) => (
          <button
            key={option.status}
            type="button"
            className={`admin-availability-card ${status === option.status ? "is-selected" : ""}`}
            disabled={saving}
            onClick={() => handleSelect(option.status)}
          >
            <p className="admin-availability-card__title">{option.title}</p>
            <p className="admin-availability-card__desc">{option.desc}</p>
          </button>
        ))}
      </div>

      <p className="admin-eyebrow">Site preview</p>
      <div className="admin-availability-preview">
        <AvailabilityIndicator status={status} />
      </div>
    </>
  );
}
