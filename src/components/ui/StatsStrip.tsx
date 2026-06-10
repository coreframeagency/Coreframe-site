"use client";

import { useEffect, useRef, useState } from "react";
import { RevealOnScroll } from "./RevealOnScroll";

const STATS = [
  { value: 12, suffix: "+", label: "Projects Shipped" },
  { value: 3, suffix: "", label: "Countries" },
  { value: 8, suffix: "", label: "Systems Live" },
] as const;

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        const start = performance.now();
        const duration = 1200;

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplayValue(Math.round(value * progress));
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stats-strip__item">
      <p className="stats-strip__number">
        {displayValue}
        {suffix}
      </p>
      <p className="stats-strip__label">{label}</p>
    </div>
  );
}

export function StatsStrip() {
  return (
    <RevealOnScroll className="stats-strip">
      {STATS.map((stat) => (
        <AnimatedStat
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </RevealOnScroll>
  );
}
