import type { Metadata } from "next";
import { SystemsPageContent } from "@/components/systems";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "How COREFRAME works — strategy, design, and build as a unified system.",
};

export default function SystemsPage() {
  return <SystemsPageContent />;
}
