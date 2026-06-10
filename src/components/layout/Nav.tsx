"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAV_LINKS } from "@/lib/navigation";

function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className={`nav-link text-sm tracking-wide text-[var(--cf-warm-white)]/80 transition-colors hover:text-[var(--cf-warm-white)] ${isActive ? "is-active text-[var(--cf-warm-white)]" : ""}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-[var(--z-nav)] bg-[#0B0B0B]"
      style={{ height: "var(--nav-height)" }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[1.5px] bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#A6FF00]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      <div className="container flex h-full w-full items-center justify-between">
        <Wordmark />

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-[2rem] md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              isActive={isActive(href)}
            />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="relative z-[calc(var(--z-overlay)+1)] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-px w-6 bg-[var(--cf-warm-white)] transition-transform duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-[var(--cf-warm-white)] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-[var(--cf-warm-white)] transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed inset-0 z-[var(--z-overlay)] flex flex-col items-center justify-center bg-[var(--cf-canvas)] transition-opacity duration-300 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col items-center gap-8"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-display text-3xl transition-colors ${isActive(href) ? "text-[var(--cf-lime)]" : "text-[var(--cf-warm-white)]"}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
