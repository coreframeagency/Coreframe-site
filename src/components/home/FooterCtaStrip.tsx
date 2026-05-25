import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function FooterCtaStrip() {
  return (
    <section className="footer-cta">
      <div className="container">
        <Reveal>
          <h2 className="footer-cta__heading">Ready to fix your systems?</h2>
        </Reveal>
        <Reveal>
          <Link href="/contact" className="footer-cta__link">
            Start a project →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
