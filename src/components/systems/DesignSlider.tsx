"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function DesignSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(next, 5, 95));
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    function onMouseMove(event: MouseEvent) {
      updatePosition(event.clientX);
    }

    function onTouchMove(event: TouchEvent) {
      if (event.touches[0]) updatePosition(event.touches[0].clientX);
    }

    function onEnd() {
      setIsDragging(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="systems-widget">
      <p className="systems-widget__label">Design System</p>
      <p className="systems-widget__subtext">
        Drag to see the difference intentional design makes.
      </p>

      <div
        ref={containerRef}
        className="design-slider"
        onMouseDown={(event) => {
          setIsDragging(true);
          updatePosition(event.clientX);
        }}
        onTouchStart={(event) => {
          setIsDragging(true);
          if (event.touches[0]) updatePosition(event.touches[0].clientX);
        }}
      >
        <div className="design-slider__panel design-slider__panel--after">
          <span className="design-slider__badge">After — COREFRAME design system</span>
          <div className="design-slider__card design-slider__card--after">
            <h3 className="design-slider__card-title">Project intake</h3>
            <p className="design-slider__card-copy">
              Capture client details with clarity and structure.
            </p>
            <label className="design-slider__field-label">Company name</label>
            <div className="design-slider__input design-slider__input--after" />
            <label className="design-slider__field-label">Project scope</label>
            <div className="design-slider__input design-slider__input--after" />
            <button type="button" className="design-slider__button--after">
              Submit brief
            </button>
          </div>
        </div>

        <div
          className="design-slider__panel design-slider__panel--before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <span className="design-slider__badge design-slider__badge--before">
            Before — No design system
          </span>
          <div className="design-slider__card design-slider__card--before">
            <h3 className="design-slider__card-title--before">Project intake</h3>
            <p className="design-slider__card-copy--before">
              Capture client details with clarity and structure.
            </p>
            <label className="design-slider__field-label--before">Company name</label>
            <input type="text" className="design-slider__input--before" readOnly />
            <label className="design-slider__field-label--before">Project scope</label>
            <input type="text" className="design-slider__input--before" readOnly />
            <button type="button" className="design-slider__button--before">
              Submit brief
            </button>
          </div>
        </div>

        <div className="design-slider__handle" style={{ left: `${position}%` }}>
          <span className="design-slider__handle-icon">◀ ▶</span>
        </div>
      </div>

      <p className="design-slider__caption">
        Every pixel is intentional. Interface, identity, and experience as one system.
      </p>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
