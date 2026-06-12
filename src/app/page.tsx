import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { PositioningStatement } from "@/components/home/PositioningStatement";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { CoreframeMethod } from "@/components/home/CoreframeMethod";
import { FooterCtaStrip } from "@/components/home/FooterCtaStrip";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ProofWall } from "@/components/home/ProofWall";
import { TechStack } from "@/components/home/TechStack";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { StatsStrip } from "@/components/ui/StatsStrip";

export const metadata: Metadata = {
  title: "Home",
  description:
    "COREFRAME builds the digital infrastructure behind modern businesses. Systems, strategy, and design as one.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PositioningStatement />
      <FeaturedWork />
      <StatsStrip />
      <ProcessTimeline />
      <ProofWall />
      <TechStack />
      <ComparisonTable />
      <CoreframeMethod />
      <FooterCtaStrip />
    </>
  );
}
