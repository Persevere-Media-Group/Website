import { useState, type ReactNode } from "react";
import { PopupModal } from "react-calendly";
import { GrainWave } from "@/components/custom/grain-wave";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import AnimatedContent from "@/components/primitive/animated-content";
import ScrollStack, { ScrollStackItem } from "@/components/primitive/ScrollStack";
import { CALENDLY_URL } from "@/pages/services-shared";
import { FaqAccordion, type Faq } from "@/components/custom/faq";
import { AlwaysIncluded, ClosingCta, IntroBanner } from "@/pages/ServicesCombined";
import { getServiceData, type ServicePersonName } from "@/pages/services-data";

// ---------------------------------------------------------------------------
// Shared shape for a single "stage" in the "How it all works" ScrollStack,
// reused by both ServicesKeir and ServicesCalum.
// ---------------------------------------------------------------------------

export interface ServiceStage {
  number: string;
  title: string;
  body: ReactNode;
}

// The full set of person-specific content for one services page. Everything
// that differs between ServicesKeir and ServicesCalum lives here; ServicePage
// itself only knows how to lay it out.
export interface ServicePageData {
  hero: ReactNode;
  intro: {
    name: string;
    words: string[];
    note?: string;
  };
  role: {
    paragraph: ReactNode;
    maxWidthClassName?: string;
  };
  approach: ReactNode[];
  stages: ServiceStage[];
  included: {
    heading: ReactNode;
    items: string[];
  };
  alwaysIncludedBodies: [ReactNode, ReactNode, ReactNode];
  faqs: Faq[];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact, About, Services, Blog, and Case Studies pages).
export function ServicePage({ name }: { name: ServicePersonName }) {
  const data = getServiceData(name);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">{data.hero}</GrainWave>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <IntroBanner name={data.intro.name} words={data.intro.words} note={data.intro.note} />

        <h2 className="font-subtitle text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
          My role in Persevere Media
        </h2>
        <p
          className={`mt-6 text-center text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80 ${data.role.maxWidthClassName ?? "max-w-2xl"}`}
        >
          {data.role.paragraph}
        </p>
        <br />
        <SectionDivider />
        {/* --------------------------------------------------------------- */}
        {/* The approach                                                    */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-5 text-left">
          <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
            Our Approach
          </h2>
          {data.approach.map((paragraph, i) => (
            <p
              key={i}
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <SectionDivider reverse />
        {/* --------------------------------------------------------------- */}
        {/* Five stages                                                     */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
            How it all works
          </h2>

          {/* The header band is h-20 (80px) and itemStackDistance is 80 on purpose:
              that band is exactly the strip left showing once the next card stacks
              over this one, so the number and title survive and the body is covered.
              Change one and you must change the other. */}
          <ScrollStack
            useWindowScroll
            className="mt-14 max-w-2xl"
            itemDistance={80}
            itemStackDistance={80}
            stackPosition="18%"
            baseScale={0.9}
            itemScale={0.015}
          >
            {data.stages.map((stage) => (
              <ScrollStackItem
                key={stage.number}
                itemClassName="overflow-hidden rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) text-left shadow-[0_12px_44px_-18px_rgba(74,31,29,0.55)]"
              >
                <div className="flex h-20 items-center gap-4 px-7">
                  <span className="shrink-0 text-[clamp(1.35rem,2.8vw,1.9rem)] font-black tracking-tight text-(--color-terracotta)">
                    {stage.number}
                  </span>
                  <h3 className="font-subtitle text-[clamp(1.1rem,2.2vw,1.45rem)] font-black tracking-wide text-(--color-oxblood)">
                    {stage.title}
                  </h3>
                </div>
                <p className="px-7 pt-3 pb-8 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80">
                  {stage.body}
                </p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
        <SectionDivider />
        {/* --------------------------------------------------------------- */}
        {/* What's included                                                 */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
            {data.included.heading}
          </h2>
          <ul className="flex flex-col gap-4 text-left">
            {data.included.items.map((item, i) => (
              <AnimatedContent
                key={i}
                direction="vertical"
                distance={20}
                duration={0.6}
                ease="power3.out"
                threshold={0.2}
                delay={i * 0.06}
              >
                <li className="flex items-start gap-3 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-terracotta)" />
                  {item}
                </li>
              </AnimatedContent>
            ))}
          </ul>
        </div>
        {/* --------------------------------------------------------------- */}
        {/* Always included                                                 */}
        {/* --------------------------------------------------------------- */}
        <AlwaysIncluded bodies={data.alwaysIncludedBodies} />
        <SectionDivider reverse />
        {/* --------------------------------------------------------------- */}
        {/* FAQ                                                             */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-10">
          <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
            FAQ
          </h2>
          <FaqAccordion faqs={data.faqs} />
        </div>
        <SectionDivider />
        {/* --------------------------------------------------------------- */}
        {/* Closing CTA                                                     */}
        {/* --------------------------------------------------------------- */}
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
