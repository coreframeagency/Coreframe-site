import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    number: "01",
    title: "STRATEGY",
    description:
      "We map the system before touching the interface. Discovery, architecture, and roadmap first.",
    delay: 0,
  },
  {
    number: "02",
    title: "DESIGN",
    description:
      "Every screen is designed with intent. Interface, identity, and experience as one system.",
    delay: 150,
  },
  {
    number: "03",
    title: "BUILD",
    description:
      "We ship full-stack. Front to back, integrated and deployed. Things that actually work.",
    delay: 300,
  },
] as const;

export function CoreframeMethod() {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="method-heading-wrap">
          <h2 className="method-heading">
            <div className="method-heading-marquee">
              <div className="method-heading-marquee__track">
                <span className="method-heading__line">
                  The{" "}
                  <Image
                    src="/wordmark.png"
                    alt="coreframe."
                    width={1024}
                    height={179}
                    className="method-heading__wordmark"
                  />{" "}
                  Method
                </span>
              </div>
            </div>
          </h2>
        </Reveal>

        <div className="method-grid">
          {STEPS.map((step) => (
            <Reveal key={step.number} delay={step.delay}>
              <div className="method-column">
                <span className="method-column__number" aria-hidden="true">
                  {step.number}
                </span>
                <div className="method-column__content">
                  <h3 className="method-column__title">{step.title}</h3>
                  <p className="method-column__body">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
