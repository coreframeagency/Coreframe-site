"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const TOOLS_OPTIONS = [
  { label: "1–3 tools", score: 30 },
  { label: "4–7 tools", score: 20 },
  { label: "8–12 tools", score: 10 },
  { label: "13+ tools", score: 0 },
] as const;

const BOTTLENECK_OPTIONS = [
  { label: "No single source of truth", adjustment: -30 },
  { label: "Manual repetitive tasks", adjustment: -20 },
  { label: "Poor customer experience", adjustment: -15 },
  { label: "Can't see business data clearly", adjustment: -25 },
] as const;

const AGE_OPTIONS = [
  { label: "Less than 1 year", score: 30 },
  { label: "1–3 years", score: 20 },
  { label: "3–5 years", score: 10 },
  { label: "5+ years", score: 0 },
] as const;

type Step = 1 | 2 | 3 | "result";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getVerdict(score: number) {
  if (score > 70) {
    return "Your systems are relatively healthy. A few optimisations could unlock significant gains.";
  }
  if (score >= 40) {
    return "Your systems have gaps that are likely costing you time and money every day.";
  }
  return "Your systems are under serious strain. This is slowing your business down.";
}

function getBreakdown(
  toolsLabel: string,
  bottleneckLabel: string,
  ageLabel: string,
  score: number,
) {
  const lines = [
    `Tool sprawl (${toolsLabel}) is adding complexity to daily operations.`,
    `Your biggest bottleneck — ${bottleneckLabel.toLowerCase()} — is likely creating friction across teams.`,
    `A platform age of ${ageLabel.toLowerCase()} suggests parts of your stack may be due for modernisation.`,
  ];

  if (score > 70) {
    return [
      lines[0],
      "Your foundation is solid, but disconnected workflows may still be hiding inefficiencies.",
      "Targeted integration work could unlock the next stage of growth.",
    ];
  }

  if (score >= 40) {
    return lines;
  }

  return [
    lines[0],
    lines[1],
    "Multiple layers of your system need attention before scale becomes sustainable.",
  ];
}

export function SystemsAudit() {
  const [step, setStep] = useState<Step>(1);
  const [toolsIndex, setToolsIndex] = useState<number | null>(null);
  const [bottleneckIndex, setBottleneckIndex] = useState<number | null>(null);
  const [ageIndex, setAgeIndex] = useState<number | null>(null);

  const result = useMemo(() => {
    if (toolsIndex === null || bottleneckIndex === null || ageIndex === null) {
      return null;
    }

    const toolsScore = TOOLS_OPTIONS[toolsIndex].score;
    const bottleneckAdj = BOTTLENECK_OPTIONS[bottleneckIndex].adjustment;
    const ageScore = AGE_OPTIONS[ageIndex].score;
    const score = clamp(60 + toolsScore + ageScore + bottleneckAdj, 0, 100);

    return {
      score,
      verdict: getVerdict(score),
      breakdown: getBreakdown(
        TOOLS_OPTIONS[toolsIndex].label,
        BOTTLENECK_OPTIONS[bottleneckIndex].label,
        AGE_OPTIONS[ageIndex].label,
        score,
      ),
    };
  }, [toolsIndex, bottleneckIndex, ageIndex]);

  function selectTools(index: number) {
    setToolsIndex(index);
    setStep(2);
  }

  function selectBottleneck(index: number) {
    setBottleneckIndex(index);
    setStep(3);
  }

  function selectAge(index: number) {
    setAgeIndex(index);
    setStep("result");
  }

  function reset() {
    setStep(1);
    setToolsIndex(null);
    setBottleneckIndex(null);
    setAgeIndex(null);
  }

  return (
    <div className="systems-widget">
      <p className="systems-widget__label">Systems Audit</p>
      <p className="systems-widget__subtext">
        Answer 3 questions. We&apos;ll show you where your system is broken.
      </p>

      {step === 1 && (
        <div className="systems-quiz">
          <p className="systems-quiz__question">
            Step 1: How many tools does your team use daily?
          </p>
          <div className="systems-quiz__options">
            {TOOLS_OPTIONS.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className="systems-quiz__option"
                onClick={() => selectTools(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="systems-quiz">
          <p className="systems-quiz__question">
            Step 2: What&apos;s your biggest operational bottleneck?
          </p>
          <div className="systems-quiz__options">
            {BOTTLENECK_OPTIONS.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className="systems-quiz__option"
                onClick={() => selectBottleneck(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="systems-quiz">
          <p className="systems-quiz__question">
            Step 3: How old is your current website or platform?
          </p>
          <div className="systems-quiz__options">
            {AGE_OPTIONS.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className="systems-quiz__option"
                onClick={() => selectAge(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="systems-audit-result">
          <p className="systems-audit-result__heading">System Health Score</p>
          <p className="systems-audit-result__score">
            {result.score}
            <span className="systems-audit-result__score-max"> / 100</span>
          </p>
          <div className="systems-audit-result__bar">
            <div
              className="systems-audit-result__bar-fill"
              style={{ width: `${result.score}%` }}
            />
          </div>
          <p className="systems-audit-result__verdict">{result.verdict}</p>
          <div className="systems-audit-result__breakdown">
            {result.breakdown.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Link href="/contact" className="systems-audit-result__cta">
            Let&apos;s fix this →
          </Link>
          <button type="button" className="systems-audit-result__reset" onClick={reset}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
