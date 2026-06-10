"use client";

import { useState } from "react";

const STEPS = [
  {
    question: "What best describes your situation?",
    options: [
      { id: "website", label: "I need a new website or web presence" },
      { id: "webapp", label: "I need a web app or internal tool built" },
      { id: "brand", label: "I need brand, design and build together" },
    ],
  },
  {
    question: "What is your timeline?",
    options: [
      { id: "6weeks", label: "I need this live within 6 weeks" },
      { id: "2-3months", label: "2–3 months is fine" },
      { id: "flexible", label: "Timeline is flexible" },
    ],
  },
  {
    question: "What is your approximate budget?",
    options: [
      { id: "under150", label: "Under LKR 150,000" },
      { id: "150-500", label: "LKR 150,000 – 500,000" },
      { id: "500plus", label: "LKR 500,000+" },
    ],
  },
] as const;

export function ProjectQualifier() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const complete = step >= STEPS.length;

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    const nextAnswers = [...answers, optionId];
    setAnswers(nextAnswers);
    setSelected(null);
    setStep((current) => current + 1);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleScrollToForm = () => {
    document.getElementById("contact-form-card")?.scrollIntoView({ behavior: "smooth" });
  };

  if (complete) {
    return (
      <div className="project-qualifier project-qualifier--result">
        <div className="project-qualifier__progress">
          {STEPS.map((_, index) => (
            <span key={index} className="project-qualifier__progress-dot is-filled" />
          ))}
        </div>
        <p className="project-qualifier__result-copy">
          Based on your answers, you are a strong fit for{" "}
          <span className="project-qualifier__result-highlight">COREFRAME Custom Build</span>.
          We will map your system architecture first, then design and ship the full stack. → Start
          a project and we will send you a system brief within 24 hours.
        </p>
        <button type="button" className="project-qualifier__cta" onClick={handleScrollToForm}>
          Start a project →
        </button>
        <button type="button" className="project-qualifier__restart" onClick={handleRestart}>
          Start over
        </button>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="project-qualifier">
      <div className="project-qualifier__progress">
        {STEPS.map((_, index) => (
          <span
            key={index}
            className={`project-qualifier__progress-dot ${index < step ? "is-filled" : ""}`}
          />
        ))}
      </div>
      <p className="project-qualifier__question">{current.question}</p>
      <div className="project-qualifier__options">
        {current.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`project-qualifier__option ${selected === option.id ? "is-selected" : ""}`}
            onClick={() => handleSelect(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
