"use client";

import { useEffect, useState } from "react";
import type { Project } from "./projects";

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
          <p className="work-modal__url">{project.url}</p>
        ) : (
          <div className="work-modal__url-spacer" />
        )}

        <div className="work-modal__section">
          <p className="work-modal__label">The Problem</p>
          <p className="work-modal__body">{project.problem}</p>
        </div>

        <div className="work-modal__section">
          <p className="work-modal__label">What We Built</p>
          <p className="work-modal__body">{project.built}</p>
        </div>

        <div className="work-modal__section work-modal__section--last">
          <p className="work-modal__label">The Result</p>
          <p className="work-modal__body">{project.result}</p>
        </div>
      </div>
    </div>
  );
}
