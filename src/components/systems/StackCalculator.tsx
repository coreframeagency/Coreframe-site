"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StackTool = {
  id: string;
  name: string;
  cost: number;
};

const DEFAULT_TOOLS: StackTool[] = [
  { id: "website", name: "Website / CMS", cost: 29 },
  { id: "ecommerce", name: "E-commerce platform", cost: 79 },
  { id: "crm", name: "CRM / Sales tool", cost: 49 },
  { id: "email", name: "Email marketing", cost: 39 },
  { id: "analytics", name: "Analytics / Reporting", cost: 29 },
  { id: "pm", name: "Project management", cost: 19 },
];

const COREFRAME_START = 2400;

export function StackCalculator() {
  const [tools, setTools] = useState<StackTool[]>(DEFAULT_TOOLS);
  const [customTools, setCustomTools] = useState<StackTool[]>([]);

  const monthlyTotal = useMemo(() => {
    const base = tools.reduce((sum, tool) => sum + (Number(tool.cost) || 0), 0);
    const custom = customTools.reduce((sum, tool) => sum + (Number(tool.cost) || 0), 0);
    return base + custom;
  }, [tools, customTools]);

  const yearlyTotal = monthlyTotal * 12;
  const yearlySavings = Math.max(0, yearlyTotal - COREFRAME_START);

  function updateToolCost(id: string, cost: number) {
    setTools((current) =>
      current.map((tool) => (tool.id === id ? { ...tool, cost } : tool)),
    );
  }

  function addCustomTool() {
    setCustomTools((current) => [
      ...current,
      { id: `custom-${Date.now()}`, name: "Custom tool", cost: 0 },
    ]);
  }

  function updateCustomTool(id: string, field: "name" | "cost", value: string) {
    setCustomTools((current) =>
      current.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              [field]: field === "cost" ? Number(value) || 0 : value,
            }
          : tool,
      ),
    );
  }

  return (
    <div className="systems-widget">
      <p className="systems-widget__label">Stack Cost Calculator</p>
      <p className="systems-widget__subtext">
        See what your fragmented tools are actually costing you.
      </p>

      <div className="stack-calculator">
        <div className="stack-calculator__inputs">
          {tools.map((tool) => (
            <label key={tool.id} className="stack-calculator__row">
              <span className="stack-calculator__name">{tool.name}</span>
              <div className="stack-calculator__input-wrap">
                <span>£</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={tool.cost}
                  onChange={(event) =>
                    updateToolCost(tool.id, Number(event.target.value) || 0)
                  }
                  className="stack-calculator__input"
                />
              </div>
            </label>
          ))}

          {customTools.map((tool) => (
            <label key={tool.id} className="stack-calculator__row">
              <input
                type="text"
                value={tool.name}
                onChange={(event) =>
                  updateCustomTool(tool.id, "name", event.target.value)
                }
                className="stack-calculator__name-input"
              />
              <div className="stack-calculator__input-wrap">
                <span>£</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={tool.cost}
                  onChange={(event) =>
                    updateCustomTool(tool.id, "cost", event.target.value)
                  }
                  className="stack-calculator__input"
                />
              </div>
            </label>
          ))}

          <button type="button" className="stack-calculator__add" onClick={addCustomTool}>
            Add custom tool +
          </button>
        </div>

        <div className="stack-calculator__results">
          <p className="stack-calculator__results-label">Your current stack costs:</p>
          <p className="stack-calculator__monthly">
            £{monthlyTotal.toLocaleString("en-GB")}
            <span>/mo</span>
          </p>
          <p className="stack-calculator__yearly">
            Per year: £{yearlyTotal.toLocaleString("en-GB")}
          </p>
          <p className="stack-calculator__coreframe">
            A custom COREFRAME system starts from £{COREFRAME_START.toLocaleString("en-GB")}
          </p>
          {monthlyTotal > 200 && (
            <p className="stack-calculator__savings">
              You could save up to £{yearlySavings.toLocaleString("en-GB")} per year with one
              integrated system.
            </p>
          )}
          <Link href="/contact" className="stack-calculator__cta">
            Get a custom quote →
          </Link>
        </div>
      </div>
    </div>
  );
}
