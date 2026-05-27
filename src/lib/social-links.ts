export type SocialLink = {
  label: string;
  href: string;
  placeholder?: boolean;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "INSTAGRAM", href: "https://instagram.com/coreframe.agency" },
  { label: "FACEBOOK", href: "https://facebook.com/coreframe.agency" },
  { label: "LINKEDIN", href: "#", placeholder: true },
];
