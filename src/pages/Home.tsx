import { SectionDivider } from "@/components/custom/wiggly-divider";
import { SectionSpacer } from "@/components/custom/section-spacer";
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
      <SectionSpacer size="md" />
      <FactsSection />
      <SectionDivider />
      <StatsCountSection />
      <SectionDivider reverse />
      <VideoSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionSpacer size="sm" />
      <OurServicesSection />
      <SectionSpacer size="sm" />
      <ClosingCtaSection />
      <WhyChooseSection />
    </>
  );
}
