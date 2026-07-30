import { useState } from "react";
import { PopupModal } from "react-calendly";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { X } from "lucide-react";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import AnimatedContent from "@/components/primitive/animated-content";
import { PulsatingButton } from "@/components/primitive/pulsating-button";

// same link used elsewhere on the site, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const UNDERLINE_COLOR = "#d5573b";
const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";

const MARK_PROPS = {
  isView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

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
  "Shoots, for paid and organic use alike, starting at one half-day a month and scaling with your needs",
  "Full production: editing, colour grading, and captioning to a professional standard",
  "A full range of formats: short-form video, long-form, VSLs, static graphics, and reels",
  "Organic social strategy and rollout, including the actual posting and account management, not just the content itself",
  "Platform strategy built around where your audience actually is, most often Instagram, TikTok, or YouTube",
];

const ALWAYS_INCLUDED = [
  {
    title: "Monthly reporting call and weekly check-ins",
    body: "A proper call every month, going through what's working, what's changed, and what's next. We also check in with you every week so you're never left wondering how things are going.",
  },
  {
    title: "Direct access to us",
    body: "A group chat with the two of us. Real access, not an account manager relaying messages. (Not at 11pm though, we've got lives too.)",
  },
  {
    title: "Transparent reporting",
    body: "Clear, honest reporting on the signals that actually matter. Saves, shares, watch-time - no vanity numbers dressed up to look good.",
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQS = [
  {
    q: "Do I need any equipment?",
    a: "No. We handle all of it, cameras, lighting, sound, the lot. You just need to show up.",
  },
  {
    q: "Do you handle the posting, or just the content?",
    a: "Both. We manage the accounts and the posting ourselves, this isn't a drop-and-run content delivery service.",
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
    q: "Do you handle paid ads too?",
    a: "Yes, that's the other half of what we do. Content and paid media, all under one roof, so nothing gets lost in translation between an ads agency and a separate content team.",
  },
];

// bento grid: 3 cols, each card just a low-opacity coloured border until clicked open
const FAQ_BORDER_COLORS = [
  "border-(--color-oxblood)/30",
  "border-(--color-clay-rose)/40",
  "border-(--color-amber-gold)/40",
  "border-(--color-terracotta)/40",
  "border-(--color-deep-plum)/30",
];

const MORPH_TRANSITION = { type: "spring", stiffness: 280, damping: 30, mass: 0.9 } as const;

function FaqBento() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <LayoutGroup>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          const borderColor = FAQ_BORDER_COLORS[i % FAQ_BORDER_COLORS.length];

          return (
            <AnimatedContent
              key={faq.q}
              direction="vertical"
              distance={20}
              duration={0.6}
              ease="power3.out"
              threshold={0.2}
              delay={i * 0.06}
              className={isOpen ? "col-span-3" : ""}
            >
              <motion.button
                layout
                transition={MORPH_TRANSITION}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`relative flex w-full flex-col overflow-hidden rounded-2xl border-2 bg-(--color-ivory) text-left shadow-sm sm:rounded-3xl ${borderColor} ${
                  isOpen
                    ? "min-h-32 gap-3 p-5 sm:min-h-40 sm:gap-4 sm:p-8"
                    : "aspect-square items-center justify-center gap-0 p-3 text-center hover:-translate-y-1 hover:shadow-md sm:p-6"
                }`}
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      key="close"
                      role="button"
                      aria-label="Close"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpenIndex(null);
                      }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-(--color-oxblood)/60 transition-colors hover:bg-(--color-oxblood)/10 hover:text-(--color-oxblood)"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.h3
                  layout="position"
                  className={`font-black tracking-tight text-(--color-oxblood) ${
                    isOpen
                      ? "pr-8 text-[clamp(1.1rem,2vw,1.4rem)]"
                      : "text-[clamp(0.85rem,1.6vw,1.05rem)] leading-snug"
                  }`}
                >
                  {faq.q}
                </motion.h3>
                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      key="answer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      className="text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-(--color-oxblood)/80"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            </AnimatedContent>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

// ---------------------------------------------------------------------------
// Fit toggle
// ---------------------------------------------------------------------------

const FIT_YES = [
  "You care about real growth. Not just likes. Not just reach. Actual results.",
  "You want content that's built with the same eye as a proper campaign. Craft, not filler.",
  "You're ready to give it a proper runway. Real organic growth takes months, not days.",
];

const FIT_NO = [
  "You're chasing an overnight viral moment. We build for the long game, not a lucky post.",
  "You want posts without a strategy behind them. A few reels won't change your business.",
  "You measure success by likes alone. Vanity metrics don't pay the bills.",
];

function FitToggle() {
  const [tab, setTab] = useState<"yes" | "no">("yes");
  const points = tab === "yes" ? FIT_YES : FIT_NO;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setTab("yes")}
          className={`rounded-full px-6 py-2.5 text-sm font-bold tracking-tight transition-colors ${
            tab === "yes"
              ? "bg-(--color-terracotta) text-(--color-ivory)"
              : "border-2 border-(--color-terracotta) text-(--color-terracotta)"
          }`}
        >
          We're a good fit if...
        </button>
        <button
          type="button"
          onClick={() => setTab("no")}
          className={`rounded-full px-6 py-2.5 text-sm font-bold tracking-tight transition-colors ${
            tab === "no"
              ? "bg-(--color-terracotta) text-(--color-ivory)"
              : "border-2 border-(--color-terracotta) text-(--color-terracotta)"
          }`}
        >
          We're probably not right if...
        </button>
      </div>

      <div className="mt-10 flex w-full max-w-2xl flex-col gap-6">
        {points.map((point, i) => (
          <AnimatedContent
            key={`${tab}-${i}`}
            direction="vertical"
            distance={16}
            duration={0.5}
            ease="power3.out"
            delay={i * 0.08}
          >
            <div className="flex items-start gap-5 text-left">
              <span className="shrink-0 text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-terracotta)/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="mt-1.5 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {point}
              </p>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}

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
        <h2 className="text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
          What can we do for you?
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
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            The approach
          </h2>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Organic growth isn't about posting more. The platforms don't care how many followers you
            have, they care whether people{" "}
            <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
              save it, share it, and actually watch it
            </Highlighter>
            . Likes barely count. Chase likes and you're optimising for the wrong thing entirely.
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
            What's included
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
        <div className="mt-20 flex w-full max-w-3xl flex-col items-center">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            Always included
          </h2>

          <div className="mt-12 grid w-full gap-8 text-left sm:grid-cols-3">
            {ALWAYS_INCLUDED.map((item, i) => (
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

        <SectionDivider reverse />

        {/* --------------------------------------------------------------- */}
        {/* On camera or not                                                */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-2xl flex-col gap-4 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-(--color-oxblood)">
            Comfortable on camera? Or want us to handle it?
          </h2>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Some founders love being the face of their brand. Others would rather not be. Either
            works. If you're happy on camera, we'll build content around you. If you’re not as
            confident, we can help you become a natural in front of a camera lens, or discuss other
            ways to represent your brand.
          </p>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Getting started                                                 */}
        {/* --------------------------------------------------------------- */}
        <div className="mt-20 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-(--color-oxblood)">
            Getting started
          </h2>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every plan is built around what your business actually needs, from shoot frequency to
            platform mix. The best way to find out what that looks like for you is a conversation,
            not a price list.
          </p>
        </div>

        <SectionDivider />

        {/* --------------------------------------------------------------- */}
        {/* FAQ                                                             */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-5xl flex-col gap-10">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            FAQ
          </h2>
          <FaqBento />        </div>

        <SectionDivider reverse />

        {/* --------------------------------------------------------------- */}
        {/* Is this the right fit                                          */}
        {/* --------------------------------------------------------------- */}
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
            Is this the right fit?
          </h2>
          <div className="mt-12 w-full">
            <FitToggle />
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Closing CTA                                                     */}
        {/* --------------------------------------------------------------- */}
        <div className="mt-24 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-black leading-tight tracking-tight text-(--color-oxblood)">
            We're your growth partner.
          </h2>
          <p
            className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Not a quick campaign and a runaway. We scale with you, keep improving with you, and
            never settle for{" "}
            <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={10}>
              "good enough."
            </Highlighter>
          </p>
          <br />
          <PulsatingButton
            pulseColor="var(--color-amber-gold)"
            duration="1.8s"
            className="rounded-full bg-(--color-amber-gold) px-8 py-4 text-base font-bold text-(--color-oxblood) shadow-[0_0_28px_-6px_var(--color-amber-gold)]"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Book a free discovery call
          </PulsatingButton>
        </div>
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
