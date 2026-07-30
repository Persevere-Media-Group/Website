import type { ReactNode } from "react";
import { ChevronRight, ImageIcon } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import AnimatedContent from "@/components/primitive/animated-content";
import { Highlighter } from "@/components/primitive/highlighter";
import { PulsatingButton } from "@/components/primitive/pulsating-button";
import { FlipWords } from "@/components/primitive/word-swap";

// ---------------------------------------------------------------------------
// Shared config for the two services pages (ServicesKeir / ServicesCalum).
// Single source of truth so the two counterpart pages don't drift apart.
// ---------------------------------------------------------------------------

// same link used elsewhere on the site, keep these in sync if it ever changes
export const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

export const UNDERLINE_COLOR = "#d5573b";
export const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";

export const MARK_PROPS = {
  isView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

// ---------------------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------------------

export type Faq = {
  q: string;
  a: ReactNode;
};

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion
      className="flex w-full flex-col"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      variants={{
        expanded: { opacity: 1, scale: 1 },
        collapsed: { opacity: 0, scale: 0.7 },
      }}
    >
      {faqs.map((faq, i) => (
        <AnimatedContent
          key={faq.q}
          direction="vertical"
          distance={20}
          duration={0.6}
          ease="power3.out"
          threshold={0.2}
          delay={i * 0.06}
        >
          <AccordionItem
            value={faq.q}
            className="border-b border-(--color-oxblood)/15 py-4 first:pt-0 last:border-b-0"
          >
            <AccordionTrigger className="w-full py-0.5 text-left">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 shrink-0 text-(--color-terracotta) transition-transform duration-200 group-data-expanded:rotate-90" />
                <div className="ml-3 text-[clamp(1.05rem,1.9vw,1.25rem)] font-black tracking-tight text-(--color-oxblood)">
                  {faq.q}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="origin-top">
              <p
                className="pt-3 pr-2 pl-8 text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {faq.a}
              </p>
            </AccordionContent>
          </AccordionItem>
        </AnimatedContent>
      ))}
    </Accordion>
  );
}

// ---------------------------------------------------------------------------
// "By default, we provide you with" section
// ---------------------------------------------------------------------------

export type AlwaysIncludedItem = {
  title: string;
  body: string;
};

export function AlwaysIncluded({ items }: { items: AlwaysIncludedItem[] }) {
  return (
    <div className="mt-20 flex w-full max-w-3xl flex-col items-center">
      <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
        By default, we provide you with
      </h2>

      <div className="mt-12 grid w-full gap-8 text-left sm:grid-cols-3">
        {items.map((item, i) => (
          <AnimatedContent
            key={item.title}
            direction="vertical"
            distance={24}
            duration={0.7}
            ease="power3.out"
            threshold={0.2}
            delay={i * 0.1}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-[clamp(1.1rem,2vw,1.3rem)] font-black tracking-tight text-(--color-oxblood)">
                {item.title}
              </h3>
              <p
                className="text-[clamp(0.95rem,1.4vw,1rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.body}
              </p>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Closing CTA ("We're your growth partner.")
// ---------------------------------------------------------------------------

export function ClosingCta({ onBookCall }: { onBookCall: () => void }) {
  return (
    <div className="mt-4 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
      <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-black leading-tight tracking-tight text-(--color-oxblood)">
        We're your growth partner.
      </h2>
      <p
        className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Not a quick campaign and a runaway. We scale with you, keep improving with you, and never
        settle for{" "}
        <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={10}>
          "good enough."
        </Highlighter>
      </p>
      <br />
      <PulsatingButton
        pulseColor="var(--color-amber-gold)"
        duration="1.8s"
        className="rounded-full bg-(--color-amber-gold) px-8 py-4 text-base font-bold text-(--color-oxblood) shadow-[0_0_28px_-6px_var(--color-amber-gold)]"
        onClick={onBookCall}
      >
        Book a free discovery call
      </PulsatingButton>
    </div>
  );
}

// Same placeholder style used on the Home page's facts section, for the
// person photos in the Keir/Calum intro banners.
export function PhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-(--color-oxblood)/20 bg-(--color-oxblood)/5 text-(--color-oxblood)/40 ${className}`}
    >
      Placeholder image(s) - maybe a gallery?
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intro banner ("Hi! I'm ___")
// ---------------------------------------------------------------------------

export function IntroBanner({ name, flipTo }: { name: string; flipTo: string }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 pb-16 text-center">
      <div className="flex flex-col items-center gap-1 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-(--color-oxblood)">
        <span className="whitespace-nowrap">Hi! I'm</span>
        <FlipWords words={[name, flipTo]} className="text-(--color-terracotta)" />
      </div>
      <PhotoPlaceholder className="max-w-sm" />
    </div>
  );
}
