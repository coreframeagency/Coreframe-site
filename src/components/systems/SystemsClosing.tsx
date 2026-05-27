import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function SystemsClosing() {
  return (
    <section className="systems-closing">
      <div className="container systems-closing__inner">
        <Reveal>
          <h2 className="systems-closing__heading">
            Every COREFRAME engagement starts at the system level.
          </h2>
        </Reveal>
        <Reveal>
          <p className="systems-closing__subline">
            We don&apos;t just build features. We build infrastructure.
          </p>
        </Reveal>
        <Reveal>
          <Link href="/contact" className="systems-closing__cta">
            Start a project →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
