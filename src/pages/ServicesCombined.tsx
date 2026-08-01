import { useRef } from "react";
import AnimatedContent from "@/components/primitive/animated-content";
import { Highlighter } from "@/components/primitive/highlighter";
import { YellowPulsatingButton } from "@/components/custom/yellow-pulsating-button";
import { CylinderTextRotate } from "@/components/primitive/cylinder-text-rotate";
import { ImageGallery } from "@/components/primitive/image-gallery";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { UNDERLINE_COLOR, MARK_PROPS, type AlwaysIncludedItem } from "@/pages/services-shared";

// ---------------------------------------------------------------------------
// "By default, we provide you with" section
// ---------------------------------------------------------------------------

export function AlwaysIncluded({ items }: { items: AlwaysIncludedItem[] }) {
  return (
    <div className="mt-20 flex w-full max-w-3xl flex-col items-center">
      <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
        By default, every service comes with
      </h2>

      <div className="mt-12 grid w-full gap-8 text-center sm:grid-cols-3">
        {items.map((item, i) => (
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
                <item.icon size={18} />
              </span>
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
  );
}

// ---------------------------------------------------------------------------
// Closing CTA ("We're your growth partner.")
// ---------------------------------------------------------------------------

export function ClosingCta({ onBookCall }: { onBookCall: () => void }) {
  return (
    <div className="mt-4 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
      <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-black leading-tight tracking-tight text-(--color-oxblood) sm:whitespace-nowrap">
        We're your growth partner.
      </h2>
      <p
        className="text-[clamp(1rem,1.6vw,1.1rem)] leading-relaxed text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Not a quick campaign and a runaway. We scale with you, keep improving with you, and never
        settle for{" "}
        <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={10}>
          "good enough."
        </Highlighter>
      </p>
      <br />
      <YellowPulsatingButton onClick={onBookCall}>Book a free discovery call</YellowPulsatingButton>
    </div>
  );
}

// Stand-in shoot images until Calum and Keir's photoshoot delivers real
// content. Seeded per person so each intro banner gets a stable, distinct
// set of placeholders rather than reshuffling on every reload.
function placeholderImages(name: string): { src: string; alt: string }[] {
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
  const wordRowScale = useAutoFitScale(wordRowRef);

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
