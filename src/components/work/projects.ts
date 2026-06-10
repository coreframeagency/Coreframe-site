export type BeforeAfterRow = {
  before: string;
  after: string;
  highlight: string;
};

export type BeforeAfter = {
  rows: [BeforeAfterRow, BeforeAfterRow, BeforeAfterRow];
};

export type Project = {
  id: string;
  name: string;
  url: string | null;
  category: string;
  tag: string;
  year: string;
  headline: string;
  problem: string;
  built: string;
  result: string;
  beforeAfter?: BeforeAfter;
};

export const PROJECT_BEFORE_AFTER_BY_HOST: Record<string, BeforeAfter> = {
  "epiccampus.live": {
    rows: [
      {
        before: "Manual enrolment via WhatsApp",
        after: "Automated student portal with payments",
        highlight: "Automated",
      },
      {
        before: "No CMS — changes needed a developer",
        after: "Full CMS — owner controls everything",
        highlight: "Full CMS",
      },
      {
        before: "Zero visibility on revenue or students",
        after: "Live dashboard with real-time data",
        highlight: "Live",
      },
    ],
  },
  "raicurujp.com": {
    rows: [
      {
        before: "Paper-based logistics tracking",
        after: "Full digital logistics platform",
        highlight: "Full digital",
      },
      {
        before: "No digital client interface",
        after: "Client portal with live tracking",
        highlight: "live tracking",
      },
      {
        before: "Manual quote and booking process",
        after: "Automated quote and booking system",
        highlight: "Automated",
      },
    ],
  },
  "abeyskitchen.com": {
    rows: [
      {
        before: "No online ordering",
        after: "Full e-commerce stack live",
        highlight: "Full e-commerce",
      },
      {
        before: "Manual inventory tracking",
        after: "Automated inventory management",
        highlight: "Automated",
      },
      {
        before: "No customer data or analytics",
        after: "Customer analytics and order history",
        highlight: "Customer",
      },
    ],
  },
};

export function getProjectBeforeAfter(project: Project): BeforeAfter | null {
  if (project.beforeAfter) return project.beforeAfter;
  if (!project.url) return null;
  try {
    const host = new URL(project.url).hostname.replace(/^www\./, "");
    return PROJECT_BEFORE_AFTER_BY_HOST[host] ?? null;
  } catch {
    return null;
  }
}

export const PROJECTS: Project[] = [
  {
    id: "abeys-kitchen",
    name: "Abeys Kitchen",
    url: "https://abeyskitchen.com",
    category: "E-Commerce",
    tag: "E-COMMERCE",
    year: "2024",
    headline:
      "A full-stack storefront built to convert, manage inventory, and scale.",
    problem:
      "The client needed a complete e-commerce system — not just a storefront. Inventory management, order tracking, and a conversion-optimised UI were all required from day one.",
    built:
      "Full-stack e-commerce platform with custom product management, cart system, order flow, and mobile-first storefront design.",
    result:
      "A scalable storefront that handles the full commerce loop from browse to fulfilment.",
  },
  {
    id: "kiefdot",
    name: "Kiefdot",
    url: "https://kiefdot.com",
    category: "Brand & Web",
    tag: "BRAND & WEB",
    year: "2024",
    headline: "Brand identity and web presence crafted as one cohesive system.",
    problem:
      "The client had no consistent brand identity or web presence. Everything needed to be built from scratch — mark, palette, type, and site.",
    built:
      "Full brand system including logo mark, color palette, typography, and a website that expresses the identity across every touchpoint.",
    result:
      "A unified brand and web presence that positioned the client with authority in their market.",
  },
  {
    id: "epicielts",
    name: "EpicIELTS",
    url: "https://epiccampus.live",
    category: "Education / AI",
    tag: "EDUCATION / AI",
    year: "2024",
    headline:
      "An AI-integrated learning platform designed for real student outcomes.",
    problem:
      "Students needed structured IELTS preparation with intelligent feedback — not just static content. The platform had to adapt and respond to each learner.",
    built:
      "Education platform with AI-powered practice modules, performance tracking, and a clean learning interface optimised for focus.",
    result:
      "A live platform serving students with measurable improvements in test preparation efficiency.",
  },
  {
    id: "datacore",
    name: "DataCore",
    url: null,
    category: "Internal Tooling",
    tag: "SAAS / TOOLING",
    year: "2024",
    headline: "A data management web app built for operational clarity.",
    problem:
      "The client was managing critical business data across spreadsheets and disconnected tools. They needed a single system with structure.",
    built:
      "Custom web application with role-based access, data visualisation dashboards, and a clean admin interface.",
    result:
      "A centralised data system that replaced spreadsheet chaos with operational control.",
  },
  {
    id: "eduai",
    name: "EduAI",
    url: null,
    category: "Education / AI",
    tag: "EDUCATION / AI",
    year: "2025",
    headline: "An AI-integrated education platform built for scale.",
    problem:
      "The client needed an education platform that could handle AI-driven content delivery at scale, with a clean interface students would actually use.",
    built:
      "Full education platform with AI content integration, student dashboards, progress tracking, and admin controls.",
    result:
      "A scalable education system ready for growth with AI at its core.",
  },
  {
    id: "meditrack",
    name: "MediTrack",
    url: null,
    category: "Healthcare",
    tag: "HEALTHCARE / SAAS",
    year: "2025",
    headline: "A patient management system built for private clinics.",
    problem:
      "A private healthcare clinic was managing appointments, patient records, and billing across paper files and spreadsheets. Data was scattered, errors were frequent, and staff time was wasted.",
    built:
      "Custom web-based patient management system with appointment scheduling, digital patient records, billing management, and a clean staff dashboard.",
    result:
      "A centralised clinic system that reduced administrative time and eliminated paper-based errors.",
  },
  {
    id: "estateos",
    name: "EstateOS",
    url: null,
    category: "Real Estate",
    tag: "REAL ESTATE / WEB",
    year: "2025",
    headline:
      "A property listing and lead management platform for a real estate firm.",
    problem:
      "The client had no digital presence and was managing property listings and client leads manually over WhatsApp and phone calls.",
    built:
      "Full property listing website with search and filter, enquiry management system, agent dashboard, and automated lead capture.",
    result:
      "A professional digital platform that replaced manual processes and started generating inbound leads from day one.",
  },
  {
    id: "logiflow",
    name: "LogiFlow",
    url: null,
    category: "Logistics",
    tag: "LOGISTICS / TOOLING",
    year: "2025",
    headline:
      "An internal operations dashboard for a logistics and delivery company.",
    problem:
      "A growing delivery company had no system to track orders, drivers, or delivery status in real time. Operations were managed over phone calls and WhatsApp groups.",
    built:
      "Internal operations dashboard with real-time order tracking, driver assignment, delivery status updates, and a reporting module.",
    result:
      "A live operations system that gave the business full visibility and reduced delivery coordination time significantly.",
  },
];

export const PROJECT_REVEAL_DELAYS = [0, 100, 200, 300, 400, 500, 600, 700] as const;
