"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type TransitionPhase = "idle" | "cover" | "uncover";

export function PageTransition() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isFirstRender = useRef(true);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathname.current = pathname;
      return;
    }

    if (prevPathname.current === pathname) return;

    prevPathname.current = pathname;
    setPhase("cover");

    const uncoverTimer = window.setTimeout(() => {
      setPhase("uncover");
    }, 350);

    const idleTimer = window.setTimeout(() => {
      setPhase("idle");
    }, 700);

    return () => {
      window.clearTimeout(uncoverTimer);
      window.clearTimeout(idleTimer);
    };
  }, [pathname]);

  return (
    <div
      className={`page-transition ${phase !== "idle" ? `is-${phase}` : ""}`}
      aria-hidden="true"
    />
  );
}
