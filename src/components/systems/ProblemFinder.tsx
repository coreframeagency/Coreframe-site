"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const INDUSTRIES = [
  "Retail & E-commerce",
  "Food & Beverage",
  "Education & Training",
  "Healthcare & Wellness",
  "Professional Services",
  "Real Estate & Property",
  "Hospitality & Tourism",
  "Logistics & Supply Chain",
  "Finance & Accounting",
  "Media & Creative",
  "NGO & Non-profit",
  "Other",
] as const;

const PROBLEM_OPTIONS = [
  {
    id: "website",
    label: "My website is outdated or non-existent",
  },
  {
    id: "sell-online",
    label: "I need to sell online",
  },
  {
    id: "manual",
    label: "My team wastes time on manual processes",
  },
  {
    id: "data",
    label: "I have no visibility into my business data",
  },
  {
    id: "ai",
    label: "I need AI integrated into my product or service",
  },
  {
    id: "brand",
    label: "I have no consistent brand or identity",
  },
] as const;

const BUDGET_OPTIONS = [
  "Under LKR 100,000",
  "LKR 100,000 – 300,000",
  "LKR 300,000 – 750,000",
  "Not sure yet — let's talk",
] as const;

type Step = 1 | 2 | 3 | "result";

function getRecommendation(selectedProblems: string[]) {
  if (selectedProblems.includes("website") || selectedProblems.includes("sell-online")) {
    return "You need a conversion-optimised web system.";
  }
  if (selectedProblems.includes("manual") || selectedProblems.includes("data")) {
    return "You need an operations and data management system.";
  }
  if (selectedProblems.includes("ai")) {
    return "You need AI integrated into your workflow.";
  }
  if (selectedProblems.includes("brand")) {
    return "You need a brand and web system built from scratch.";
  }
  return "You need a system built around your business.";
}

function getProblemSummary(selectedProblems: string[]) {
  const labels = PROBLEM_OPTIONS.filter((option) =>
    selectedProblems.includes(option.id),
  ).map((option) => option.label.toLowerCase());

  if (labels.length === 0) return "your core challenges";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function getBudgetAcknowledgment(budget: string) {
  switch (budget) {
    case "Under LKR 100,000":
      return "Your budget works for a focused, well-scoped project.";
    case "LKR 100,000 – 300,000":
      return "Your budget is well-suited for a full system build.";
    case "LKR 300,000 – 750,000":
      return "Your budget allows for a comprehensive, integrated system.";
    default:
      return "No problem — we'll scope it together.";
  }
}

function getProgressWidth(step: Step) {
  if (step === 1) return "33%";
  if (step === 2) return "66%";
  return "100%";
}

export function ProblemFinder() {
  const [step, setStep] = useState<Step>(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep(1);
    setIndustry(null);
    setSelectedProblems([]);
    setBudget(null);
  }, []);

  const toggleProblem = (id: string) => {
    setSelectedProblems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const showResult = () => {
    if (budget) setStep("result");
  };

  const recommendation = getRecommendation(selectedProblems);
  const problemSummary = getProblemSummary(selectedProblems);

  return (
    <section className="problem-finder">
      <div className="container problem-finder__inner">
        <p className="problem-finder__label">CUSTOM DEVELOPMENT</p>

        <Reveal>
          <h2 className="problem-finder__heading">Got a problem we haven&apos;t listed?</h2>
        </Reveal>

        <Reveal>
          <p className="problem-finder__subheading">
            Tell us what you&apos;re dealing with. We&apos;ll show you what we&apos;d build.
          </p>
        </Reveal>

        <div className="problem-finder__widget">
          {step !== "result" ? (
            <>
              <p className="problem-finder__step-label">STEP {step} OF 3</p>
              <div className="problem-finder__progress" aria-hidden="true">
                <div
                  className="problem-finder__progress-fill"
                  style={{ width: getProgressWidth(step) }}
                />
              </div>
            </>
          ) : (
            <div className="problem-finder__result-header">
              <span className="problem-finder__result-check" aria-hidden="true">
                ✓
              </span>
              <p className="problem-finder__result-tag">YOUR SYSTEM PROFILE</p>
            </div>
          )}

          {step === 1 && (
            <div key="step-1" className="problem-finder__step">
              <h3 className="problem-finder__question">What industry are you in?</h3>
              <p className="problem-finder__subtext">Pick the closest match.</p>

              <div className="problem-finder__grid problem-finder__grid--industry">
                {INDUSTRIES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`problem-finder__card${
                      industry === option ? " is-selected" : ""
                    }`}
                    onClick={() => setIndustry(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {industry && (
                <div className="problem-finder__actions problem-finder__actions--end">
                  <button
                    type="button"
                    className="problem-finder__btn-next"
                    onClick={() => setStep(2)}
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div key="step-2" className="problem-finder__step">
              <h3 className="problem-finder__question">
                What&apos;s your biggest challenge right now?
              </h3>
              <p className="problem-finder__subtext">Select all that apply.</p>

              <div className="problem-finder__grid problem-finder__grid--problems">
                {PROBLEM_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`problem-finder__card${
                      selectedProblems.includes(option.id) ? " is-selected" : ""
                    }`}
                    onClick={() => toggleProblem(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {selectedProblems.length > 0 && (
                <div className="problem-finder__actions">
                  <button
                    type="button"
                    className="problem-finder__btn-back"
                    onClick={() => setStep(1)}
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    className="problem-finder__btn-next"
                    onClick={() => setStep(3)}
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div key="step-3" className="problem-finder__step">
              <h3 className="problem-finder__question">What&apos;s your budget range?</h3>
              <p className="problem-finder__subtext">
                This helps us recommend the right solution.
              </p>

              <div className="problem-finder__grid problem-finder__grid--budget">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`problem-finder__card problem-finder__card--budget${
                      budget === option ? " is-selected" : ""
                    }`}
                    onClick={() => setBudget(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {budget && (
                <div className="problem-finder__actions">
                  <button
                    type="button"
                    className="problem-finder__btn-back"
                    onClick={() => setStep(2)}
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    className="problem-finder__btn-next"
                    onClick={showResult}
                  >
                    SEE MY RECOMMENDATION →
                  </button>
                </div>
              )}
            </div>
          )}

          {step === "result" && industry && budget && (
            <div key="result" className="problem-finder__step problem-finder__result">
              <span className="problem-finder__pill">{industry}</span>

              <h3 className="problem-finder__recommendation">{recommendation}</h3>

              <p className="problem-finder__body">
                Based on what you&apos;ve told us, COREFRAME can build a system that addresses{" "}
                {problemSummary}. We&apos;ve done this before — and we&apos;ll do it properly.
              </p>

              <p className="problem-finder__budget-note">
                {getBudgetAcknowledgment(budget)}
              </p>

              <div className="problem-finder__divider" aria-hidden="true" />

              <Link href="/contact" className="problem-finder__cta">
                Let&apos;s build this →
              </Link>

              <button type="button" className="problem-finder__reset" onClick={reset}>
                ← Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
