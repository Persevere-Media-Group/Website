import { useState, type ReactNode } from "react";
import { PopupModal } from "react-calendly";
import { GrainWave } from "@/components/custom/grain-wave";
import { PageSection, SectionHeading } from "@/components/custom/common-page-elements";
import AnimatedContent from "@/components/primitive/animated-content";
import ScrollStack, { ScrollStackItem } from "@/components/primitive/ScrollStack";
import { FaqAccordion } from "@/components/custom/faq";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import { AlwaysIncluded, ClosingCta, IntroBanner } from "@/pages/ServicesCombined";
import { CALENDLY_URL } from "@/pages/services-shared";
import { getServiceData } from "@/pages/services-data";

// ---------------------------------------------------------------------------
// Types shared by ServicePersonPage below (rendered for both the keir and
// calum routes), its section components, and their content (services-data.tsx).
// ---------------------------------------------------------------------------

export type ServicePersonName = "keir" | "calum";

// A single "stage" in the "How it all works" ScrollStack.
export interface ServiceStage {
  number: string;
  title: string;
  body: ReactNode;
}

// The full set of person-specific content for one services page. Everything
// that differs between the keir and calum pages lives in services-data.tsx
// under this shape; each section component below pulls out just its own slice.
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
  faqs: { q: string; a: ReactNode }[];
}

type SectionProps = { name: ServicePersonName };

// ---------------------------------------------------------------------------
// Hero band ("Performance Marketing" / "Creative Strategy...")
// ---------------------------------------------------------------------------

export function Hero({ name }: SectionProps) {
  const data = getServiceData(name);
  return <GrainWave height="24rem">{data.hero}</GrainWave>;
}

// ---------------------------------------------------------------------------
// "Hi I'm ___" intro banner
// ---------------------------------------------------------------------------

export function AboutMe({ name }: SectionProps) {
  const data = getServiceData(name);
  return <IntroBanner name={data.intro.name} words={data.intro.words} note={data.intro.note} />;
}

// ---------------------------------------------------------------------------
// "My role in Persevere Media"
// ---------------------------------------------------------------------------

export function MyRole({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
    <>
      <SectionHeading size="sm">My role in Persevere Media</SectionHeading>
      <p
        className={`mt-6 text-center text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80 ${data.role.maxWidthClassName ?? "max-w-2xl"}`}
      >
        {data.role.paragraph}
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// "Our Approach"
// ---------------------------------------------------------------------------

export function Approach({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-5 text-left">
      <SectionHeading>Our Approach</SectionHeading>
      {data.approach.map((paragraph, i) => (
        <p
          key={i}
          className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// "How it all works" - five-stage ScrollStack
// ---------------------------------------------------------------------------

export function HowItWorks({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <SectionHeading>How it all works</SectionHeading>

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
              <span className="shrink-0 font-fun text-[clamp(1.75rem,3.6vw,2.4rem)] text-(--color-terracotta)">
                {stage.number}
              </span>
              <h3 className="font-subtitle text-[clamp(1.4rem,3vw,1.9rem)] font-black tracking-wide text-(--color-oxblood)">
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
  );
}

// ---------------------------------------------------------------------------
// "What's included"
// ---------------------------------------------------------------------------

export function WhatsIncluded({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <SectionHeading>{data.included.heading}</SectionHeading>
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
  );
}

// ---------------------------------------------------------------------------
// "By default, every service comes with"
// ---------------------------------------------------------------------------

export function AlwaysIncludedSection({ name }: SectionProps) {
  const data = getServiceData(name);
  return <AlwaysIncluded bodies={data.alwaysIncludedBodies} />;
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export function Faqs({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <SectionHeading>FAQ</SectionHeading>
      <FaqAccordion faqs={data.faqs} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full page - the single source of truth for both /services/keir and
// /services/calum, which differ only in which name they pass down (all the
// actual copy differences live in services-data.tsx).
// ---------------------------------------------------------------------------

export function ServicePersonPage({ name }: SectionProps) {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <PageSection>
      <Hero name={name} />

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <AboutMe name={name} />
        <MyRole name={name} />
        <br />
        <SectionDivider />
        <Approach name={name} />
        <SectionDivider reverse />
        <HowItWorks name={name} />
        <SectionDivider />
        <WhatsIncluded name={name} />
        <AlwaysIncludedSection name={name} />
        <SectionDivider reverse />
        <Faqs name={name} />
        <SectionDivider />
        <ClosingCta onBookCall={() => setIsCalendlyOpen(true)} />
      </div>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </PageSection>
  );
}
