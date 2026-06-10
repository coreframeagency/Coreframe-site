const STACK_TILES = [
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Prisma", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Stripe", category: "Payments" },
  { name: "Vercel", category: "Deploy" },
  { name: "AWS S3", category: "Storage" },
] as const;

export function TechStack() {
  return (
    <section className="section tech-stack-section">
      <div className="container">
        <div className="tech-stack tech-stack--home" aria-label="Technology stack">
          <p className="tech-stack__eyebrow">BUILT WITH.</p>
          <div className="tech-stack__grid">
            {STACK_TILES.map((tile) => (
              <div key={tile.name} className="tech-stack__tile tech-stack__tile--transparent">
                <span className="tech-stack__name tech-stack__name--home">{tile.name}</span>
                <span className="tech-stack__category">{tile.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
