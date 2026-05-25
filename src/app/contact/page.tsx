import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with COREFRAME — let's build something that works.",
};

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl">
          Let&apos;s build something that works.
        </h1>
        <p className="mt-4 max-w-[var(--max-width-narrow)] text-[var(--cf-warm-white)]/70">
          {/* PLACEHOLDER: Contact form — next task */}
          Contact form coming next.
        </p>
      </div>
    </div>
  );
}
