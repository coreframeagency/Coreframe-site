import { Hero } from "@/components/home/Hero";
import { PositioningStatement } from "@/components/home/PositioningStatement";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { CoreframeMethod } from "@/components/home/CoreframeMethod";
import { FooterCtaStrip } from "@/components/home/FooterCtaStrip";
import { StatsStrip } from "@/components/ui/StatsStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PositioningStatement />
      <FeaturedWork />
      <StatsStrip />
      <CoreframeMethod />
      <FooterCtaStrip />
    </>
  );
}
