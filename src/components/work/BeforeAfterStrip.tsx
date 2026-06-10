import type { BeforeAfter } from "./projects";

interface BeforeAfterStripProps {
  data: BeforeAfter;
}

export function BeforeAfterStrip({ data }: BeforeAfterStripProps) {
  return (
    <div className="work-modal__before-after">
      <div className="work-modal__ba-column">
        <p className="work-modal__ba-label">BEFORE</p>
        {data.before.map((item, index) => (
          <p
            key={index}
            className={`work-modal__ba-item ${index < data.before.length - 1 ? "work-modal__ba-item--bordered" : ""}`}
          >
            {item}
          </p>
        ))}
      </div>
      <div className="work-modal__ba-column">
        <p className="work-modal__ba-label work-modal__ba-label--after">AFTER COREFRAME.</p>
        {data.after.map((item, index) => (
          <p
            key={index}
            className={`work-modal__ba-item ${index < data.after.length - 1 ? "work-modal__ba-item--bordered" : ""}`}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
