"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

interface WorkReelProps {
  children: ReactNode;
}

export function WorkReel({ children }: WorkReelProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (!enabled || !viewportRef.current) return;

    setIsDragging(true);
    dragState.current = {
      startX: event.pageX,
      scrollLeft: viewportRef.current.scrollLeft,
    };
    viewportRef.current.style.cursor = "grabbing";
  }

  function endDrag() {
    if (!viewportRef.current) return;

    setIsDragging(false);
    viewportRef.current.style.cursor = "grab";
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!isDragging || !enabled || !viewportRef.current) return;

    event.preventDefault();
    const delta = event.pageX - dragState.current.startX;
    viewportRef.current.scrollLeft = dragState.current.scrollLeft - delta;
  }

  return (
    <div className="work-reel">
      <div
        ref={viewportRef}
        className={`work-reel__viewport ${enabled ? "is-desktop" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseMove={handleMouseMove}
      >
        <div className="work-reel__track">{children}</div>
      </div>
      <p className="work-reel__hint">← DRAG TO EXPLORE →</p>
    </div>
  );
}
