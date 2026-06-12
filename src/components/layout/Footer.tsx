import { Wordmark } from "@/components/brand/Wordmark";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AvailabilityIndicator } from "@/components/admin/AvailabilityIndicator";
import { getSiteSettings } from "@/lib/site-settings";
import { SOCIAL_LINKS } from "@/lib/social-links";
import type { AvailabilityStatus } from "@prisma/client";

export async function Footer() {
  const year = new Date().getFullYear();
  let settings = { availability: "OPEN" as AvailabilityStatus };
  try {
    settings = await getSiteSettings();
  } catch {
    // database not available during build
  }

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
        </div>

        <AvailabilityIndicator status={settings.availability} />

        <div className="site-footer__copyright site-footer__copyright-row">
          <p>&copy; {year} COREFRAME. All rights reserved.</p>
          <p>coreframeagency@gmail.com</p>
        </div>
      </RevealOnScroll>
    </footer>
  );
}
