import { ChevronRight } from "lucide-react";
import { Highlighter } from "@/ui-components/primitive/highlighter";
import { ChoosePersevereMark } from "@/ui-components/custom/choose-persevere-mark";
import { SectionHeading, BodyText } from "@/ui-components/custom/common-page-elements";
import { LinkCard } from "@/ui-components/custom/link-card";
import AnimatedContent from "@/ui-components/primitive/animated-content";
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
import { MARK_PROPS, UNDERLINE_COLOR, HIGHLIGHT_COLOR } from "@/lib/text-marks";

// how long each "half" (grim, or, good) takes to float in as one block. Each one is
// its own independent ScrollTrigger keyed to its own position on the page, not a
// shared clock - so these are no longer chained into one another as offsets. The
// grim block, the "Or", and the good block each just reveal themselves the moment
// they're scrolled to, in that order, since that's also their order in the DOM. This
// keeps things snappy on a fast scroll instead of leaving Choose Persevere sitting in
// a blank page while a stale multi-second delay from an earlier block finishes.
const BLOCK_REVEAL_DURATION = 0.6;

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
    title: "Creative",
    detail:
      "The stuff that makes people follow you, trust you, and remember you. Video, organic social and performance creative built around your brand.",
    to: "/creative",
    linkLabel: "Learn more",
  },
  {
    title: "Ads",
    detail:
      "The stuff that makes people click, convert, and buy. Paid ads, designed intentionally to drive results and scale your business.",
    to: "/ads",
    linkLabel: "Learn more",
  },
];

export function RolesSection() {
  return (
    <>
      <SectionHeading size="lg" className="mt-3">
        Two of us. Everything you need.
      </SectionHeading>

      {/* the two halves side by side on desktop, stacked on mobile - same card
        treatment as the Our Services section on the homepage */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-8 text-left sm:grid-cols-2">
        {ROLES.map((role, i) => (
          <LinkCard
            key={role.title}
            to={role.to}
            heading={role.title}
            headingClassName="font-heading text-[clamp(2.1rem,4vw,2.6rem)] tracking-wide text-(--color-oxblood)"
            body={role.detail}
            linkLabel={role.linkLabel}
            delay={i * 0.1}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Origin story
// ---------------------------------------------------------------------------

export function OriginStorySection() {
  return (
    <div className="mt-20 flex w-full max-w-2xl flex-col gap-14 text-justify">
      <div className="flex flex-col gap-4">
        <h2 className="font-subtitle text-[clamp(1.5rem,3vw,2rem)] font-black tracking-wide text-(--color-oxblood)">
          How it started
        </h2>
        <BodyText>
          Keir and Calum met over four years ago in the corporate marketing world.{" "}
          <strong className="font-bold text-(--color-oxblood)">
            Calum behind the camera as videographer and editor, Keir in front of it
          </strong>{" "}
          (and behind the strategy) for businesses all over the world.
        </BodyText>
        <BodyText>
          For years we earned our stripes working in-house and in agencies, often joking about what
          we could build if we pooled two skillsets that rarely exist under one roof. Then we
          actually moved in together, survived a year of flat-share life without falling out, and
          figured:{" "}
          <strong className="font-bold text-(--color-oxblood)">
            if we can manage that, we can manage this.
          </strong>
        </BodyText>
        <p className="font-subtitle text-[clamp(1.3rem,2.2vw,1.4rem)] font-black tracking-wide text-(--color-oxblood)">
          So we did. Persevere was born.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-subtitle text-[clamp(1.5rem,3vw,2rem)] font-black tracking-wide text-(--color-oxblood)">
          Why “Persevere”?
        </h2>
        <BodyText>
          You'll spot it on architecture, the iconic coat of arms and in street art. It's meant
          something to Keir over the years he's called the area home. It's where he put down roots,
          and where he met his wife. Calum, naturally, was the one on camera duty for the wedding.
        </BodyText>
        <Accordion transition={SPRING_TRANSITION} variants={SPRING_SCALE_VARIANTS}>
          <AccordionItem value="history">
            <AccordionTrigger className="w-full py-0.5 text-left">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 shrink-0 text-(--color-terracotta) transition-transform duration-200 group-data-expanded:rotate-90" />
                <span className="ml-3 text-[clamp(1.2rem,1.6vw,1.1rem)] tracking-wide font-subtitle font-bold text-(--color-oxblood)">
                  Want a quick history lesson?
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="origin-top">
              <BodyText className="pt-3 pl-8">
                The word "Persevere" itself goes back further than most people realise. Leith was
                its own burgh for centuries, a proper port town in its own right. Trading,
                shipbuilding, always a bit separate from Edinburgh next door even after the two got
                merged in 1920. It was never an easy place. Leith took some real knocks over the
                years; poverty, overcrowding, the docks declining... but it kept rebuilding itself
                every time. Nobody's entirely sure when "Persevere" first got adopted as the motto,
                it just seems to have been in use long before it was made official on the coat of
                arms back in 1889.
              </BodyText>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <BodyText>
          Turns out it's a decent word for how we work too. There's (sadly) no silver bullet
          campaign that makes you millionaire, no clever hack that skips the grind. It's about
          showing up, testing, learning, adjusting... and sticking with it until the results start
          to build. We Persevere.
        </BodyText>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Choose Persevere (Trainspotting monologue)
// ---------------------------------------------------------------------------

// marks stay sparing, three per half - drawn onto the block after it lands rather
// than trickling in line by line.
const BEFORE = [
  <>
    Choose poor performing marketing campaigns. Sticking with the wrong agency, feeling
    like you've got{" "}
    <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      Stockholm syndrome
    </Highlighter>
    .
  </>,
  <>Choose being forgettable. Choose getting lost in the crowd.</>,
  <>
    Choose not fulfilling your business's potential and not reaching the heights that
    you know you can.
  </>,
  <>
    Choose lining the pockets of shareholders who don't care about anything other than{" "}
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      how big your retainer is
    </Highlighter>
    .
  </>,
  <>
    Choose paying for people, but receiving{" "}
    <Highlighter action="box" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      AI slop
    </Highlighter>
    , getting your reports and strategy from an AI agent, because "AI is the future."
  </>,
  <>Choose a lack of direction, mediocrity, the sunk cost fallacy.</>,
  <>
    Choose wishing you did it all differently, choose wondering what you're actually
    paying for.
  </>,
];

const AFTER = [
  <>Choose making it right. Choose not getting burned again.</>,
  <>
    Choose working with{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      actual people
    </Highlighter>
    , who just care about doing good work and getting you real results.
  </>,
  <>
    Choose bespoke strategies, informed by{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      years of experience and expertise
    </Highlighter>
    .
  </>,
  <>Choose not having to decide between an ads agency and a creative team.</>,
  <>
    Choose getting{" "}
    <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
      the best of both worlds
    </Highlighter>
    .
  </>,
  <>
    Choose a team who are sick of seeing people taken for a ride, who want to help a
    business just like yours.
  </>,
  <>Choose a brighter future.</>,
];

export function ChooseSection() {
  return (
    <>
      <SectionHeading size="lg" className="mt-24">
        So, what's it going to be?
      </SectionHeading>

      {/* type scaled up from the previous version, short lines can carry more weight
        and it makes each block land as a statement rather than a paragraph. the
        whole grim half floats in together (rather than line by line) so it reads
        as one block to take in, then its marks draw themselves on top of it -
        easier to digest than a slow staggered trickle */}
      <AnimatedContent distance={32} duration={BLOCK_REVEAL_DURATION}>
        <div className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)/80">
          {BEFORE.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </AnimatedContent>

      {/* the hinge, deliberately given its own space and weight so the whole piece
        visibly turns here rather than the pivot getting lost mid-paragraph. it's
        its own ScrollTrigger, keyed to its own position in the page, so it floats
        in on its own the moment it's scrolled to - it can't appear before the grim
        block since it sits below it in the DOM and can't be scrolled to first */}
      <AnimatedContent distance={28} duration={0.6}>
        <p className="mt-14 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-tight text-(--color-terracotta)">
          Or.
        </p>
      </AnimatedContent>

      {/* the good half, same "show the block, then annotate" treatment as the grim
        half - its own ScrollTrigger fires only once scrolled to, which is always
        after the Or hinge above it has already fired */}
      <AnimatedContent distance={32} duration={BLOCK_REVEAL_DURATION}>
        <div className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)">
          {AFTER.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </AnimatedContent>

      {/* the payoff, scaled up to land as the closing beat - same size as the
          homepage footer's version of this mark */}
      <div className="mt-16 flex w-full items-center justify-center">
        <ChoosePersevereMark />
      </div>
    </>
  );
}
