const ROWS = [
  {
    feature: "Custom system architecture",
    template: "Template-based",
    coreframe: "Built from scratch",
  },
  {
    feature: "Full-stack build",
    template: "Frontend only",
    coreframe: "Front to back",
  },
  {
    feature: "Ongoing operation",
    template: "Handoff and gone",
    coreframe: "Partnership model",
  },
  {
    feature: "Systems thinking first",
    template: "Design-first",
    coreframe: "Systems-first",
  },
  {
    feature: "Structured payment",
    template: "Full upfront",
    coreframe: "40 / 35 / 25",
  },
] as const;

export function ComparisonTable() {
  return (
    <section className="section comparison-section">
      <div className="container">
        <p className="comparison__eyebrow">WHY COREFRAME.</p>
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="comparison-table__th comparison-table__th--feature" />
              <th className="comparison-table__th">Template agencies</th>
              <th className="comparison-table__th comparison-table__th--coreframe">
                coreframe.
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, index) => (
              <tr
                key={row.feature}
                className={index === ROWS.length - 1 ? "comparison-table__row--last" : ""}
              >
                <td className="comparison-table__feature">{row.feature}</td>
                <td className="comparison-table__template">
                  <span className="comparison-table__mark comparison-table__mark--no">✕</span>
                  {row.template}
                </td>
                <td className="comparison-table__coreframe">
                  <span className="comparison-table__mark comparison-table__mark--yes">✓</span>
                  {row.coreframe}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
