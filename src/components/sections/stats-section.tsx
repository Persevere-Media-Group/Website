import AnimatedContent from "@/components/ui/AnimatedContent";
import { Highlighter } from "@/components/ui/highlighter";

// placeholder copy, swap each of these once the real service summary text is ready.
// each body has two tiers of emphasis: one highlighted phrase (the concrete proof/stat,
// amber-gold) and one underlined phrase (a secondary but still important idea, terracotta),
// so the two treatments read as genuinely different weights, not the same effect twice
const BLOCKS = [
  {
    heading: "Proven industry experience.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          isView
          animationDuration={1000}
          iterations={2}
        >
          £20m+ in ad spend, 50+ brands
        </Highlighter>
        , thousands of hours in the edit. The attitude{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          isView
          animationDuration={1000}
          iterations={2}
        >
          comes with a track record
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
          color="rgba(237, 176, 62, 0.3)"
          isView
          animationDuration={1000}
          iterations={2}
        >
          Content and paid ads
        </Highlighter>
        , under one roof. No more choosing between a creative team and an{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          isView
          animationDuration={1000}
          iterations={2}
        >
          ads agency
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
          color="rgba(237, 176, 62, 0.3)"
          isView
          animationDuration={1000}
          iterations={2}
        >
          Keir and Calum
        </Highlighter>
        . The two{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          isView
          animationDuration={1000}
          iterations={2}
        >
          actually doing the work
        </Highlighter>
        . No account managers, no shareholders skimming the top.
      </>
    ),
  },
];

export function StatsSection() {
  return (
    <section className="flex flex-col items-center gap-16 bg-(--color-ivory) px-4 pt-24 pb-60 text-center">
      {BLOCKS.map((block, i) => (
        <AnimatedContent
          key={block.heading}
          direction="vertical"
          distance={50}
          duration={0.8}
          ease="power3.out"
          threshold={0.2}
          delay={i * 0.15}
        >
          <div className="max-w-xl">
            <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
              {block.heading}
            </h3>
            <p
              className="mt-3 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {block.body}
            </p>
          </div>
        </AnimatedContent>
      ))}
    </section>
  );
}
