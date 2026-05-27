const BRAND_COLUMNS = [
  {
    label: "SYSTEMS",
    text: "Strategy before execution.",
  },
  {
    label: "DESIGN",
    text: "Every pixel intentional.",
  },
  {
    label: "BUILD",
    text: "Full-stack. Integrated. Deployed.",
  },
] as const;

export function ContactBrandStrip() {
  return (
    <section className="contact-brand-strip" aria-label="COREFRAME capabilities">
      <div className="container">
        <div className="contact-brand-strip__grid">
          {BRAND_COLUMNS.map((column) => (
            <div key={column.label} className="contact-brand-strip__column">
              <p className="contact-brand-strip__label">{column.label}</p>
              <p className="contact-brand-strip__text">{column.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
