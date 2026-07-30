import { useState } from "react";
import { Link } from "react-router-dom";
import { PopupModal } from "react-calendly";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import AnimatedContent from "@/components/primitive/animated-content";
import {
  CALENDLY_URL,
  UNDERLINE_COLOR,
  HIGHLIGHT_COLOR,
  MARK_PROPS,
  FaqAccordion,
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
    q: "How much should I be spending to work with you?",
    a: (
      <>
        We work across a wide range of budgets, from four figures a month to six. As a starting
        point, we'd recommend reserving at least{" "}
        <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={8}>
          £500 a month
        </Highlighter>{" "}
        for ad spend alone, on top of management, so the platform actually has enough to work with,
        though this varies by sector and goals. Not sure what's realistic for you? That's exactly
        what the discovery call is for.
      </>
    ),
  },
  {
    q: "Do you handle the creative too, or just the ads?",
    a: (
      <>
        Both. Creative and paid are handled under one roof, from scripting and shooting through to
        the campaigns themselves, so nothing gets lost in translation between an ads agency and a
        separate content team.{" "}
        <Link
          to="/services/calum"
          className="font-bold text-(--color-terracotta) underline underline-offset-2"
        >
          Check out the Creative service for more details
        </Link>
        .
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
        <IntroBanner name="Keir" flipTo="your ad manager" />

        <h2 className="text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
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
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            The approach
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
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            How it works: our five stages
          </h2>

          <div className="mt-14 flex w-full flex-col gap-10">
            {STAGES.map((stage, i) => (
              <AnimatedContent
                key={stage.number}
                direction="vertical"
                distance={28}
                duration={0.7}
                ease="power3.out"
                threshold={0.2}
                delay={i * 0.08}
              >
                <div className="flex items-start gap-6 text-left">
                  <span className="shrink-0 text-[clamp(1.75rem,3.5vw,2.5rem)] font-black tracking-tight text-(--color-terracotta)/30">
                    {stage.number}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-black tracking-tight text-(--color-oxblood)">
                      {stage.title}
                    </h3>
                    <p
                      className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {stage.body}
                    </p>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* --------------------------------------------------------------- */}
        {/* What's included                                                 */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
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
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
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
