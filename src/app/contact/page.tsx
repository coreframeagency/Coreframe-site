import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with COREFRAME — let's build something that works.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
