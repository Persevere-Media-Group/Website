import { useEffect, useRef, useState } from "react";
import { PopupModal } from "react-calendly";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { ClickSpark } from "@/ui-components/primitive/click-spark";
import { PersevereAnimation } from "@/ui-components/custom/PersevereAnimation";
import { Grainient } from "@/ui-components/primitive/grainient";
import { SectionWave } from "@/ui-components/primitive/section-wave";
import { YellowPulsatingButton } from "@/ui-components/custom/yellow-pulsating-button";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import { Highlighter } from "@/ui-components/primitive/highlighter";
import { Backlight } from "@/ui-components/primitive/backlight";
import StatsCount from "@/ui-components/primitive/statscount";
import { GrainWave } from "@/ui-components/custom/grain-wave";
import { Testimonials, type Testimonial } from "@/ui-components/primitive/testimonial";
import { LinkCard } from "@/ui-components/custom/link-card";
import { DisplayHeading } from "@/ui-components/custom/display-heading";
import { CALENDLY_URL } from "@/container-contents/services-shared";
import { MARK_PROPS, UNDERLINE_COLOR, HIGHLIGHT_COLOR } from "@/lib/text-marks";

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export function HeroSection() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const wordRef = useRef<HTMLDivElement>(null);
  const wordScale = useAutoFitScale(wordRef);

  // `transform: scale()` only affects paint, not layout: the word's flex
  // sibling gap is reserved against its full unscaled size, leaving extra
  // invisible space above and below once shrunk. Track its natural
  // (unscaled) height so the wrapper below can be given an explicit height
  // matching the *scaled* size instead, keeping the surrounding flex gaps
  // visually accurate.
  const [wordNaturalHeight, setWordNaturalHeight] = useState(0);
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    // PersevereAnimation's letters swap glyph variants forever (every ~900ms,
    // by design), which shifts this element's natural height by a sub-pixel
    // amount on every swap - just from different hand-drawn ink, nothing
    // layout-relevant. Without the threshold below, every single swap would
    // update this state, which resizes the wrapper below (its height is
    // derived from this value), which the ResizeObserver here is itself
    // watching - a self-triggering loop that never settles. A couple of
    // pixels of slop is invisible for what this value is used for (undoing
    // the scaled word's flex-gap reservation), so it's a safe place to
    // ignore noise that isn't a real size change.
    const measure = () => {
      const next = el.offsetHeight;
      setWordNaturalHeight((prev) => (Math.abs(next - prev) < 2 ? prev : next));
    };
    measure();
    document.fonts.ready.then(measure);
    const settleTimeout1 = setTimeout(measure, 150);
    const settleTimeout2 = setTimeout(measure, 500);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      ro.disconnect();
    };
  }, []);

  return (
    <ClickSpark
      sparkColor="--color-ivory"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1}
      className="relative flex min-h-[58vh] flex-col items-center justify-center overflow-hidden bg-(--color-terracotta) px-4 pt-10 pb-8 text-center sm:min-h-[60vh] sm:pt-14 sm:pb-10 md:pb-12"
    >
      <Grainient
        colors={["--color-deep-plum", "--color-terracotta", "--color-amber-gold"]}
        speed={7}
        scale={1}
        noiseIntensity={1.5}
        rotation={0}
        className="absolute inset-0"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-8 px-4 pt-12 pb-10 text-center sm:gap-8 sm:pt-16 sm:pb-14 md:pb-16">
        <div className="flex w-full flex-col items-center gap-8">
          {/* Mirrors the "-mt-8" paragraph below exactly: gap-8 plus an equal
              and opposite negative margin cancel out, leaving only the word's
              natural glyph-overshoot buffer as the visible gap - same
              mechanism on both sides is what keeps the two gaps equal. */}
          <p className="-mb-8 font-subtitle text-[clamp(1.75rem,5.5vw,2.75rem)] font-black tracking-[0.3em] text-(--color-oxblood) uppercase sm:-mb-9">
            Choose
          </p>

          <div
            className="flex w-full items-start justify-center"
            style={{ height: wordNaturalHeight ? wordNaturalHeight * wordScale : undefined }}
          >
            <div
              ref={wordRef}
              style={{ transform: `scale(${wordScale})`, transformOrigin: "top center" }}
            >
              <PersevereAnimation
                showBackground={false}
                textClassName="text-(--color-ivory)"
                sizeClassName="text-[clamp(64px,13vw,180px)]"
                grainy
              />
            </div>
          </div>
        </div>

        {/* Negative margin pulls this up into the word's reserved (but
            normally-empty) glyph-overshoot padding below "persevere" - the
            flex `gap` alone leaves that space looking too large. Only eats
            part of the buffer, not all of it, so an unusually deep descender
            variant still has room and won't get visually clipped by this
            text. */}
        <p className="-mt-8 text-center text-[clamp(1.25rem,5vw,1.6rem)] font-subtitle font-black leading-none tracking-wide text-(--color-oxblood) sm:-mt-9 sm:text-[clamp(1.4rem,4vw,1.85rem)]">
          Content & Ads done properly. Nae faff.
        </p>

        <YellowPulsatingButton
          onClick={() => setIsCalendlyOpen(true)}
          className="px-6 py-3 text-base sm:px-7 sm:py-3.5 sm:text-lg"
        >
          Book a Call
        </YellowPulsatingButton>
      </div>

      <SectionWave fillColor="--color-ivory" className="z-20 h-20 sm:h-28 md:h-36" />

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </ClickSpark>
  );
}

// ---------------------------------------------------------------------------
// Facts
// ---------------------------------------------------------------------------

const FACTS_BLOCKS = [
  {
    heading: "Proven industry experience.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          £20m+
        </Highlighter>
        in ad spend, across{" "}
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          50+
        </Highlighter>{" "}
        brands managed,{" "}
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          1000s
        </Highlighter>{" "}
        of hours of experience. We've been there and done it time and again, and{" "}
        <Highlighter
          action="underline"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
        >
          have the results to show for it
        </Highlighter>
        .
      </>
    ),
  },
  {
    heading: "The best of both worlds.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          Content and paid ads
        </Highlighter>
        , under one roof. No more choosing between a{" "}
        <Highlighter
          action="underline"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
        >
          creative team or an ads agency
        </Highlighter>
        .
      </>
    ),
  },
  {
    heading: "Just two of us to deal with.",
    body: (
      <>
        You get{" "}
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          Keir and Calum
        </Highlighter>
        . The two who are{" "}
        <Highlighter
          action="underline"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
        >
          actually doing the work
        </Highlighter>
        . No account managers, no profit-skimming by shareholders, and 100% of your budget going
        exactly where it should be.
      </>
    ),
  },
];

export function FactsSection() {
  return (
    <section className="flex flex-col items-center gap-16 bg-(--color-ivory) px-4 py-4 text-center">
      {FACTS_BLOCKS.map((block, i) => (
        <AnimatedContent key={block.heading} distance={50} duration={0.8} delay={i * 0.15}>
          <div className="max-w-xl">
            <h3 className="font-subtitle text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-oxblood)">
              {block.heading}
            </h3>
            <p className="mt-3 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
              {block.body}
            </p>
          </div>
        </AnimatedContent>
      ))}

      <div className="flex aspect-video w-full max-w-3xl items-center justify-center rounded-2xl border-2 border-dashed border-(--color-oxblood)/20 bg-(--color-oxblood)/5 text-(--color-oxblood)/40">
        Placeholder image
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

const STATS = [
  { value: 20, prefix: "£", suffix: "M+", label: "in ad spend managed" },
  { value: 12, suffix: "+", unit: "years", label: "of combined experience" },
  { value: 100, suffix: "%", label: "of your budget going where it should" },
];

export function StatsCountSection() {
  return (
    <section className="bg-(--color-ivory) px-4 py-8 text-center">
      {/* text-(--color-oxblood) is set once here and inherits down to the big numbers,
          which have NO colour class of their own in the real component source, that's
          exactly why they were rendering plain black before, nothing was overriding
          the browser default. the title is a real <h2> with its own explicit
          text-sm/font-medium/tracking-wide classes, so matching it to the Facts
          headings needs !important overrides to actually beat those, inheritance alone
          isn't enough when the element already has its own conflicting utility classes */}
      <StatsCount
        stats={STATS}
        title="" // Blank on purpose
        showDividers={false}
        className="mt-10 text-(--color-oxblood) [&_h2]:text-[clamp(1.5rem,3vw,2rem)]! [&_h2]:font-black! [&_h2]:tracking-tight!"
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

const PLACEHOLDER_VIDEO_SRC = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export function VideoSection() {
  return (
    <section className="flex flex-col items-center gap-6 bg-(--color-ivory) px-4 py-4 text-center">
      <AnimatedContent distance={50} duration={0.8} className="w-full">
        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="font-subtitle text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-oxblood)">
            Title Placeholder
          </h2>

          <div className="mx-auto mt-8 mb-14 w-full max-w-3xl">
            <Backlight blur={40} className="block w-full">
              <iframe
                className="aspect-video w-full rounded-2xl border-2 border-white"
                src={PLACEHOLDER_VIDEO_SRC}
                title="What we're all about"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </Backlight>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

// PLACEHOLDER content - swap these for real client quotes once we have some
// to show. Left obviously fake rather than invented-but-plausible so nobody
// mistakes this for a genuine review before it's replaced.
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
];

export function TestimonialsSection() {
  return (
    <Testimonials
      testimonials={TESTIMONIALS}
      heading={
        <>
          We could tell you we're great.
          <br />
          Or you could just ask them.
        </>
      }
      subheading="The proof is in the pudding…"
      className="bg-(--color-ivory)"
    />
  );
}

// ---------------------------------------------------------------------------
// Our Services
// ---------------------------------------------------------------------------

const OUR_SERVICES_ID = "our-services";

const SERVICES_BLOCKS = [
  {
    heading: "Ads done right.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          £20m+ in ad spend
        </Highlighter>{" "}
        managed across budgets from £1,000 a month to £500,000 a month. We design a bespoke
        strategy, test constantly, and evolve with the data. We're not leaving you with{" "}
        <Highlighter
          action="underline"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
        >
          an AI agent left on autopilot
        </Highlighter>
        .
      </>
    ),
    to: "/services/keir",
    linkLabel: "Learn more about our ads services",
  },
  {
    eyebrow: "CREATIVE",
    heading: "Creative that converts.",
    body: (
      <>
        We build out your customer avatars, script the copy, and shoot and edit creative to make{" "}
        <Highlighter
          action="highlight"
          color={HIGHLIGHT_COLOR}
          {...MARK_PROPS}
        >
          thumb stopping content
        </Highlighter>{" "}
        for your organic pages or your paid campaigns. Crafted by{" "}
        <Highlighter
          action="underline"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
        >
          the same team running your campaigns
        </Highlighter>
        , closing the feedback loop, learning and implementing change faster.
      </>
    ),
    to: "/services/calum",
    linkLabel: "Learn more about our creative services",
  },
];

export function OurServicesSection() {
  return (
    <section id={OUR_SERVICES_ID} className="bg-(--color-ivory) px-4 py-4 text-center">
      <DisplayHeading
        subheading={
          <>
            Most agencies offer you one service and leave you to find the other. We do both, under
            one roof. We keep it simple, accessible and affordable.
          </>
        }
      >
        The best of both worlds
      </DisplayHeading>

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 text-left sm:grid-cols-2">
        {SERVICES_BLOCKS.map((block, i) => (
          <LinkCard
            key={block.to}
            to={block.to}
            heading={block.heading}
            headingClassName="font-subtitle text-[clamp(1.75rem,3.4vw,2.1rem)] font-black tracking-wide text-(--color-oxblood)"
            body={block.body}
            linkLabel="Learn more"
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why Choose Us
// ---------------------------------------------------------------------------

export function WhyChooseSection({ onBookCall }: { onBookCall: () => void }) {
  return (
    <GrainWave height="22rem" waveClassName="h-16 sm:h-24 md:h-28" waveTop waveBottom={false}>
      <AnimatedContent distance={40} duration={0.7}>
        <h2 className="font-subtitle text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-ivory)">
          We are your growth partners.
        </h2>
        <p className="mx-auto mt-4 max-w-4xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-ivory)/85">
          We're a no BS team who'll tell you what you need to hear, not what you want to hear. Your
          wins are our wins. We want to scale with you, keep improving with you, and never settle
          for "good enough."
          <br />
          <em>Ready to come aboard?</em>
        </p>

        <YellowPulsatingButton onClick={onBookCall} className="mx-auto mt-12">
          Book a call
        </YellowPulsatingButton>
      </AnimatedContent>
    </GrainWave>
  );
}
