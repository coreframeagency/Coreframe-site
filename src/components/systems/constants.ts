export const SERVICE_LAYERS = [
  {
    title: "SYSTEMS",
    description:
      "We map the full operation before writing a line of code. Architecture, workflows, and infrastructure designed as one connected whole.",
  },
  {
    title: "STRATEGY",
    description:
      "We define what to build and why before touching the interface. Discovery, positioning, and a clear system blueprint first.",
  },
  {
    title: "DESIGN",
    description:
      "Every screen is designed with intent. Interface, identity, and experience as one system.",
  },
] as const;

export const SYSTEMS_TABS = [
  { id: "systems", label: "SYSTEMS" },
  { id: "strategy", label: "STRATEGY" },
  { id: "design", label: "DESIGN" },
  { id: "stack", label: "STACK CALCULATOR" },
] as const;

export type SystemsTabId = (typeof SYSTEMS_TABS)[number]["id"];
