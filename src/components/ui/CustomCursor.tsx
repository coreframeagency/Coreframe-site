"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — small lime dot with slight follow delay.
 * Desktop only (pointer: fine). Hidden on touch devices.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    document.body.classList.add("has-custom-cursor");
    const cursor = cursorRef.current;
    if (!cursor) return;

    function onMouseMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
      cursor?.classList.add("is-visible");
    }

    function onMouseLeave() {
      cursor?.classList.remove("is-visible");
    }

    function animate() {
      const lerp = 0.15;
      position.current.x += (target.current.x - position.current.x) * lerp;
      position.current.y += (target.current.y - position.current.y) * lerp;

      if (cursor) {
        cursor.style.left = `${position.current.x}px`;
        cursor.style.top = `${position.current.y}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor hidden md:block"
      aria-hidden="true"
    />
  );
}
