"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollable > 0 ? window.scrollY / scrollable : 0;
      const footer = document.querySelector(".site-footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const nearFooter = footerTop <= window.innerHeight + 200;

      setVisible(scrollPercent >= 0.4 && !nearFooter);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <div className={`sticky-cta ${visible ? "is-visible" : ""}`}>
      <div className="sticky-cta__inner container">
        <p className="sticky-cta__text">
          <span className="sticky-cta__text-strong">1 project slot</span> remaining this quarter
        </p>
        <div className="sticky-cta__actions">
          <span className="sticky-cta__availability">
            <span className="sticky-cta__dot" />
            Limited availability
          </span>
          <Link href="/contact" className="sticky-cta__button">
            Start a project →
          </Link>
        </div>
      </div>
    </div>
  );
}
