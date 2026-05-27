export const SERVICE_LAYERS = [
  {
    title: "STRATEGY",
    description:
      "We map the system before touching the interface. Discovery, architecture, and roadmap first.",
  },
  {
    title: "DESIGN",
    description:
      "Every screen is designed with intent. Interface, identity, and experience as one system.",
  },
  {
    title: "BUILD",
    description:
      "We ship full-stack. Front to back, integrated and deployed. Things that actually work.",
  },
] as const;

export const SYSTEMS_TABS = [
  { id: "strategy", label: "STRATEGY" },
  { id: "design", label: "DESIGN" },
  { id: "build", label: "BUILD" },
  { id: "stack", label: "STACK CALCULATOR" },
] as const;

export type SystemsTabId = (typeof SYSTEMS_TABS)[number]["id"];
