"use client";

import { useMemo, useState } from "react";

export function ROICalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(1_000_000);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);

  const hoursRecaptured = useMemo(() => hoursPerWeek * 52, [hoursPerWeek]);
  const revenueUpside = useMemo(
    () => Math.round(monthlyRevenue * 12 * 0.2),
    [monthlyRevenue],
  );

  return (
    <div className="roi-calculator">
      <div className="roi-calculator__inputs">
        <label className="roi-calculator__field">
          <span className="roi-calculator__field-label">Monthly Revenue (LKR)</span>
          <input
            type="range"
            min={100_000}
            max={5_000_000}
            step={50_000}
            value={monthlyRevenue}
            onChange={(event) => setMonthlyRevenue(Number(event.target.value))}
            className="roi-calculator__slider"
          />
          <span className="roi-calculator__field-value">
            LKR {monthlyRevenue.toLocaleString()}
          </span>
        </label>
        <label className="roi-calculator__field">
          <span className="roi-calculator__field-label">Hours lost to manual work per week</span>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={hoursPerWeek}
            onChange={(event) => setHoursPerWeek(Number(event.target.value))}
            className="roi-calculator__slider"
          />
          <span className="roi-calculator__field-value">{hoursPerWeek} hrs</span>
        </label>
      </div>
      <div className="roi-calculator__panel">
        <div className="roi-calculator__output">
          <span className="roi-calculator__output-label">Hours recaptured per year</span>
          <span className="roi-calculator__output-value">{hoursRecaptured.toLocaleString()}</span>
          <span className="roi-calculator__output-sub">hrs × 52 weeks</span>
        </div>
        <div className="roi-calculator__output">
          <span className="roi-calculator__output-label">Revenue upside per year</span>
          <span className="roi-calculator__output-value">
            LKR {revenueUpside.toLocaleString()}
          </span>
          <span className="roi-calculator__output-sub">monthly revenue × 12 × 20%</span>
        </div>
      </div>
    </div>
  );
}
