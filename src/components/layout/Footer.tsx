import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { NAV_LINKS } from "@/lib/navigation";
import { SOCIAL_LINKS } from "@/lib/social-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <RevealOnScroll className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Wordmark />
            <p className="text-tagline">
              SYSTEMS <span className="slash">/</span> STRATEGY{" "}
              <span className="slash">/</span> DESIGN
            </p>
            <nav className="site-footer__social" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, placeholder }) =>
                placeholder ? (
                  <a key={label} href={href} className="site-footer__social-link">
                    {/* LinkedIn URL TBD */}
                    {label}
                  </a>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="site-footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>
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

        <div className="site-footer__availability">
          <div className="site-footer__availability-row">
            <div className="site-footer__availability-left">
              <span className="site-footer__availability-dot site-footer__availability-dot--green" />
              <div>
                <p className="site-footer__availability-label">Taking new projects</p>
                <p className="site-footer__availability-sub">Updated June 2026</p>
              </div>
            </div>
            <span className="site-footer__availability-badge site-footer__availability-badge--amber">
              LIMITED
            </span>
          </div>
          <div className="site-footer__availability-row">
            <div className="site-footer__availability-left">
              <span className="site-footer__availability-dot site-footer__availability-dot--amber" />
              <div>
                <p className="site-footer__availability-label">Current capacity</p>
                <p className="site-footer__availability-sub">1 slot remaining this quarter</p>
              </div>
            </div>
            <span className="site-footer__availability-badge site-footer__availability-badge--amber">
              NEARLY FULL
            </span>
          </div>
          <div className="site-footer__availability-row">
            <div className="site-footer__availability-left">
              <span className="site-footer__availability-dot site-footer__availability-dot--green" />
              <div>
                <p className="site-footer__availability-label">Response time</p>
                <p className="site-footer__availability-sub">Typically within 24 hours</p>
              </div>
            </div>
            <span className="site-footer__availability-badge site-footer__availability-badge--lime">
              FAST
            </span>
          </div>
        </div>

        <div className="site-footer__copyright site-footer__copyright-row">
          <p>&copy; {year} COREFRAME. All rights reserved.</p>
          <p>coreframeagency@gmail.com</p>
        </div>
      </RevealOnScroll>
    </footer>
  );
}
