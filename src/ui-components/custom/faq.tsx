import { isValidElement, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, X } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui-components/primitive/accordion";
import {
  SPRING_TRANSITION,
  SPRING_SCALE_VARIANTS,
} from "@/ui-components/primitive/accordion-presets";
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
export function FaqSection({ faqs, heading = "FAQ" }: { faqs: Faq[]; heading?: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <h2 className="font-heading text-center text-[clamp(2rem,5vw,3.5rem)] tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        {heading}
      </h2>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}

// Flattens a ReactNode answer down to plain text so a search query can match
// against it, not just the question. Good enough for the FaqLink/Highlighter
// nodes used inside FAQ answers, which are just text-bearing wrapper elements.
function getTextContent(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children);
  return "";
}

// Groups of interchangeable search terms. Typing a word that exactly matches
// one entry expands the search to every other term in its group, so e.g.
// "money" also surfaces answers that only say "budget" or "spend" rather than
// requiring that literal word to appear. Keeps ordinary substring search
// (any other typed text) working exactly as before.
const SEARCH_SYNONYM_GROUPS: string[][] = [
  ["money", "budget", "spend", "cost", "price", "afford"],
  ["ads", "ad spend", "advertising", "paid"],
  ["creative", "content", "organic"],
  ["camera", "shoot", "film", "video"],
  ["contract", "commitment", "lock-in", "sign up"],
  ["results", "roi", "timeline", "when", "long", "start", "quickly"],
  ["hear", "contact", "reach", "reporting", "touch"],
];

// Heading + search box, for FAQ lists too long to show as one big stack of
// accordions (a "wall of text" people have to scroll and skim through). Typing
// a keyword filters straight down to matching question/answer pairs, shown
// already expanded since finding them was the whole point of searching.
export function FaqSearch({
  faqs,
  heading = "FAQ",
  suggestions,
}: {
  faqs: Faq[];
  heading?: string;
  suggestions?: string[];
}) {
  const [query, setQuery] = useState("");

  const searchable = useMemo(
    () => faqs.map((faq) => ({ faq, haystack: `${faq.q} ${getTextContent(faq.a)}`.toLowerCase() })),
    [faqs]
  );

  const trimmedQuery = query.trim().toLowerCase();
  const searchTerms =
    SEARCH_SYNONYM_GROUPS.find((group) => group.includes(trimmedQuery)) ?? [trimmedQuery];
  const results = trimmedQuery
    ? searchable
        .filter(({ haystack }) => searchTerms.some((term) => haystack.includes(term)))
        .map(({ faq }) => faq)
    : [];

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <h2 className="font-heading text-center text-[clamp(2rem,5vw,3.5rem)] tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        {heading}
      </h2>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-(--color-oxblood)/40"
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a question, e.g. “budget” or “contracts”…"
          aria-label="Search frequently asked questions"
          className="w-full rounded-full border border-(--color-oxblood)/20 bg-(--color-ivory-raised) py-4 pr-12 pl-13 text-(--color-oxblood) outline-none transition-colors placeholder:text-(--color-oxblood)/40 focus:border-(--color-terracotta)"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-(--color-oxblood)/40 transition-colors hover:bg-(--color-oxblood)/10 hover:text-(--color-oxblood)"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!trimmedQuery && suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-(--color-oxblood)/50">Popular:</span>
          {suggestions.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => setQuery(word)}
              className="cursor-pointer rounded-full border border-(--color-terracotta)/40 px-3 py-1 text-sm font-semibold text-(--color-terracotta) transition-colors hover:bg-(--color-terracotta)/10"
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {trimmedQuery && results.length === 0 && (
        <BodyText className="text-center">
          No matches for "{query}". Try a different word, or just send us a message below.
        </BodyText>
      )}

      {results.length > 0 && (
        <div className="flex w-full flex-col gap-6">
          {results.map((faq, i) => (
            <AnimatedContent key={faq.q} distance={12} duration={0.4} delay={i * 0.05}>
              <div className="rounded-2xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-5">
                <div className="flex items-start">
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-(--color-terracotta)" />
                  <div className="ml-3">
                    <p className="font-subtitle text-[clamp(1.2rem,2vw,1.35rem)] font-black tracking-wide text-(--color-oxblood)">
                      {faq.q}
                    </p>
                    <BodyText className="mt-2 pr-2">{faq.a}</BodyText>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
