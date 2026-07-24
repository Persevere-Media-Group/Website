import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { BrandsSection } from "@/components/sections/brands-section";

export function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <BrandsSection />
    </main>
  );
}
