import { GrainWave } from "@/components/custom/grain-wave";
import AnimatedContent from "@/components/primitive/animated-content";
import ScrollStack, { ScrollStackItem } from "@/components/primitive/ScrollStack";
import { FaqAccordion } from "@/components/custom/faq";
import { AlwaysIncluded, IntroBanner } from "@/pages/ServicesCombined";
import { getServiceData } from "@/pages/services-data";
import type { SectionProps } from "@/pages/services-types";

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
      <h2 className="font-subtitle text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        My role in Persevere Media
      </h2>
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
  );
}

// ---------------------------------------------------------------------------
// "How it all works" - five-stage ScrollStack
// ---------------------------------------------------------------------------

export function HowItWorks({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
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
  );
}

// ---------------------------------------------------------------------------
// "What's included"
// ---------------------------------------------------------------------------

export function WhatsIncluded({ name }: SectionProps) {
  const data = getServiceData(name);
  return (
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
      <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        FAQ
      </h2>
      <FaqAccordion faqs={data.faqs} />
    </div>
  );
}
