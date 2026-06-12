import type { Metadata } from "next";
import { ContactCard } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with COREFRAME. We map, design, build, and operate digital systems for modern businesses.",
};

export default function ContactPage() {
  return <ContactCard />;
}
