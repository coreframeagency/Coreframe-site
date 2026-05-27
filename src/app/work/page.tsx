import type { Metadata } from "next";
import { WorkPageContent } from "@/components/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects from COREFRAME — e-commerce, brand, education, and internal systems.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
