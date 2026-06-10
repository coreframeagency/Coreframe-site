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
      { id: "2-3months", label: "2 to 3 months is fine" },
      { id: "flexible", label: "Timeline is flexible" },
    ],
  },
  {
    question: "What is your approximate budget?",
    options: [
      { id: "under150", label: "Under LKR 150,000" },
      { id: "150-500", label: "LKR 150,000 to 500,000" },
      { id: "500plus", label: "LKR 500,000 and above" },
    ],
  },
] as const;

const RECOMMENDATIONS: Record<string, string> = {
  website: "COREFRAME Web Build",
  webapp: "COREFRAME Custom System",
  brand: "COREFRAME Full Stack",
};

export function ProjectQualifier() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const complete = step >= STEPS.length;

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
  };

  const handleNext = () => {
    if (!selected) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);
    setStep((s) => s + 1);
  };

  const handleScrollToForm = () => {
    document.getElementById("contact-form-card")?.scrollIntoView({ behavior: "smooth" });
  };

  if (complete) {
    const situation = answers[0] ?? "website";
    return (
      <div className="project-qualifier project-qualifier--result">
        <div className="project-qualifier__progress">
          {STEPS.map((_, i) => (
            <span key={i} className="project-qualifier__progress-bar is-filled" />
          ))}
        </div>
        <p className="project-qualifier__result-heading">
          Based on your answers, you are a strong fit for COREFRAME.
        </p>
        <p className="project-qualifier__result-rec">
          {RECOMMENDATIONS[situation] ?? RECOMMENDATIONS.website}
        </p>
        <button type="button" className="project-qualifier__cta" onClick={handleScrollToForm}>
          Start a project →
        </button>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="project-qualifier">
      <div className="project-qualifier__progress">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`project-qualifier__progress-bar ${i < step ? "is-filled" : ""}`}
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
            style={{
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => handleSelect(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected && (
        <button type="button" className="project-qualifier__next" onClick={handleNext}>
          Continue →
        </button>
      )}
    </div>
  );
}
