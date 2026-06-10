"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    document.body.classList.add("has-custom-cursor");
    const cursor = cursorRef.current;
    if (!cursor) return;

    function onMouseMove(event: MouseEvent) {
      if (!cursor) return;

      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      setIsVisible(true);

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-cursor='hover']");
      setIsHovering(Boolean(interactive));
    }

    function onMouseLeave() {
      setIsVisible(false);
      setIsHovering(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor hidden md:block ${isVisible ? "is-visible" : ""} ${isHovering ? "is-hovering" : ""}`}
      aria-hidden="true"
    >
      <div className="custom-cursor__inner">
        <span className="custom-cursor__ring" />
        <span className="custom-cursor__dot" />
        <span className="custom-cursor__label">VIEW →</span>
      </div>
    </div>
  );
}
