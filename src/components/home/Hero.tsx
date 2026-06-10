"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const HEADLINE_STATIC = "Your business runs on";
const CYCLING_PHRASES = [
  "broken systems.",
  "manual workflows.",
  "outdated infrastructure.",
] as const;
const SUBLINE = "We build the infrastructure that fixes that.";
const TYPING_SPEED = 45;
const DELETE_SPEED = 30;
const PHRASE_PAUSE = 1800;
const PRE_TYPE_DELAY = 600;
const CURSOR_HOLD = 400;
const CURSOR_FADE = 300;

type SublinePhase =
  | "waiting"
  | "typing"
  | "cursor-hold"
  | "cursor-fade"
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
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedPhrase, setTypedPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPhraseCursor, setShowPhraseCursor] = useState(true);

  const [sublinePhase, setSublinePhase] = useState<SublinePhase>("waiting");
  const [typedSubline, setTypedSubline] = useState("");
  const [sublineCursorBlinking, setSublineCursorBlinking] = useState(true);
  const [sublineCursorFading, setSublineCursorFading] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSublinePhase("typing");
    }, PRE_TYPE_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentPhrase = CYCLING_PHRASES[phraseIndex];
    let intervalId: number | undefined;
    let pauseTimeout: number | undefined;
    let active = true;

    function startTyping() {
      intervalId = window.setInterval(() => {
        if (!active) return;

        setTypedPhrase((prev) => {
          if (!isDeleting) {
            if (prev.length < currentPhrase.length) {
              return currentPhrase.slice(0, prev.length + 1);
            }

            if (intervalId) window.clearInterval(intervalId);
            pauseTimeout = window.setTimeout(() => {
              if (active) setIsDeleting(true);
            }, PHRASE_PAUSE);
            return prev;
          }

          if (prev.length > 0) {
            return currentPhrase.slice(0, prev.length - 1);
          }

          if (intervalId) window.clearInterval(intervalId);
          setIsDeleting(false);
          setPhraseIndex((index) => (index + 1) % CYCLING_PHRASES.length);
          return prev;
        });
      }, isDeleting ? DELETE_SPEED : TYPING_SPEED);
    }

    startTyping();

    return () => {
      active = false;
      if (intervalId) window.clearInterval(intervalId);
      if (pauseTimeout) window.clearTimeout(pauseTimeout);
    };
  }, [phraseIndex, isDeleting]);

  useEffect(() => {
    if (sublinePhase !== "typing") return;

    if (typedSubline.length >= SUBLINE.length) {
      setSublineCursorBlinking(false);
      setSublinePhase("cursor-hold");
      return;
    }

    const timer = window.setTimeout(() => {
      setTypedSubline(SUBLINE.slice(0, typedSubline.length + 1));
    }, TYPING_SPEED);

    return () => window.clearTimeout(timer);
  }, [sublinePhase, typedSubline]);

  useEffect(() => {
    if (sublinePhase !== "cursor-hold") return;

    const holdTimer = window.setTimeout(() => {
      setSublinePhase("cursor-fade");
    }, CURSOR_HOLD);

    return () => window.clearTimeout(holdTimer);
  }, [sublinePhase]);

  useEffect(() => {
    if (sublinePhase !== "cursor-fade") return;

    const fadeFrame = requestAnimationFrame(() => {
      setSublineCursorFading(true);
    });

    const ctaTimer = window.setTimeout(() => {
      setCtaVisible(true);
      setSublinePhase("cta");
    }, CURSOR_FADE);

    return () => {
      cancelAnimationFrame(fadeFrame);
      window.clearTimeout(ctaTimer);
    };
  }, [sublinePhase]);

  useEffect(() => {
    if (sublinePhase !== "cta") return;

    const doneTimer = window.setTimeout(() => setSublinePhase("done"), 600);
    return () => window.clearTimeout(doneTimer);
  }, [sublinePhase]);

  const showSublineCursor =
    sublinePhase === "typing" ||
    sublinePhase === "cursor-hold" ||
    sublinePhase === "cursor-fade";

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
      <RevealOnScroll className="hero__content">
        <h1 className="hero__headline">
          <span
            className="hero__headline-static"
            style={{ display: "block", color: "#F5F3EB" }}
          >
            {HEADLINE_STATIC}
          </span>
          <span
            className="hero__headline-typed"
            style={{ display: "block", color: "#A6FF00" }}
          >
            {typedPhrase}
            {showPhraseCursor ? (
              <span
                className="hero__headline-cursor animate-[hero-cursor-blink_1s_step-end_infinite]"
                style={{ color: "#A6FF00" }}
                aria-hidden="true"
              >
                |
              </span>
            ) : null}
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
      </RevealOnScroll>

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
