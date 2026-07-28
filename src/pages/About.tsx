import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import AnimatedContent from "@/components/primitive/animated-content";

// ---------------------------------------------------------------------------
// Highlight/underline config
// ---------------------------------------------------------------------------

// shared props so every mark behaves identically, sketchy hand-drawn feel that draws
// itself as it scrolls into view
const MARK_PROPS = {
  isView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

// terracotta underline for the grim half, reads like a red pen marking up what's wrong
const UNDERLINE_COLOR = "#d5573b";
// soft amber highlight for the good half, warm and positive rather than critical
const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

// the two halves of the business, one each, deliberately presented side by side so the
// "both under one roof" point is made visually before it's made in words
const ROLES = [
  {
    title: "Content & Organic",
    lead: "Led by Calum",
    body: "The stuff that makes people follow you, trust you, and remember you. Video, organic social, and influencer partnerships built around your brand, not pulled off a template.",
  },
  {
    title: "Paid & Performance",
    lead: "Led by Keir",
    body: "The engine that turns all that attention into sales. Paid social, Google and PPC, and conversion rate optimisation that squeezes more out of every click.",
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
  <>
    Choose
    <Highlighter action="box" color={UNDERLINE_COLOR} {...MARK_PROPS} triggerOnView={false}>
      "we're working on it."
    </Highlighter>
    Choose just a few more months.
  </>,
  <>
    Choose lining shareholders' pockets. Choose being a retainer,
    <Highlighter action="strike-through" color={UNDERLINE_COLOR} {...MARK_PROPS}>
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

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-32 sm:pt-20">
        <h1 className="mt-3 text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
          Two of us. Everything you need.
        </h1>

        {/* the two halves side by side on desktop, stacked on mobile */}
        <div className="mt-14 grid w-full max-w-3xl gap-8 text-left sm:grid-cols-2 sm:gap-10">
          {ROLES.map((role) => (
            <div key={role.title} className="flex flex-col gap-3">
              <h2 className="text-[clamp(1.35rem,2.6vw,1.75rem)] font-black tracking-tight text-(--color-oxblood)">
                {role.title}
              </h2>
              <p
                className="text-sm font-semibold uppercase tracking-[0.15em] text-(--color-terracotta)"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {role.lead}
              </p>
              <p
                className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {role.body}
              </p>
            </div>
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
              Keir and Calum met over four years ago in the corporate marketing world. Calum behind
              the camera as videographer and editor, Keir in front of it (and behind the strategy)
              for businesses all over the world.
            </p>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              For years we sharpened our craft on other people's payrolls, forever joking about what
              we could build if we pooled two skillsets that so rarely live under one roof. Then we
              actually moved in together, survived a year of flat-share life without falling out,
              and figured: if we can manage that, we can manage this.
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
              The name is Leith through and through. It's Leith's own word, its motto, and it's
              meant something to Keir across the near-six years he's called the area home. It's
              where he put down roots, and where he met his wife. (Calum, naturally, was the one on
              camera for the wedding.)
            </p>
            <p
              className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              It turns out to be a fitting word for a marketing partner, too. Growth is rarely one
              lucky hit. It's showing up, testing, adjusting, and keeping at it until the results
              start to build.
            </p>
          </div>
        </div>

        {/* divider into the monologue, gives the tonal shift somewhere to breathe */}
        <div className="mt-24 h-px w-full max-w-xs bg-(--color-oxblood)/15" />

        <h2 className="mt-24 text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
          So, what's it going to be?
        </h2>

        {/* type scaled up from the previous version, short lines can carry more weight
          and it makes each block land as a statement rather than a paragraph */}
        <div
          className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {BEFORE.map((line, i) => (
            <AnimatedContent
              key={i}
              direction="vertical"
              distance={28}
              duration={0.7}
              ease="power3.out"
              threshold={0.2}
              delay={i * 0.12}
            >
              <p>{line}</p>
            </AnimatedContent>
          ))}
        </div>

        {/* the hinge, deliberately given its own space and weight so the whole piece
          visibly turns here rather than the pivot getting lost mid-paragraph. stays
          mounted the whole time (like every other line here) rather than appearing
          only once the last "Choose..." line is done - inserting it into the DOM
          later would shift the AFTER list down after its ScrollTriggers already
          measured their positions without it, throwing off exactly where they fire.
          instead its delay is set past the last Choose line's own finish time
          (that line's delay + duration), so it can never start floating in before
          that line has, even in a worst case where both happen to scroll into view
          on the same frame */}
        <AnimatedContent
          direction="vertical"
          distance={28}
          duration={0.7}
          ease="power3.out"
          delay={(BEFORE.length - 1) * 0.12 + 0.7}
        >
          <p className="mt-14 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-tight text-(--color-terracotta)">
            Or.
          </p>
        </AnimatedContent>

        <div
          className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {AFTER.map((line, i) => (
            <AnimatedContent
              key={i}
              direction="vertical"
              distance={28}
              duration={0.7}
              ease="power3.out"
              threshold={0.2}
              delay={i * 0.12}
            >
              <p>{line}</p>
            </AnimatedContent>
          ))}
        </div>

        {/* the payoff, scaled up to land as the closing beat */}
        <p className="mt-16 text-center text-[clamp(2rem,6vw,4rem)] font-black leading-none tracking-tighter text-(--color-oxblood)">
          {/* wider padding than the shared MARK_PROPS default (2px) so the circle
              sits further out from the letters instead of cutting across them */}
          <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={28}>
            Choose Persevere.
          </Highlighter>
        </p>
      </div>
    </section>
  );
}
