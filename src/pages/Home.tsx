import { SectionDivider } from "@/components/custom/wiggly-divider";
import {
  HeroSection,
  FactsSection,
  StatsCountSection,
  VideoSection,
  TestimonialsSection,
  OurServicesSection,
  ClosingCtaSection,
  WhyChooseSection,
} from "@/pages/home-sections";

export function Home() {
  return (
    <>
      <HeroSection />
      <FactsSection />
      <SectionDivider />
      <StatsCountSection />
      <SectionDivider reverse />
      <VideoSection />
      <TestimonialsSection />
      <OurServicesSection />
      <ClosingCtaSection />
      <WhyChooseSection />
    </>
  );
}
