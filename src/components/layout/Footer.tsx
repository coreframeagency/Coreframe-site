import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAV_LINKS } from "@/lib/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Wordmark />
            <p className="text-tagline">
              Systems <span style={{ color: "#A6FF00" }}>/</span> Strategy{" "}
              <span style={{ color: "#A6FF00" }}>/</span> Design
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="nav-link text-sm text-[var(--cf-warm-white)]/60 transition-colors hover:text-[var(--cf-warm-white)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__copyright site-footer__copyright-row">
          <p>&copy; {year} COREFRAME. All rights reserved.</p>
          <p>
            {/* PLACEHOLDER: Replace with official contact email */}
            hello@coreframe.placeholder
          </p>
        </div>
      </div>
    </footer>
  );
}
