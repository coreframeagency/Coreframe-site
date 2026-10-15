import type { Metadata } from "next";
import { WorkPageContent } from "@/components/work";
import { getPublishedWork } from "@/lib/work";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected systems built by COREFRAME — education platforms, recruitment platforms, logistics systems, e-commerce, and web applications.",
};

export default async function WorkPage() {
  const projects = await getPublishedWork();
  return <WorkPageContent projects={projects} />;
}
