"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HEADLINE = "Your business runs on broken systems.";
const SUBLINE = "We build the infrastructure that fixes that.";
const TYPING_SPEED = 45;
const PRE_TYPE_DELAY = 600;
const CURSOR_HOLD = 400;
const CURSOR_FADE = 300;

type Phase =
  | "waiting"
  | "typing"
  | "cursor-hold"
  | "cursor-fade"
  | "subline-typing"
  | "subline-cursor-hold"
  | "subline-cursor-fade"
  | "cta"
  | "done";

function getCursorClass(
  show: boolean,
  blinking: boolean,
  fading: boolean,
): string {
  if (!show) return "opacity-0";
  if (blinking) return "animate-[hero-cursor-blink_1s_step-end_infinite] opacity-100";
  if (fading) return "opacity-0 transition-opacity duration-300";
  return "opacity-100";
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [typedText, setTypedText] = useState("");
  const [typedSubline, setTypedSubline] = useState("");
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);
  const [sublineCursorBlinking, setSublineCursorBlinking] = useState(true);
  const [sublineCursorFading, setSublineCursorFading] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase("typing");
      }, PRE_TYPE_DELAY),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    if (typedText.length >= HEADLINE.length) {
      setCursorBlinking(false);
      setPhase("cursor-hold");
      return;
    }

    const timer = setTimeout(() => {
      setTypedText(HEADLINE.slice(0, typedText.length + 1));
    }, TYPING_SPEED);

    return () => clearTimeout(timer);
  }, [phase, typedText]);

  useEffect(() => {
    if (phase !== "cursor-hold") return;

    const holdTimer = setTimeout(() => {
      setPhase("cursor-fade");
    }, CURSOR_HOLD);

    return () => clearTimeout(holdTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "cursor-fade") return;

    const fadeFrame = requestAnimationFrame(() => {
      setCursorFading(true);
    });

    const sublineStartTimer = setTimeout(() => {
      setPhase("subline-typing");
    }, CURSOR_FADE);

    return () => {
      cancelAnimationFrame(fadeFrame);
      clearTimeout(sublineStartTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "subline-typing") return;

    if (typedSubline.length >= SUBLINE.length) {
      setSublineCursorBlinking(false);
      setPhase("subline-cursor-hold");
      return;
    }

    const timer = setTimeout(() => {
      setTypedSubline(SUBLINE.slice(0, typedSubline.length + 1));
    }, TYPING_SPEED);

    return () => clearTimeout(timer);
  }, [phase, typedSubline]);

  useEffect(() => {
    if (phase !== "subline-cursor-hold") return;

    const holdTimer = setTimeout(() => {
      setPhase("subline-cursor-fade");
    }, CURSOR_HOLD);

    return () => clearTimeout(holdTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "subline-cursor-fade") return;

    const fadeFrame = requestAnimationFrame(() => {
      setSublineCursorFading(true);
    });

    const ctaTimer = setTimeout(() => {
      setCtaVisible(true);
      setPhase("cta");
    }, CURSOR_FADE);

    return () => {
      cancelAnimationFrame(fadeFrame);
      clearTimeout(ctaTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "cta") return;

    const doneTimer = setTimeout(() => setPhase("done"), 600);
    return () => clearTimeout(doneTimer);
  }, [phase]);

  const showHeadlineCursor =
    phase === "waiting" ||
    phase === "typing" ||
    phase === "cursor-hold" ||
    phase === "cursor-fade";

  const showSublineCursor =
    phase === "subline-typing" ||
    phase === "subline-cursor-hold" ||
    phase === "subline-cursor-fade";

  const headlineCursorClass = getCursorClass(
    showHeadlineCursor,
    cursorBlinking,
    cursorFading,
  );

  const sublineCursorClass = getCursorClass(
    showSublineCursor,
    sublineCursorBlinking,
    sublineCursorFading,
  );

  function scrollToNextSection() {
    heroRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__content">
        <h1 className="hero__headline min-h-[6rem] md:min-h-[8.5rem]">
          <span>{typedText}</span>
          <span
            className={`inline-block text-[var(--cf-lime)] ${headlineCursorClass}`}
            aria-hidden="true"
          >
            |
          </span>
        </h1>

        <div className="hero__subline-group">
          <p className="hero__subline" style={{ color: "#A6FF00" }}>
            <span>{typedSubline}</span>
            <span
              className={`inline-block ${sublineCursorClass}`}
              style={{ color: "#A6FF00" }}
              aria-hidden="true"
            >
              |
            </span>
          </p>
        </div>

        <div className={`hero__cta ${ctaVisible ? "is-visible" : "is-hidden"}`}>
          <Link href="/work" className="cta-link font-body text-[1rem] text-[var(--cf-lime)]">
            See our work →
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="hero__scroll-btn"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
      >
        <svg
          className="hero__scroll-arrow"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#F5F3EB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
