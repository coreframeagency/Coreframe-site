import { Reveal } from "@/components/ui/Reveal";

export function PositioningStatement() {
  return (
    <section className="section">
      <div className="container">
        <div className="positioning-block reveal-stagger">
          <Reveal>
            <p className="positioning-block__lead">
              COREFRAME is a full-stack web development agency that builds
              systems, not just websites.
            </p>
          </Reveal>
          <Reveal>
            <p className="positioning-block__body">
              We work with founders and operators who are done with band-aid
              solutions and ready for infrastructure that scales.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
