import { SectionDivider } from "@/ui-components/custom/wiggly-divider";
import { SectionSpacer } from "@/ui-components/custom/section-spacer";
import {
  HeroSection,
  FactsSection,
  StatsCountSection,
  TestimonialsSection,
  OurServicesSection,
  ClosingCtaSection,
  WhyChooseSection,
} from "@/container-contents/home-sections";

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
