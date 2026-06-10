"use client";

import { useEffect, useState } from "react";
import { BeforeAfterStrip } from "./BeforeAfterStrip";
import { getProjectBeforeAfter, type Project } from "./projects";

const PILLAR_SECTIONS = [
  {
    label: "SYSTEMS",
    body: "We map the full operation before writing a line of code. Architecture, workflows, and infrastructure designed as one connected whole.",
  },
  {
    label: "STRATEGY",
    body: "We define what to build and why before touching the interface. Discovery, positioning, and a clear system blueprint first.",
  },
  {
    label: "DESIGN",
    body: "Every screen is designed with intent. Interface, identity, and experience as one system.",
  },
] as const;

function projectHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!project) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const beforeAfter = getProjectBeforeAfter(project);

  return (
    <div
      className={`work-modal-overlay ${isVisible ? "is-open" : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`work-modal ${isVisible ? "is-open" : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
      >
        <button
          type="button"
          className="work-modal__close"
          onClick={onClose}
          aria-label="Close project details"
        >
          ✕
        </button>

        <div className="work-modal__meta">
          <span className="work-modal__tag">{project.tag}</span>
          <span className="work-modal__year">{project.year}</span>
        </div>

        <h2 id="work-modal-title" className="work-modal__name">
          {project.name}
        </h2>

        {project.url ? (
          <a
            href={projectHref(project.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="work-modal__visit text-[#A6FF00] text-sm font-medium hover:underline"
          >
            Visit site →
          </a>
        ) : (
          <div className="work-modal__url-spacer" />
        )}

        {PILLAR_SECTIONS.map((section, index) => (
          <div
            key={section.label}
            className={`work-modal__section ${index === PILLAR_SECTIONS.length - 1 && !beforeAfter ? "work-modal__section--last" : ""}`}
          >
            <p className="work-modal__label">{section.label}</p>
            <p className="work-modal__body">{section.body}</p>
          </div>
        ))}

        {beforeAfter ? <BeforeAfterStrip data={beforeAfter} /> : null}
      </div>
    </div>
  );
}
