import { useRef, type ReactNode } from "react";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import { SectionHeading, BodyText } from "@/ui-components/custom/common-page-elements";
import { CylinderTextRotate } from "@/ui-components/primitive/cylinder-text-rotate";
import { getCylinderSizeCompensation } from "@/lib/cylinder-size-compensation";
import { ImageGallery } from "@/ui-components/primitive/image-gallery";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { ALWAYS_INCLUDED_HEADINGS } from "@/container-contents/services-shared";

// ---------------------------------------------------------------------------
// "By default, we provide you with" section
// ---------------------------------------------------------------------------

// Headings/icons are shared across both services pages (ALWAYS_INCLUDED_HEADINGS)
// so the guarantee reads identically everywhere; only the body copy for each is
// page-specific, passed in as `bodies` and paired with a heading by index.
export function AlwaysIncluded({ bodies }: { bodies: [ReactNode, ReactNode, ReactNode] }) {
  return (
    <div className="mt-20 flex w-full max-w-3xl flex-col items-center">
      <SectionHeading>By default, every service comes with</SectionHeading>

      <div className="mt-12 grid w-full gap-8 text-center sm:grid-cols-3">
        {ALWAYS_INCLUDED_HEADINGS.map((heading, i) => (
          <AnimatedContent key={i} distance={24} duration={0.7} delay={i * 0.1}>
            <div className="flex flex-col items-center gap-2">
              <span className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                <heading.icon size={18} />
              </span>
              <h3 className="font-subtitle text-[clamp(1.3rem,2.4vw,1.55rem)] font-black tracking-wide text-(--color-oxblood)">
                {heading.title}
              </h3>
              <BodyText>{bodies[i]}</BodyText>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}

// Real shoot photos, keyed by name (lowercase). Falls back to stand-in
// picsum placeholders for anyone whose photoshoot hasn't delivered yet.
const REAL_IMAGES: Record<string, { src: string; alt: string }[]> = {
  keir: [
    { src: "/photos/keir/1.jpeg", alt: "Keir smiling at a cafe table" },
    { src: "/photos/keir/2.jpeg", alt: "Keir behind the camera on a shoot" },
    { src: "/photos/keir/3.jpeg", alt: "Keir at a concert with the Chromakopia stage behind him" },
    { src: "/photos/keir/4.jpeg", alt: "Keir taking a selfie on a city street" },
  ],
  calum: [
    { src: "/photos/calum/3.jpeg", alt: "Calum filming on set with a cinema camera" },
    { src: "/photos/calum/1.jpeg", alt: "Calum out hiking with a backpack" },
    { src: "/photos/calum/2.jpeg", alt: "Calum with Arya the cat on his shoulder" },
    { src: "/photos/calum/4.jpeg", alt: "Calum editing footage on a laptop" },
  ],
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
          className="flex flex-row items-center justify-center gap-3 font-subtitle text-[clamp(2.4rem,6vw,4.2rem)] tracking-normal text-(--color-oxblood) sm:gap-4"
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
        <p className="max-w-sm text-[clamp(0.95rem,1.4vw,1rem)] leading-relaxed text-(--color-oxblood)/70">
          {note}
        </p>
      )}
    </div>
  );
}
