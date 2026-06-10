const TESTIMONIALS = [
  {
    quote: (
      <>
        COREFRAME didn&apos;t just build a site — they rebuilt how our campus operates.{" "}
        <span className="proof-wall__highlight">
          Students enrol, pay, and access everything in one place now.
        </span>
      </>
    ),
    name: "epiccampus.live",
    role: "Education Platform",
    initials: "EC",
  },
  {
    quote: (
      <>
        First agency we worked with that understood logistics before they touched a design tool.{" "}
        <span className="proof-wall__highlight">The result speaks for itself.</span>
      </>
    ),
    name: "raicurujp.com",
    role: "Logistics · Japan",
    initials: "RC",
  },
] as const;

export function ProofWall() {
  return (
    <section className="section proof-wall-section">
      <div className="container">
        <p className="proof-wall__eyebrow">WHAT CLIENTS SAY.</p>
        <div className="proof-wall__grid">
          {TESTIMONIALS.map((item) => (
            <article key={item.name} className="proof-wall__card">
              <p className="proof-wall__quote">{item.quote}</p>
              <div className="proof-wall__client">
                <span className="proof-wall__avatar">{item.initials}</span>
                <div>
                  <p className="proof-wall__name">{item.name}</p>
                  <p className="proof-wall__role">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
