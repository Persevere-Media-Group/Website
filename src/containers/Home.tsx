import { useState } from "react";
import { PopupModal } from "react-calendly";
import { SectionDivider } from "@/ui-components/custom/wiggly-divider";
import { SectionSpacer } from "@/ui-components/custom/section-spacer";
import {
  HeroSection,
  FactsSection,
  StatsCountSection,
  TestimonialsSection,
  OurServicesSection,
  WhyChooseSection,
} from "@/container-contents/home-sections";
import { ChoosePersevereMark } from "@/ui-components/custom/choose-persevere-mark";
import { CALENDLY_URL } from "@/container-contents/services-shared";

export function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

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
      <ChoosePersevereMark />
      <SectionSpacer size="lg" />

      <WhyChooseSection onBookCall={() => setIsCalendlyOpen(true)} />

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </>
  );
}
