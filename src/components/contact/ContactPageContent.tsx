"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ContactHeader } from "./ContactHeader";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { ContactBrandStrip } from "./ContactBrandStrip";

export function ContactPageContent() {
  return (
    <div className="contact-page bg-[var(--cf-canvas)]">
      <div className="container">
        <ContactHeader />

        <div className="contact-page__layout">
          <ContactForm />

          <Reveal delay={150}>
            <ContactInfo />
          </Reveal>
        </div>
      </div>

      <ContactBrandStrip />
    </div>
  );
}
