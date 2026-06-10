"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  {
    id: "website",
    label: "Website",
    description: "Positioning + full build",
    investment: "LKR 150,000–350,000",
    timeline: "4–6 weeks",
  },
  {
    id: "webapp",
    label: "Web App",
    description: "Custom SaaS or platform",
    investment: "LKR 400,000–900,000",
    timeline: "8–12 weeks",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    description: "Full commerce system",
    investment: "LKR 350,000–750,000",
    timeline: "6–10 weeks",
  },
  {
    id: "internal",
    label: "Internal Tool",
    description: "Automation + dashboards",
    investment: "LKR 200,000–500,000",
    timeline: "4–8 weeks",
  },
] as const;

type ProjectTypeId = (typeof PROJECT_TYPES)[number]["id"];

export function CostEstimator() {
  const [selected, setSelected] = useState<ProjectTypeId>("website");
  const active = PROJECT_TYPES.find((type) => type.id === selected) ?? PROJECT_TYPES[0];

  return (
    <div className="cost-estimator">
      <p className="cost-estimator__label">ESTIMATE YOUR PROJECT.</p>
      <div className="cost-estimator__grid">
        {PROJECT_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`cost-estimator__tile ${selected === type.id ? "is-selected" : ""}`}
            onClick={() => setSelected(type.id)}
          >
            <span className="cost-estimator__tile-title">{type.label}</span>
            <span className="cost-estimator__tile-desc">{type.description}</span>
          </button>
        ))}
      </div>
      <div className="cost-estimator__results">
        <div className="cost-estimator__result-row">
          <span className="cost-estimator__result-label">Estimated investment</span>
          <span className="cost-estimator__result-value">{active.investment}</span>
        </div>
        <div className="cost-estimator__result-row">
          <span className="cost-estimator__result-label">Typical timeline</span>
          <span className="cost-estimator__result-value">{active.timeline}</span>
        </div>
        <div className="cost-estimator__result-row">
          <span className="cost-estimator__result-label">Payment structure</span>
          <span className="cost-estimator__result-value">40 / 35 / 25</span>
        </div>
      </div>
    </div>
  );
}
