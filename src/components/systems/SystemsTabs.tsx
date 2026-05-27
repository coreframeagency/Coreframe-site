"use client";

import { useState } from "react";
import { SYSTEMS_TABS, type SystemsTabId } from "./constants";
import { SystemsAudit } from "./SystemsAudit";
import { DesignSlider } from "./DesignSlider";
import { LiveDashboard } from "./LiveDashboard";
import { StackCalculator } from "./StackCalculator";

export function SystemsTabs() {
  const [activeTab, setActiveTab] = useState<SystemsTabId>("strategy");

  return (
    <section className="systems-tabs">
      <div
        className="systems-tabs__bar"
        role="tablist"
        aria-label="Systems capabilities"
      >
        {SYSTEMS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`systems-tabs__tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="systems-tabs__panel" role="tabpanel">
        <div key={activeTab} className="systems-tabs__content">
          {activeTab === "strategy" && <SystemsAudit />}
          {activeTab === "design" && <DesignSlider />}
          {activeTab === "build" && <LiveDashboard />}
          {activeTab === "stack" && <StackCalculator />}
        </div>
      </div>
    </section>
  );
}
