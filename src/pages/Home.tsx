import { SectionDivider } from "@/components/custom/wiggly-divider";
import { SectionSpacer } from "@/components/custom/section-spacer";
import {
  HeroSection,
  FactsSection,
  StatsCountSection,
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
      <TestimonialsSection />
      <SectionSpacer size="md" />
      <OurServicesSection />
      <SectionSpacer size="md" />
      <ClosingCtaSection />
      <WhyChooseSection />
    </>
  );
}
