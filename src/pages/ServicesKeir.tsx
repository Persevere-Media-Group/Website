import { useState, type ReactNode } from "react";
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
import { FaqAccordion, FaqLink } from "@/components/custom/faq";
import { AlwaysIncluded, ClosingCta, IntroBanner } from "@/pages/ServicesCombined";

// ---------------------------------------------------------------------------
// The five stages
// ---------------------------------------------------------------------------

const STAGES = [
  {
    number: "01",
    title: "Welcome Aboard!",
    body: "Before we touch a single campaign, we want to know your business inside out; your customers, their problems and what's stopping them from buying.",
  },
  {
    number: "02",
    title: "Groundwork",
    body: "We delve deeper into the technical details. We audit your current campaigns, your website and your analytics. We also set up your tracking to measure real results.",
  },
  {
    number: "03",
    title: "Build",
    body: "Shooting, editing and fine tuning your creatives. We will also get to work on designing your campaign strategy. It doesn't stop once it's built- strategy keeps evolving as we learn more, because we're driven by the data, not by what we planned on day one.",
  },
  {
    number: "04",
    title: "Launch",
    body: "This is where the real learning starts; absorbing everything the campaigns tell us and feeding it straight back into the strategy. Continuous improvement isn't a 'nice to have', it's essential!",
  },
  {
    number: "05",
    title: "Growth",
    body: "When it's working, we don't sit back. We scale it, and we keep improving as we go. We're your growth partner, We're not interested in settling.",
  },
];

// ---------------------------------------------------------------------------
// What's included
// ---------------------------------------------------------------------------

const WHATS_INCLUDED = [
  "We are a no BS team who will tell you what you need to hear, not what you want to hear.",
  "We are seasoned pros, if we do say so ourselves. We have been there and done it, time and again.",
  "We have offer you creative and performance services under one roof, so you don't have to choose between one or the other.",
  "A team who genuinely cares about your business, and will stick around, not ghost you after you've onboarded.",
];

// bodies are paired by index with the shared ALWAYS_INCLUDED_HEADINGS in
// services-shared.tsx (monthly calls/weekly check-ins, direct access, reporting)
const ALWAYS_INCLUDED_BODIES: [ReactNode, ReactNode, ReactNode] = [
  "A check in every week. A proper call every month, going through what's working, what's changed, and what's next. We are part of your team!",
  <>
    A dedicated group chat with the two of us, to discuss day-to-day performance, and to feel like
    an extension of your team. We want to give you real access, not an account manager relaying
    messages. <em>(Not at 11pm though, we've got lives too.)</em>
  </>,
  "We'll help you get set up with tools that keep the numbers clear and trustworthy, not vanity metrics dressed up to make us look good. We want your business to actually do well, not just make us look good.",
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
        <h1 className="mt-3 text-center text-[clamp(3.5rem,9vw,6rem)] font-heading leading-[0.85] tracking-wide text-(--color-ivory)">
          <span className="block">Performance</span>
          <span className="block ml-[2em]">Marketing</span>
        </h1>
      </GrainWave>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <IntroBanner
          name="Keir"
          words={[
            "ad manager",
            "creative strategist",
            "PPC strategist",
            "strategy designer",
            "growth partner",
          ]}
          note="When I'm not working on your ad campaigns, you can find me at Edinburgh Filmhouse watching movies, running, listening to new albums, or trying out a new coffee shop!"
        />
        <h2 className="font-subtitle text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
          My role in Persevere Media
        </h2>
        <p className="mt-6 max-w-2xl text-center text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
          I lead all things Paid Media, such as Paid social and PPC. I build and run it properly; no
          setting and forgetting here! I have over{" "}
          <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
            5+ years of experience
          </Highlighter>
          , managing{" "}
          <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
            £20m+ in ad spend
          </Highlighter>{" "}
          across a huge variety of sectors and niches. I've managed budgets from{" "}
          <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
            £1,000
          </Highlighter>{" "}
          a month to{" "}
          <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
            £500,000
          </Highlighter>{" "}
          a month. Whatever your niche, I've (probably) worked it.
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
          <p className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80">
            At Persevere, getting strong results from your campaigns doesn't just come from a magic
            algorithm or an AI agent. <strong>It comes from us.</strong> Real people with years of
            real experience, designing a bespoke strategy. We consistently test and learn from the
            data and constantly evolve your campaign. We're not about leaving your account on
            autopilot.
          </p>
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
            {STAGES.map((stage) => (
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
            Business Partners (with Benefits)
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
        <AlwaysIncluded bodies={ALWAYS_INCLUDED_BODIES} />
        <SectionDivider reverse />
        {/* --------------------------------------------------------------- */}
        {/* FAQ                                                             */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-10">
          <h2 className="font-subtitle text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
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
