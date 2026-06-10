const STACK_TILES = [
  { symbol: "⚛", name: "Next.js", category: "Frontend" },
  { symbol: "◈", name: "TypeScript", category: "Language" },
  { symbol: "▲", name: "Tailwind", category: "Styling" },
  { symbol: "◉", name: "Prisma", category: "ORM" },
  { symbol: "⬡", name: "PostgreSQL", category: "Database" },
  { symbol: "◎", name: "Stripe", category: "Payments" },
  { symbol: "⊞", name: "Vercel", category: "Deploy" },
  { symbol: "◈", name: "AWS S3", category: "Storage" },
] as const;

export function TechStackGrid() {
  return (
    <section className="tech-stack" aria-label="Technology stack">
      <p className="tech-stack__eyebrow">BUILT WITH.</p>
      <div className="tech-stack__grid">
        {STACK_TILES.map((tile) => (
          <div key={tile.name} className="tech-stack__tile">
            <span className="tech-stack__symbol">{tile.symbol}</span>
            <span className="tech-stack__name">{tile.name}</span>
            <span className="tech-stack__category">{tile.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
