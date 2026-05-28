import type { Metadata } from "next";
import { ContactCard } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with COREFRAME — tell us what you need.",
};

export default function ContactPage() {
  return <ContactCard />;
}
