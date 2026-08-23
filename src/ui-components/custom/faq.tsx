import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui-components/primitive/accordion";
import { SPRING_TRANSITION, SPRING_SCALE_VARIANTS } from "@/ui-components/primitive/accordion-presets";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import { BodyText } from "@/ui-components/custom/common-page-elements";

// ---------------------------------------------------------------------------
// FAQ accordion, shared across the services pages and the Contact page.
// ---------------------------------------------------------------------------

export type Faq = {
  q: string;
  a: ReactNode;
};

// Call-to-action link at the end of an FAQ answer. `block` drops it onto its own
// line so the link text never wraps across two lines mid-sentence, and `w-fit`
// keeps the underline hugging the text instead of stretching the paragraph width.
export function FaqLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-3 block w-fit font-bold text-(--color-terracotta) underline underline-offset-2"
    >
      {children}
    </Link>
  );
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion
      className="flex w-full flex-col"
      transition={SPRING_TRANSITION}
      variants={SPRING_SCALE_VARIANTS}
    >
      {faqs.map((faq, i) => (
        <AnimatedContent key={faq.q} distance={20} duration={0.6} delay={i * 0.06}>
          <AccordionItem
            value={faq.q}
            className="border-b border-(--color-oxblood)/15 py-4 first:pt-0 last:border-b-0"
          >
            <AccordionTrigger className="w-full py-0.5 text-left">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 shrink-0 text-(--color-terracotta) transition-transform duration-200 group-data-expanded:rotate-90" />
                <div className="ml-3 font-subtitle text-[clamp(1.4rem,2.4vw,1.6rem)] font-black tracking-wide text-(--color-oxblood)">
                  {faq.q}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="origin-top">
              <BodyText className="pt-3 pr-2 pl-8">{faq.a}</BodyText>
            </AccordionContent>
          </AccordionItem>
        </AnimatedContent>
      ))}
    </Accordion>
  );
}

// Heading + accordion, for pages that just want to drop in a self-contained FAQ
// block without composing the heading themselves.
export function FaqSection({ faqs, heading = "FAQs" }: { faqs: Faq[]; heading?: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        {heading}
      </h2>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
