"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: (n: number) => string;
};

export function CountUp({
  value,
  duration = 800,
  suffix = "",
  prefix = "",
  className = "",
  format,
}: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const next = Math.round(value * progress);
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  const text = format ? format(display) : `${prefix}${display}${suffix}`;

  return <span className={className}>{text}</span>;
}
