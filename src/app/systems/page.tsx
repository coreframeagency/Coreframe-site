import type { Metadata } from "next";
import { SystemsPageContent } from "@/components/systems";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "How COREFRAME approaches systems thinking, strategy, and design. Explore our method and tools.",
};

export default function SystemsPage() {
  return <SystemsPageContent />;
}
