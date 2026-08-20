import { useState } from "react";
import { PopupModal } from "react-calendly";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import { CALENDLY_URL } from "@/pages/services-shared";
import { ClosingCta } from "@/pages/ServicesCombined";
import {
  Hero,
  AboutMe,
  MyRole,
  Approach,
  HowItWorks,
  WhatsIncluded,
  AlwaysIncludedSection,
  Faqs,
} from "@/pages/ServicePage";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push Hero's GrainWave down from the top of the page and stop it reaching the screen
// edges, so the padding lives on the content wrapper below the band instead (same
// pattern used on the Contact, About, Services, Blog, and Case Studies pages).
export function ServicesCalum() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <Hero name="calum" />

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <AboutMe name="calum" />
        <MyRole name="calum" />
        <br />
        <SectionDivider />
        <Approach name="calum" />
        <SectionDivider reverse />
        <HowItWorks name="calum" />
        <SectionDivider />
        <WhatsIncluded name="calum" />
        <AlwaysIncludedSection name="calum" />
        <SectionDivider reverse />
        <Faqs name="calum" />
        <SectionDivider />
        <ClosingCta onBookCall={() => setIsCalendlyOpen(true)} />
      </div>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </section>
  );
}
