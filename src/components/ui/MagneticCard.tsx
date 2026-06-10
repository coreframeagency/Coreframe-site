"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticCard({ children, className = "" }: MagneticCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!enabled || !wrapperRef.current || !innerRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    innerRef.current.style.setProperty("--glow-x", `${x}px`);
    innerRef.current.style.setProperty("--glow-y", `${y}px`);
    innerRef.current.style.setProperty("--glow-opacity", "1");
  }

  function handleMouseLeave() {
    if (!innerRef.current) return;

    innerRef.current.style.transform = "none";
    innerRef.current.style.setProperty("--glow-opacity", "0");
  }

  return (
    <div
      ref={wrapperRef}
      className={`magnetic-card ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="magnetic-card__inner">
        {children}
      </div>
    </div>
  );
}
