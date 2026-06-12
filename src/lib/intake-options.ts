export const PROJECT_TYPES = [
  "Custom System",
  "Web App + SaaS",
  "Internal Tool + Automation",
  "Brand + Digital Infrastructure",
  "Medical + Speciality System",
  "Not sure yet",
] as const;

export const TIMELINES = ["Under 6 weeks", "2-3 months", "Flexible"] as const;

export const BUDGETS = [
  "Under LKR 150,000",
  "LKR 150,000-500,000",
  "LKR 500,000+",
  "USD 1,000-5,000",
  "USD 5,000+",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type Budget = (typeof BUDGETS)[number];
