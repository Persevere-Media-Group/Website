import { useRef } from "react";
import AnimatedContent from "@/components/primitive/animated-content";
import { Highlighter } from "@/components/primitive/highlighter";
import { YellowPulsatingButton } from "@/components/custom/yellow-pulsating-button";
import { CylinderTextRotate } from "@/components/primitive/cylinder-text-rotate";
import { getCylinderSizeCompensation } from "@/lib/cylinder-size-compensation";
import { ImageGallery } from "@/components/primitive/image-gallery";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { UNDERLINE_COLOR, MARK_PROPS, ALWAYS_INCLUDED_HEADINGS } from "@/pages/services-shared";

// ---------------------------------------------------------------------------
// "By default, we provide you with" section
// ---------------------------------------------------------------------------

// Headings/icons are shared across both services pages (ALWAYS_INCLUDED_HEADINGS)
// so the guarantee reads identically everywhere; only the body copy for each is
// page-specific, passed in as `bodies` and paired with a heading by index.
export function AlwaysIncluded({ bodies }: { bodies: [string, string, string] }) {
  return (
    <div className="mt-20 flex w-full max-w-3xl flex-col items-center">
      <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
        By default, every service comes with
      </h2>

      <div className="mt-12 grid w-full gap-8 text-center sm:grid-cols-3">
        {ALWAYS_INCLUDED_HEADINGS.map((heading, i) => (
          <AnimatedContent
            key={i}
            direction="vertical"
            distance={24}
            duration={0.7}
            ease="power3.out"
            threshold={0.2}
            delay={i * 0.1}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                <heading.icon size={18} />
              </span>
              <h3 className="text-[clamp(1.1rem,2vw,1.3rem)] font-black tracking-tight text-(--color-oxblood)">
                {heading.title}
              </h3>
              <p
                className="text-[clamp(0.95rem,1.4vw,1rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {bodies[i]}
              </p>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Closing CTA ("We're your growth partner.")
// ---------------------------------------------------------------------------

export function ClosingCta({ onBookCall }: { onBookCall: () => void }) {
  // Sized deliberately larger than any viewport can hold at 1:1 (up to
  // 6.5rem), so it always wants to be as wide as its container; useAutoFitScale
  // then shrinks it down only as much as needed to avoid overflow, which is
  // what makes it span the full width on mobile while still scaling up on
  // wider screens instead of being pinned to a small fixed size.
  const markRef = useRef<HTMLParagraphElement>(null);
  const markScale = useAutoFitScale(markRef);

  return (
    <div className="mt-4 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
      <h2 className="font-pomelo-mono text-[clamp(2.25rem,5.5vw,3.25rem)] font-black leading-tight tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
        We are your growth partners.
      </h2>
      <p
        className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        We’re not here to ghost you after signing you on. We want to scale with you, keep improving
        with you, and never settle for "good enough."
      </p>
      <br />
      {/* same "payoff" treatment as the About page's closing beat: a big circled
          wordmark between the copy and the CTA button */}
      <div className="flex w-full items-center justify-center">
        <p
          ref={markRef}
          className="font-pomelo text-[clamp(2.75rem,16vw,6.5rem)] leading-none tracking-wide whitespace-nowrap text-(--color-oxblood)"
          style={{ transform: `scale(${markScale})`, transformOrigin: "center" }}
        >
          {/* the ellipse rough-notation draws for "circle" is sized from the text's
              bounding box plus padding, but a wide/short line like this one still
              has its corners poke outside a symmetric ellipse - extra horizontal
              padding relative to vertical is what actually keeps the far-left/right
              characters ("C", the trailing ".") safely inside the curve */}
          <Highlighter
            action="circle"
            color={UNDERLINE_COLOR}
            {...MARK_PROPS}
            padding={[20, 64, 20, 64]}
          >
            Choose Persevere.
          </Highlighter>
        </p>
      </div>
      <YellowPulsatingButton onClick={onBookCall} className="mt-12">
        Book a call
      </YellowPulsatingButton>
    </div>
  );
}

// Real shoot photos, keyed by name (lowercase). Falls back to stand-in
// picsum placeholders for anyone whose photoshoot hasn't delivered yet.
const REAL_IMAGES: Record<string, { src: string; alt: string }[]> = {
  keir: [{ src: "/photos/keir/DSC06936.jpeg", alt: "Keir smiling at a table" }],
};

function placeholderImages(name: string): { src: string; alt: string }[] {
  const real = REAL_IMAGES[name.toLowerCase()];
  if (real) return real;

  return Array.from({ length: 4 }, (_, i) => ({
    src: `https://picsum.photos/seed/${encodeURIComponent(name.toLowerCase())}-${i}/1200/900`,
    alt: `${name} placeholder photo ${i + 1}`,
  }));
}

// ---------------------------------------------------------------------------
// Intro banner ("Hi! I'm ___")
// ---------------------------------------------------------------------------

// Reads as "Hi I'm <name>. I'm <rotating keyword>". The name is fixed copy and the
// standout of the line; `words` holds only the rotating keywords, so it should not
// include the name itself.
export function IntroBanner({
  name,
  words,
  note,
}: {
  name: string;
  words: string[];
  note?: string;
}) {
  const wordRowRef = useRef<HTMLDivElement>(null);
  const wordRowScale = useAutoFitScale(wordRowRef, getCylinderSizeCompensation());

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 pb-16 text-center">
      {/* useAutoFitScale measures against the row's parent, so this wrapper is what
          defines the width the row is allowed to occupy. */}
      <div className="w-full">
        <div
          ref={wordRowRef}
          className="flex flex-row items-center justify-center gap-3 text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood) sm:gap-4"
          style={{ transform: `scale(${wordRowScale})`, transformOrigin: "center" }}
        >
          <span className="whitespace-nowrap">
            Hi I'm <span className="text-(--color-terracotta)">{name}</span>. I'm your
          </span>

          {/* CylinderTextRotate lays its words out absolutely, so it carries no width
              of its own. These invisible copies share the one grid cell and size the
              drum to the widest keyword, so the fixed half of the sentence never
              shifts as the drum spins. Same pattern as the home page hero. */}
          <div className="grid">
            {words.map((word) => (
              <span key={word} aria-hidden className="invisible whitespace-nowrap [grid-area:1/1]">
                {word}
              </span>
            ))}

            <div className="w-full [grid-area:1/1]">
              <CylinderTextRotate
                words={words}
                loop
                duration={1800}
                className="text-left text-(--color-oxblood)"
              />
            </div>
          </div>
        </div>
      </div>
      <ImageGallery images={placeholderImages(name)} className="mt-10 max-w-sm" />
      {note && (
        <p
          className="max-w-sm text-[clamp(0.95rem,1.4vw,1rem)] leading-relaxed text-(--color-oxblood)/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
