"use client";

import { FormEvent, useState } from "react";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/intake-options";

const STEPS = [
  { key: "projectType", title: "What are you building?", subtitle: "Select the closest match." },
  { key: "timeline", title: "What's your timeline?", subtitle: "Helps us plan capacity." },
  { key: "budget", title: "What's your budget range?", subtitle: "No wrong answer — ballpark is fine." },
  { key: "problem", title: "Describe the problem", subtitle: "What should this system solve?" },
  { key: "contact", title: "Your details", subtitle: "We'll send a system brief within 24 hours." },
] as const;

export function StartForm() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function canAdvance() {
    if (step === 0) return !!projectType;
    if (step === 1) return !!timeline;
    if (step === 2) return !!budget;
    if (step === 3) return problem.trim().length > 0;
    return name.trim() && email.trim();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canAdvance()) return;

    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || null,
          projectType,
          problem,
          timeline,
          budget,
          referral: referral || null,
        }),
      });

      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="start-form__success">
        <p className="start-form__success-title">Brief received.</p>
        <p className="start-form__subtitle">
          We&apos;ll review your project and send a system brief within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="start-form__progress">
        {STEPS.map((_, index) => (
          <span
            key={index}
            className={`start-form__progress-dot ${index <= step ? "is-filled" : ""}`}
          />
        ))}
      </div>

      <h1 className="start-form__title">{current.title}</h1>
      <p className="start-form__subtitle">{current.subtitle}</p>

      {step === 0 ? (
        <div className="start-form__tiles">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`start-form__tile ${projectType === type ? "is-selected" : ""}`}
              onClick={() => setProjectType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="start-form__tiles">
          {TIMELINES.map((item) => (
            <button
              key={item}
              type="button"
              className={`start-form__tile ${timeline === item ? "is-selected" : ""}`}
              onClick={() => setTimeline(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="start-form__tiles">
          {BUDGETS.map((item) => (
            <button
              key={item}
              type="button"
              className={`start-form__tile ${budget === item ? "is-selected" : ""}`}
              onClick={() => setBudget(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {step === 3 ? (
        <textarea
          className="admin-form-textarea"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Tell us what you're trying to build and what's not working today…"
          required
        />
      ) : null}

      {step === 4 ? (
        <div className="admin-form" style={{ maxWidth: "100%" }}>
          <div className="admin-form-section">
            <label className="admin-form-label" htmlFor="start-name">
              Name
            </label>
            <input
              id="start-name"
              className="admin-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-section">
            <label className="admin-form-label" htmlFor="start-email">
              Email
            </label>
            <input
              id="start-email"
              type="email"
              className="admin-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-section">
            <label className="admin-form-label" htmlFor="start-company">
              Company (optional)
            </label>
            <input
              id="start-company"
              className="admin-form-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="admin-form-section">
            <label className="admin-form-label" htmlFor="start-referral">
              How did you hear about us? (optional)
            </label>
            <input
              id="start-referral"
              className="admin-form-input"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      {error ? <p className="admin-login__error">{error}</p> : null}

      <div className="start-form__actions">
        {step > 0 ? (
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
        ) : null}
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={!canAdvance() || loading}
        >
          {loading ? "Sending…" : isLast ? "Submit brief" : "Continue"}
        </button>
      </div>
    </form>
  );
}
