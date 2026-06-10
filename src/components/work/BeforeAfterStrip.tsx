import type { BeforeAfter } from "./projects";

interface BeforeAfterStripProps {
  data: BeforeAfter;
}

function renderAfterText(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="work-modal__ba-highlight">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export function BeforeAfterStrip({ data }: BeforeAfterStripProps) {
  return (
    <div className="work-modal__before-after">
      <div className="work-modal__ba-column work-modal__ba-column--before">
        <p className="work-modal__ba-label">BEFORE</p>
        {data.rows.map((row, index) => (
          <p
            key={index}
            className={`work-modal__ba-item work-modal__ba-item--before ${index < data.rows.length - 1 ? "work-modal__ba-item--bordered" : ""}`}
          >
            {row.before}
          </p>
        ))}
      </div>
      <div className="work-modal__ba-divider" aria-hidden="true" />
      <div className="work-modal__ba-column work-modal__ba-column--after">
        <p className="work-modal__ba-label work-modal__ba-label--after">AFTER COREFRAME.</p>
        {data.rows.map((row, index) => (
          <p
            key={index}
            className={`work-modal__ba-item work-modal__ba-item--after ${index < data.rows.length - 1 ? "work-modal__ba-item--bordered" : ""}`}
          >
            {renderAfterText(row.after, row.highlight)}
          </p>
        ))}
      </div>
    </div>
  );
}
