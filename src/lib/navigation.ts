export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/systems", label: "Systems" },
  { href: "/contact", label: "Contact" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
