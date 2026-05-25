import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Systems",
  description: "How COREFRAME works — strategy, design, and build as a unified system.",
};

export default function SystemsPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl">Systems</h1>
        <p className="mt-4 max-w-[var(--max-width-narrow)] text-[var(--cf-warm-white)]/70">
          {/* PLACEHOLDER: Three-layer system modules — next task */}
          Strategy, Design, Build modules coming next.
        </p>
      </div>
    </div>
  );
}
