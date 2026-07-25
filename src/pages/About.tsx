import { Highlighter } from "@/components/ui/highlighter";

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

// pared right back: short, staccato, repetitive. the power in the trainspotting
// monologue is the hammering rhythm, not the detail, anything that needs a comma to
// hold it together has been cut or split. marks stay sparing, three per half.
const BEFORE = [
  <>
    Choose the wrong agency. Choose{" "}
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      Stockholm syndrome
    </Highlighter>
    .
  </>,
  <>Choose “we're working on it.” Choose just a few more months.</>,
  <>Choose lining shareholders' pockets. Choose being a retainer, not a client.</>,
  <>
    Choose a manager who gets paid either way. Profit or loss.{" "}
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
      They don't care.
    </Highlighter>
  </>,
  <>
    Choose paying for humans. Choose receiving{" "}
    <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
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

export function About() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory) px-4 pt-32 pb-32 sm:pt-40">
      <p
        className="text-[clamp(0.75rem,1.6vw,0.95rem)] font-semibold uppercase tracking-[0.2em] text-(--color-oxblood)/60"
        style={{ fontFamily: "var(--font-body)" }}
      >
        About
      </p>
      <h1 className="mt-3 text-center text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
        So, what's it going to be?
      </h1>

      {/* type scaled up from the previous version, short lines can carry more weight
          and it makes each block land as a statement rather than a paragraph */}
      <div
        className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {BEFORE.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* the hinge, deliberately given its own space and weight so the whole piece
          visibly turns here rather than the pivot getting lost mid-paragraph */}
      <p className="mt-14 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-tight text-(--color-terracotta)">
        Or.
      </p>

      <div
        className="mt-14 flex w-full max-w-xl flex-col gap-5 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug text-(--color-oxblood)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {AFTER.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* the payoff, scaled up to land as the closing beat */}
      <p className="mt-16 text-center text-[clamp(2rem,6vw,4rem)] font-black leading-none tracking-tighter text-(--color-oxblood)">
        Choose Persevere.
      </p>
    </section>
  );
}
