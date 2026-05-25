import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const PROJECTS = [
  {
    name: "abeyskitchen.com",
    category: "E-commerce",
    description: "A full-stack storefront built to convert, manage inventory, and scale.",
  },
  {
    name: "epicielts.live",
    category: "Education / AI",
    description: "An AI-integrated learning platform designed for real student outcomes.",
  },
  {
    name: "kiefdot.com",
    category: "Brand & Web",
    description: "Brand identity and web presence crafted as one cohesive system.",
  },
] as const;

export function FeaturedWork() {
  return (
    <section className="section bg-[var(--cf-canvas)]">
      <div className="container">
        <Reveal>
          <p className="work-label">Selected Work</p>
        </Reveal>

        <div className="work-grid reveal-stagger">
          {PROJECTS.map((project) => (
            <Reveal key={project.name} className="h-full">
              <Link href="/work" className="project-card">
                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__category">{project.category}</p>
                <p className="project-card__description">{project.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link href="/work" className="work-view-all">
            View all work →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
