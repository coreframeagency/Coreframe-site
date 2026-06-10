"use client";

import { useState } from "react";

const PHASES = [
  {
    id: "map",
    number: "01",
    label: "MAP",
    title: "MAP",
    description:
      "Discovery and system architecture. We map every workflow, integration point, and constraint before touching a design tool. You get a full system blueprint on day one.",
  },
  {
    id: "design",
    number: "02",
    label: "DESIGN",
    title: "DESIGN",
    description:
      "Wireframes, prototypes, and a complete design system. Every screen designed with intent — interface, identity, and experience as one unified system.",
  },
  {
    id: "build",
    number: "03",
    label: "BUILD",
    title: "BUILD",
    description:
      "Sprint-based full-stack engineering and QA. Front to back, integrated and deployed. We ship production-ready systems, not demos.",
  },
  {
    id: "operate",
    number: "04",
    label: "OPERATE",
    title: "OPERATE",
    description:
      "Ongoing deployment, monitoring, and iteration. This is a partnership, not a handoff. We stay in the system after it ships.",
  },
] as const;

export function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PHASES[activeIndex];
  const fillPercent = (activeIndex / (PHASES.length - 1)) * 100;

  return (
    <section className="process-timeline" aria-label="COREFRAME process">
      <div className="process-timeline__track-wrap">
        <div className="process-timeline__track">
          <div
            className="process-timeline__track-fill"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="process-timeline__nodes">
          {PHASES.map((phase, index) => {
            const isActive = index === activeIndex;
            const isDone = index < activeIndex;
            return (
              <button
                key={phase.id}
                type="button"
                className={`process-timeline__node ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                aria-label={`${phase.label} phase`}
              >
                <span className="process-timeline__node-circle">{phase.number}</span>
                <span
                  className={`process-timeline__node-label ${isActive || isDone ? "is-highlight" : ""}`}
                >
                  {phase.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="process-timeline__detail">
        <h3 className="process-timeline__detail-title">{active.title}</h3>
        <p className="process-timeline__detail-body">{active.description}</p>
      </div>
    </section>
  );
}
