import { PageHero } from "@/ui-components/custom/common-page-elements";
import { SectionDivider } from "@/ui-components/custom/wiggly-divider";
import {
  ContactIntroSection,
  ContactFormSection,
  ContactFaqSection,
} from "@/container-contents/contact-sections";

export function Contact() {
  // NOTE: the <section> deliberately has no padding of its own. Any padding here would
  // push GrainWave down from the top of the page and stop it reaching the screen edges,
  // so the padding lives on the content wrapper below the band instead.
  return (
    <section className="min-h-screen bg-(--color-ivory)">
      <PageHero grainy>Contact</PageHero>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 pt-16 pb-16 sm:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <ContactIntroSection />
        <ContactFormSection />
      </div>

      <SectionDivider reverse />

      <ContactFaqSection />
    </section>
  );
}
