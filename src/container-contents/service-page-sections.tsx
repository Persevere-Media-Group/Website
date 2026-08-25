import { SectionHeading, BodyText } from "@/ui-components/custom/common-page-elements";
import { GrainWave } from "@/ui-components/custom/grain-wave";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import ScrollStack, { ScrollStackItem } from "@/ui-components/primitive/ScrollStack";
import { FaqAccordion } from "@/ui-components/custom/faq";
import { AlwaysIncluded, IntroBanner } from "@/container-contents/ServicesCombined";
import { getServiceData } from "@/container-contents/services-data";
import type { ServicePersonName } from "@/containers/ServicePage";

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
      <BodyText className={`mt-6 text-left ${data.role.maxWidthClassName ?? "max-w-2xl"}`}>
        {data.role.paragraph}
      </BodyText>
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
        <BodyText key={i}>{paragraph}</BodyText>
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
              <span className="flex w-16 shrink-0 items-center justify-center font-fun text-[clamp(2.75rem,5.2vw,3.5rem)] text-(--color-terracotta)">
                {stage.number}
              </span>
              <h3 className="translate-y-1 font-subtitle text-[clamp(1.6rem,3.2vw,2.1rem)] font-black tracking-wide text-(--color-oxblood)">
                {stage.title}
              </h3>
            </div>
            <BodyText className="px-7 pt-0 pb-8">{stage.body}</BodyText>
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
          <AnimatedContent key={i} distance={20} duration={0.6} delay={i * 0.06}>
            <BodyText as="li" className="flex items-start gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-terracotta)" />
              {item}
            </BodyText>
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
      <SectionHeading font="heading" size="lg" weight="normal">
        FAQ
      </SectionHeading>
      <FaqAccordion faqs={data.faqs} />
    </div>
  );
}
