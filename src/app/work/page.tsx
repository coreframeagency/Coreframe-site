import type { Metadata } from "next";
import { WorkPageContent } from "@/components/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected systems built by COREFRAME — education platforms, logistics systems, e-commerce, and web applications.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
