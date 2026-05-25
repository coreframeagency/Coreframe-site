import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects from COREFRAME — e-commerce, brand, education, and internal systems.",
};

export default function WorkPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl">Work</h1>
        <p className="mt-4 max-w-[var(--max-width-narrow)] text-[var(--cf-warm-white)]/70">
          {/* PLACEHOLDER: Editorial project grid — next task */}
          Project portfolio grid coming next.
        </p>
      </div>
    </div>
  );
}
