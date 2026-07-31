import { useState } from "react";
import { PopupModal } from "react-calendly";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import AnimatedContent from "@/components/primitive/animated-content";
import ScrollStack, { ScrollStackItem } from "@/components/primitive/ScrollStack";
import {
  CALENDLY_URL,
  UNDERLINE_COLOR,
  HIGHLIGHT_COLOR,
  MARK_PROPS,
} from "@/pages/services-shared";
import {
  FaqAccordion,
  FaqLink,
  AlwaysIncluded,
  ClosingCta,
  IntroBanner,
} from "@/pages/ServicesCombined";

// ---------------------------------------------------------------------------
// The five stages
// ---------------------------------------------------------------------------

const STAGES = [
  {
    number: "01",
    title: "Onboarding",
    body: "We're sponges. Before we touch a single campaign, we want to know your business inside out, your customers, their problems, what's actually stopping them from buying. You'll fill in an onboarding form, then we'll sit down together to go through it, ask the follow-up questions, and make sure we've got everything we need. Usually done within one to two days.",
  },
  {
    number: "02",
    title: "Groundwork",
    body: "This is where the foundation gets built, and we take it seriously. Scripting ad copy, designing creative, building out hooks. Skip this stage or rush it, and everything after it wobbles. We don't rush it.",
  },
  {
    number: "03",
    title: "Create",
    body: "Shooting, editing, and building your bespoke strategy properly. And it doesn't stop once it's built. Strategy keeps evolving as we learn more, because we're driven by the data, not by what we planned on day one.",
  },
  {
    number: "04",
    title: "Launch",
    body: "We go live. This is where the real learning starts: absorbing everything the campaigns tell us and feeding it straight back into the strategy. Continuous improvement isn't a nice-to-have for us, it's the whole point.",
  },
  {
    number: "05",
    title: "Scale",
    body: "When it's working, we don't sit back. We scale it, and we keep improving as we go. We're your growth partner, not an agency that declares victory and coasts. We're not interested in settling, and neither should you be.",
  },
];

// ---------------------------------------------------------------------------
// What's included
// ---------------------------------------------------------------------------

const WHATS_INCLUDED = [
  "Paid social management and strategy, built around your actual customers, not a generic template",
  "PPC management and strategy",
  "Creative direction, hooks, messaging, and format guidance built in Groundwork and refined in Create",
  "Tracking set up properly from day one, so the data we act on is the data that's actually true",
  "Continuous optimisation, not a set-and-check-in-a-month approach",
];

const ALWAYS_INCLUDED = [
  {
    title: "Monthly reporting call",
    body: "A proper call, every month, going through what's working, what's changed, and what's next.",
  },
  {
    title: "Direct access to us",
    body: "A group chat with the two of us. Real access, not an account manager relaying messages. (Not at 11pm though, we've got lives too.)",
  },
  {
    title: "Transparent reporting tools",
    body: "We'll help you get set up with tools that keep the numbers clear and trustworthy, not vanity metrics dressed up to make us look good. We want your business to actually do well, not just look good on a slide.",
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQS = [
  {
    q: "How much ad spend do you recommend?",
    a: (
      <>
        Ad spend goes directly to the platforms themselves (Meta, Google, TikTok, wherever),
        separate from our management fee. We work across a wide range of ad spend budgets, from four
        figures a month to six. As a starting point, we'd recommend reserving at least{" "}
        <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={8}>
          £500 a month
        </Highlighter>{" "}
        for that ad spend alone, so the platform actually has enough to work with, though this
        varies by sector and goals. Not sure what's realistic for you?
        <FaqLink to="/contact">Get in touch and we can walk you through it!</FaqLink>
      </>
    ),
  },
  {
    q: "Do you handle the creative too, or just the ads?",
    a: (
      <>
        Both. Creative and paid are handled under one roof, from scripting and shooting through to
        the campaigns themselves, so nothing gets lost in translation between an ads agency and a
        separate content team.
        <FaqLink to="/services/calum">Check out the Creative service for more details</FaqLink>
      </>
    ),
  },
  {
    q: "How often will I hear from you?",
    a: "A proper reporting call every month, plus direct access to us via group chat in between. No account manager standing in the way.",
  },
  {
    q: "How long before I see results?",
    a: "The unfortunate and realistic answer is, it depends. We don't want to sit here and promise you the world just so you come onboard. But we can guarantee you that we will do everything in our power to make sure that results start flowing in as quickly as possible.",
  },
  {
    q: "Are there long-term contracts?",
    a: "We ask for an initial three-month commitment. It takes time for the platforms to gather enough data to optimise properly, and chopping and changing every few weeks works against you, not for you. After three months, you're free to roll monthly (we'd love to have you!), no long lock-ins, no small print.",
  },
  {
    q: "How do we get started?",
    a: (
      <>
        Every plan is built around your budget, goals, and the platforms that actually make sense
        for your business, not a one-size-fits-all package. The best way to find out what that looks
        like for you is a conversation, not a price list.
        <FaqLink to="/contact">Send us a message to find out how we can help you!</FaqLink>
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact, About, Services, Blog, and Case Studies pages).
export function ServicesKeir() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter text-(--color-ivory)">
          Paid Media & Performance Marketing
        </h1>
      </GrainWave>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-32 sm:pt-20">
        <IntroBanner
          name="Keir"
          words={[
            "ad manager",
            "creative strategist",
            "PPC strategist",
            "strategy designer",
            "growth partner",
          ]}
        />

        <h2 className="text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
          My role in Persevere Media
        </h2>
        <p
          className="mt-6 max-w-2xl text-center text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Paid social and PPC, built and run properly, not set and forgotten.{" "}
          <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
            Ten-plus years of combined experience, £20m+ in ad spend,
          </Highlighter>
          and budgets managed from £1,000 a month to £500,000 a month. Whatever your niche, we've
          (probably) worked it.
        </p>

        <SectionDivider />

        {/* --------------------------------------------------------------- */}
        {/* The approach                                                    */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-5 text-left">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
            My approach
          </h2>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Good paid media isn't a magic algorithm and a big budget. It's the fundamentals done
            properly: real tracking, real strategy, real creative, and{" "}
            <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
              someone who's actually watching the account
            </Highlighter>
            , not letting it run on autopilot.
          </p>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We've managed millions of pounds across a wide range of sectors, from £1,000-a-month
            starters to £500,000-a-month scale-ups. What we've learned along the way: no ego, follow
            the data, and never stop trying to improve. That's not a slogan, it's how every account
            gets run.
          </p>
        </div>

        <SectionDivider reverse />

        {/* --------------------------------------------------------------- */}
        {/* Five stages                                                     */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
            How it all works
          </h2>

          {/* itemStackDistance is deliberately large: it's the sliver of each card
              left showing once the next one stacks over it, so it has to clear the
              card's top padding plus the number/title row to keep them readable. */}
          <ScrollStack
            useWindowScroll
            className="mt-14 max-w-2xl"
            itemDistance={80}
            itemStackDistance={76}
            stackPosition="20%"
            baseScale={0.88}
            itemScale={0.02}
          >
            {STAGES.map((stage) => (
              <ScrollStackItem
                key={stage.number}
                itemClassName="rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) px-7 pt-5 pb-7 text-left shadow-[0_12px_44px_-18px_rgba(74,31,29,0.55)]"
              >
                <div className="flex items-baseline gap-4">
                  <span className="shrink-0 text-[clamp(1.35rem,2.8vw,1.9rem)] font-black tracking-tight text-(--color-terracotta)">
                    {stage.number}
                  </span>
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.45rem)] font-black tracking-tight text-(--color-oxblood)">
                    {stage.title}
                  </h3>
                </div>
                <p
                  className="pt-3 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
                  style={{ fontFamily: "var(--font-body)" }}
                >
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
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
            What's included in the Ads package?
          </h2>
          <ul className="flex flex-col gap-4 text-left">
            {WHATS_INCLUDED.map((item, i) => (
              <AnimatedContent
                key={i}
                direction="vertical"
                distance={20}
                duration={0.6}
                ease="power3.out"
                threshold={0.2}
                delay={i * 0.06}
              >
                <li
                  className="flex items-start gap-3 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
                  style={{ fontFamily: "var(--font-body)" }}
                >
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
        <AlwaysIncluded items={ALWAYS_INCLUDED} />

        <SectionDivider reverse />

        {/* --------------------------------------------------------------- */}
        {/* FAQ                                                             */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-10">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
            FAQ
          </h2>
          <FaqAccordion faqs={FAQS} />
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
