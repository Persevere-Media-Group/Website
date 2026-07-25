import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { BrandsSection } from "@/components/sections/brands-section";
import { VideoSection } from "@/components/sections/video-section";

export function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <VideoSection />
    </>
  );
}
