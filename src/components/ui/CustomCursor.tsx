"use client";

import { useEffect, useRef } from "react";

/**
 * Lag-free custom cursor.
 * - Position is written straight to `transform` (GPU-composited) once per frame via rAF.
 * - No React state on mousemove: hover/visible flags toggle classes directly, only when they change.
 * - No CSS transition on position, so the cursor never trails the pointer.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.classList.add("has-custom-cursor");

    let x = 0;
    let y = 0;
    let frame = 0;
    let visible = false;
    let hovering = false;

    function render() {
      frame = 0;
      cursor!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);

      if (!visible) {
        visible = true;
        cursor!.classList.add("is-visible");
      }

      const target = event.target as Element | null;
      const isInteractive = Boolean(target?.closest?.("a, button, [data-cursor='hover']"));
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        cursor!.classList.toggle("is-hovering", hovering);
      }
    }

    function onLeave() {
      visible = false;
      hovering = false;
      cursor!.classList.remove("is-visible", "is-hovering");
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor hidden md:block" aria-hidden="true">
      <div className="custom-cursor__inner">
        <span className="custom-cursor__ring" />
        <span className="custom-cursor__dot" />
        <span className="custom-cursor__label">VIEW →</span>
      </div>
    </div>
  );
}
