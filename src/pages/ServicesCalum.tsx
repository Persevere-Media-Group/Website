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
    body: "Before a camera comes out, we want to know your business inside out. Your customers, their pain points, the problem you solve and how you solve it differently. We’ll send you an onboarding form to fill, then we sit down together to go through it properly. Usually done within one to two days.",
  },
  {
    number: "02",
    title: "The Groundwork",
    body: "We take pre-production seriously. Scripting, planning the shoot day, working out which formats do which job for your brand. Skip this stage and everything after it is just guesswork. We don't rush it.",
  },
  {
    number: "03",
    title: "Create",
    body: "Shoot day. One or two half-day shoots a month is a great place to start, but we’re adaptable to what your business actually needs. Then the real craft: editing, colour grading, captioning, all done professionally. No Capcut templates here.",
  },
  {
    number: "04",
    title: "Launch",
    body: "The content goes live. We manage the posting and the accounts ourselves, this isn't a 'here are your files, good luck!' handover. We're watching what lands and what doesn't from day one.",
  },
  {
    number: "05",
    title: "Scale",
    body: "When something's working, we lean into it. We keep sharpening the strategy as we learn what your specific audience actually responds to. We're your growth partner, not an agency that declares victory and coasts.",
  },
];

// ---------------------------------------------------------------------------
// What's included
// ---------------------------------------------------------------------------

const WHATS_INCLUDED = [
  "Shoots for paid and organic content, starting at one half-day a month and scaling with your needs",
  "Full production: editing, colour grading, and captioning to a professional standard",
  "A full range of formats: short-form video, long-form, VSLs, static graphics, and reels",
  "Organic social strategy and rollout, including posting and account management, not just the content itself",
  "Platform strategy built around where your audience actually is, most often Instagram, TikTok, or YouTube",
];

const ALWAYS_INCLUDED = [
  {
    title: "Monthly calls, weekly check-ins",
    body: "A proper call each month to cover what's working, what's changed, and what's next, plus a weekly check-in so you're never left wondering how things stand.",
  },
  {
    title: "Direct access to us",
    body: "A group chat with the two of us. Real access, not an account manager relaying messages. (Not at 11pm though, we've got lives too.)",
  },
  {
    title: "Transparent reporting",
    body: "Honest reporting on the signals that actually matter: saves, shares, watch-time. No vanity numbers dressed up to look good.",
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQS = [
  {
    q: "Do I need any equipment?",
    a: "Nope! We handle all of it. Cameras, lighting, sound, the lot. You just need to show up.",
  },
  {
    q: "What if I'm not comfortable in front of a camera?",
    a: "Some founders love being the face of their brand. Others would rather not be. Either works. If you're happy on camera, we'll build content around you. If you're not as confident, we can help you become a natural in front of a camera lens, or discuss other ways to represent your brand.",
  },
  {
    q: "Do you handle the ads too, or just the content?",
    a: (
      <>
        Both. Content and paid are handled under one roof, from shoots and edits through to the
        campaigns themselves, so nothing gets lost in translation between a content team and a
        separate ads agency.
        <FaqLink to="/services/keir">Check out the Ads service for more details</FaqLink>
      </>
    ),
  },
  {
    q: "How long before I see results?",
    a: "The honest answer is, it depends, but organic growth is genuinely a three to six month game, not a three-week one. We won't promise overnight virality just to get you onboard. What we'll guarantee is a real strategy, properly executed, and total honesty about how it's tracking.",
  },
  {
    q: "Are there long-term contracts?",
    a: "We ask for an initial three-month commitment, same as our paid media work, but for a different reason. Organic growth is about understanding your audience's signals and continually refining the strategy around them, and that takes a bit of runway to do properly. After three months, you're free to roll monthly (we'd love to have you!), no long lock-ins, no small print.",
  },
  {
    q: "How do we get started?",
    a: (
      <>
        Every plan is built around what your business actually needs, from shoot frequency to
        platform mix. The best way to find out what that looks like for you is a conversation, not a
        price list.
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
export function ServicesCalum() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter text-(--color-ivory)">
          Creative Strategy, Content Creation & Organic Social
        </h1>
      </GrainWave>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-32 sm:pt-20">
        <IntroBanner
          name="Calum"
          words={[
            "photographer",
            "editor",
            "videographer",
            "ad creator",
            "content strategist",
            "growth partner",
          ]}
        />

        <h2 className="text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
          My role in Persevere Media
        </h2>
        <p
          className="mt-6 max-w-xl text-center text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Video, photography, and organic social, built as one system, not a pile of disconnected
          posts. Shoots, edits, strategy, and the actual posting, done properly, by people who care
          whether it works.
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
            Organic growth isn't about posting more. The platforms don't care how many followers you
            have, they care whether people save it, share it, and actually watch it.{" "}
            <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
              Likes barely count.
            </Highlighter>{" "}
            Chase likes and you're optimising for the wrong thing entirely.
          </p>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            So we build for the signals that actually matter. This takes time. We're honest about
            that from the start, real traction is usually a{" "}
            <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
              three to six month game
            </Highlighter>
            , not a three-week one. Any agency promising overnight virality is either guessing or
            lying, and we'd rather tell you the truth and earn it properly.
          </p>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            This works best if you care about real growth, not just likes, and you're ready to give
            it a proper runway. It's probably not for you if you're chasing a one-off viral moment
            or a few strategy-less reels feel like enough.
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
                  <h3 className="text-[clamp(1.1rem,2.2vw,1.45rem)] font-black tracking-tight text-(--color-oxblood)">
                    {stage.title}
                  </h3>
                </div>
                <p
                  className="px-7 pt-3 pb-8 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
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
            What's included in the Creative package?
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
