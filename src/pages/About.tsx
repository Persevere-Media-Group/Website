import { useState } from "react";
import { Link } from "react-router-dom";
import { PopupModal } from "react-calendly";
import { ChevronRight } from "lucide-react";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import AnimatedContent from "@/components/primitive/animated-content";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import SquigglyArrow from "@/components/primitive/squiggly-arrow";
import { YellowPulsatingButton } from "@/components/custom/yellow-pulsating-button";
import { Testimonials, type Testimonial } from "@/components/primitive/testimonial";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/primitive/accordion";
import { CALENDLY_URL } from "@/pages/services-shared";

// ---------------------------------------------------------------------------
// Highlight/underline config
// ---------------------------------------------------------------------------

// shared props so every mark behaves identically, sketchy hand-drawn feel that draws
// itself as it scrolls into view
const MARK_PROPS = {
  triggerOnView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

// how long each "half" (grim or good) takes to float in as one block, and roughly
// how long its marks then take to finish drawing themselves on afterwards - used to
// time-offset the next beat (the marks, the Or, the other half) so the sequence
// reads as show-the-text -> then-annotate-it rather than everything at once
const BLOCK_REVEAL_DURATION = 0.8;
const ANNOTATION_SETTLE = 1.1;

// terracotta underline for the grim half, reads like a red pen marking up what's wrong
const UNDERLINE_COLOR = "#d5573b";
// soft amber highlight for the good half, warm and positive rather than critical
const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

// the two halves of the business, one each, deliberately presented side by side so the
// "both under one roof" point is made visually before it's made in words
// each body is a punchy bold hook followed by the supporting detail, rather than
// one flat paragraph, so there's an immediate visual anchor before the reader
// commits to the rest of the sentence
const ROLES = [
  {
    title: "Content & Organic",
    lead: "Led by Calum",
    hook: "The stuff that makes people follow you, trust you, and remember you.",
    detail:
      "Video, organic social, and influencer partnerships built around your brand, not pulled off a template.",
    to: "/services/calum",
    linkLabel: "Learn more",
  },
  {
    title: "Paid & Performance",
    lead: "Led by Keir",
    hook: "The engine that turns all that attention into sales.",
    detail:
      "Paid social, Google and PPC, and conversion rate optimisation that squeezes more out of every click.",
    to: "/services/keir",
    linkLabel: "Learn more",
  },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

// PLACEHOLDER content - swap these for real client quotes once we have some
// to show. Left obviously fake rather than invented-but-plausible so nobody
// mistakes this for a genuine review before it's replaced.
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Placeholder testimonial - replace with a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder testimonial - replace with a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder testimonial - replace with a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
];

// ---------------------------------------------------------------------------
// Trainspotting monologue
// ---------------------------------------------------------------------------

// pared right back: short, staccato, repetitive. the power in the trainspotting
// monologue is the hammering rhythm, not the detail, anything that needs a comma to
// hold it together has been cut or split. marks stay sparing, three per half.
const BEFORE = [
  <>
    Choose the wrong agency. Choose
    <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      Stockholm syndrome
    </Highlighter>
    .
  </>,
  <>Choose "we're working on it." Choose just a few more months.</>,
  <>
    Choose lining shareholders' pockets. Choose being a retainer,
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      not a client.
    </Highlighter>
  </>,
  <>
    Choose a manager who gets paid either way. Profit or loss.{" "}
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      They don't care.
    </Highlighter>
  </>,
  <>
    Choose paying for humans. Choose receiving{" "}
    <Highlighter action="box" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      AI slop
    </Highlighter>
    .
  </>,
  <>Choose mediocrity. Choose the sunk cost fallacy. Choose blending in.</>,
];

const AFTER = [
  <>Choose making it right. Choose not getting burned again.</>,
  <>
    Choose working with{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      actual people
    </Highlighter>
    . People who care about doing good work and paying the bills.
  </>,
  <>Choose taking a chance on us. Choose bespoke content strategies.</>,
  <>
    Choose not deciding between an ads agency and a creative team. Choose{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      the best of both worlds
    </Highlighter>
    .
  </>,
  <>
    Choose a team who actually care. Choose{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      fair fees
    </Highlighter>
    .
  </>,
  <>Choose craft. Choose good vibes. Choose growth. Choose a brighter future.</>,
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function About() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  // NOTE: the <section> deliberately has no padding of its own. Any padding here would
  // push GrainWave down from the top of the page and stop it reaching the screen edges,
  // so the padding lives on the content wrapper below the band instead (same pattern
  // used on the Contact page).
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter text-(--color-ivory)">
          About Us
        </h1>
      </GrainWave>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-16 sm:pt-20">
        <h2 className="mt-3 text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
          Two of us. Everything you need.
        </h2>

        {/* the two halves side by side on desktop, stacked on mobile - same card
          treatment as the Our Services section on the homepage */}
        <div className="mx-auto mt-14 grid w-full max-w-4xl gap-8 text-left sm:grid-cols-2">
          {ROLES.map((role, i) => (
            <AnimatedContent
              key={role.title}
              direction="vertical"
              distance={40}
              duration={0.7}
              ease="power3.out"
              threshold={0.2}
              delay={i * 0.1}
              className="h-full"
            >
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-8 shadow-[0_12px_44px_-18px_rgba(74,31,29,0.25)]">
                <p
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-(--color-terracotta)"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {role.lead}
                </p>
                <h3 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-black tracking-tight text-(--color-oxblood)">
                  {role.title}
                </h3>
                <p
                  className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed font-semibold text-(--color-oxblood)"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {role.hook}
                </p>
                <p
                  className="text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-(--color-oxblood)/80"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {role.detail}
                </p>
                <Link
                  to={role.to}
                  className="group mt-2 inline-flex w-fit items-center gap-1 font-bold text-(--color-terracotta) underline underline-offset-2"
                >
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1">
                    {role.linkLabel}
                  </span>
                  <SquigglyArrow
                    width={120}
                    height={60}
                    strokeWidth={4}
                    variant="bouncy"
                    className="text-current"
                  />
                </Link>
              </div>
            </AnimatedContent>
          ))}
        </div>

        <div className="mt-20 flex w-full max-w-2xl flex-col gap-14 text-left">
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
              How it started
            </h2>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Keir and Calum met over four years ago in the corporate marketing world.{" "}
              <strong className="font-bold text-(--color-oxblood)">
                Calum behind the camera as videographer and editor, Keir in front of it
              </strong>{" "}
              (and behind the strategy) for businesses all over the world.
            </p>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              For years we sharpened our craft on other people's payrolls, forever joking about what
              we could build if we pooled two skillsets that so rarely live under one roof. Then we
              actually moved in together, survived a year of flat-share life without falling out,
              and figured:{" "}
              <strong className="font-bold text-(--color-oxblood)">
                if we can manage that, we can manage this.
              </strong>
            </p>
            <p className="text-[clamp(1.15rem,2.2vw,1.4rem)] font-black tracking-tight text-(--color-oxblood)">
              So we did. Persevere was born.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
              Why “Persevere”?
            </h2>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              It's Leith's word. You'll spot it on old buildings, on the crest, worked into the
              fabric of the place. It's meant something to Keir across the near-six years he's
              called the area home. It's where he put down roots, and where he met his wife. Calum,
              naturally, was the one on camera duty for the wedding.
            </p>
            <Accordion
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              variants={{
                expanded: { opacity: 1, scale: 1 },
                collapsed: { opacity: 0, scale: 0.7 },
              }}
            >
              <AccordionItem value="history">
                <AccordionTrigger className="w-full py-0.5 text-left">
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 shrink-0 text-(--color-terracotta) transition-transform duration-200 group-data-expanded:rotate-90" />
                    <span className="ml-3 text-[clamp(1rem,1.6vw,1.1rem)] font-bold text-(--color-oxblood)">
                      Want a quick history lesson?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="origin-top">
                  <p
                    className="pt-3 pl-8 text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    The word Persevere itself goes back further than most people realise. Leith was
                    its own burgh for centuries, a proper port town in its own right. Trading,
                    shipbuilding, always a bit separate from Edinburgh next door even after the two
                    got merged in 1920. It was never an easy place. Leith took some real knocks over
                    the years; poverty, overcrowding, the docks declining... but it kept rebuilding
                    itself every time. Nobody's entirely sure when "Persevere" first got adopted as
                    the motto, it just seems to have been in use long before it was made official on
                    the coat of arms back in 1889. That tells you something. It wasn't handed down
                    from above, it came from the people first.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Turns out it's a decent word for how we work too. There's no single lucky campaign
              that fixes everything. It's more about showing up, trying stuff, tweaking what
              doesn't work, and sticking with it until it does. That's the whole game, really.
              Persevere.
            </p>
          </div>
        </div>

        {/* SectionDivider only has its own 1rem py-4, no outer margin - matching the
          mt-24 the heading below already carries gives equal breathing room on both
          sides of the wavy line instead of it sitting flush against the section above */}
        <div className="mt-24">
          <SectionDivider />
        </div>

        <Testimonials
          testimonials={TESTIMONIALS}
          heading={
            <>
              We could tell you we're great.
              <br />
              Or you could just ask them.
            </>
          }
        />

        <div className="mt-4">
          <SectionDivider reverse />
        </div>

        <h2 className="mt-24 text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
          So, what's it going to be?
        </h2>

        {/* type scaled up from the previous version, short lines can carry more weight
          and it makes each block land as a statement rather than a paragraph. the
          whole grim half floats in together (rather than line by line) so it reads
          as one block to take in, then its marks draw themselves on top of it -
          easier to digest than a slow staggered trickle */}
        <AnimatedContent
          direction="vertical"
          distance={32}
          duration={BLOCK_REVEAL_DURATION}
          ease="power3.out"
          threshold={0.2}
        >
          <div
            className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {BEFORE.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </AnimatedContent>

        {/* the hinge, deliberately given its own space and weight so the whole piece
          visibly turns here rather than the pivot getting lost mid-paragraph. stays
          mounted the whole time rather than appearing only once the grim half is
          done - inserting it into the DOM later would shift the good half down
          after its own ScrollTrigger already measured its position without it.
          instead its delay is set past both the grim block's own float-in AND
          its marks' draw-in time, so it can't appear before the block has shown
          up and been annotated, even in a worst case where both are eligible to
          fire in the same scroll tick */}
        <AnimatedContent
          direction="vertical"
          distance={28}
          duration={0.7}
          ease="power3.out"
          delay={BLOCK_REVEAL_DURATION + ANNOTATION_SETTLE}
        >
          <p className="mt-14 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-tight text-(--color-terracotta)">
            Or.
          </p>
        </AnimatedContent>

        {/* the good half, same "show the block, then annotate" treatment, delayed
          past the Or hinge's own reveal so it can't appear before that has */}
        <AnimatedContent
          direction="vertical"
          distance={32}
          duration={BLOCK_REVEAL_DURATION}
          ease="power3.out"
          delay={BLOCK_REVEAL_DURATION + ANNOTATION_SETTLE + 0.7}
        >
          <div
            className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {AFTER.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </AnimatedContent>

        {/* the payoff, scaled up to land as the closing beat */}
        <p className="mt-16 text-center text-[clamp(2rem,6vw,4rem)] font-black leading-none tracking-tighter text-(--color-oxblood)">
          {/* wider padding than the shared MARK_PROPS default (2px) so the circle
              sits further out from the letters instead of cutting across them */}
          <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={28}>
            Choose Persevere.
          </Highlighter>
        </p>

        <div className="mt-20">
          <YellowPulsatingButton onClick={() => setIsCalendlyOpen(true)}>
            Book a Call
          </YellowPulsatingButton>
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
