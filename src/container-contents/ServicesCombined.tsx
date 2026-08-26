import { useRef, type ReactNode } from "react";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import { SectionHeading, BodyText } from "@/ui-components/custom/common-page-elements";
import { CylinderTextRotate } from "@/ui-components/primitive/cylinder-text-rotate";
import { getCylinderSizeCompensation } from "@/lib/cylinder-size-compensation";
import { GalleryThumbnails, GalleryPreview } from "@/ui-components/primitive/image-gallery";
import { useImageGallery, type GalleryImage } from "@/hooks/use-image-gallery";
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
// The preview crops every photo to fill the (portrait) frame, so `focalPoint`
// pins each one to wherever the person actually is in the shot rather than
// the image's geometric center - most of these are landscape or off-center
// portraits that the frame's crop would otherwise cut across their face.
const REAL_IMAGES: Record<string, GalleryImage[]> = {
  keir: [
    { src: "/photos/keir/1.jpeg", alt: "Keir smiling at a cafe table", focalPoint: "center 55%" },
    {
      src: "/photos/keir/2.jpeg",
      alt: "Keir behind the camera on a shoot",
      focalPoint: "33% 35%",
    },
    {
      src: "/photos/keir/3.jpeg",
      alt: "Keir at a concert with the Chromakopia stage behind him",
      focalPoint: "28% 55%",
    },
    {
      src: "/photos/keir/4.jpeg",
      alt: "Keir taking a selfie on a city street",
      focalPoint: "40% 45%",
    },
  ],
  calum: [
    {
      src: "/photos/calum/3.jpeg",
      alt: "Calum filming on set with a cinema camera",
      focalPoint: "68% 42%",
    },
    { src: "/photos/calum/1.jpeg", alt: "Calum out hiking with a backpack", focalPoint: "38% 50%" },
    {
      src: "/photos/calum/2.jpeg",
      alt: "Calum with Arya the cat on his shoulder",
      focalPoint: "50% 38%",
    },
    {
      src: "/photos/calum/4.jpeg",
      alt: "Calum editing footage on a laptop",
      focalPoint: "58% 38%",
    },
  ],
};

function placeholderImages(name: string): GalleryImage[] {
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
  const gallery = useImageGallery({ images: placeholderImages(name), maxPreviewHeight: "28rem" });

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8 pb-16 text-center">
      {/* useAutoFitScale measures against the row's parent, so this wrapper is what
          defines the width the row is allowed to occupy. It's matched to the outer
          container (rather than a narrower cap) because the grid below leans on
          that fixed width: the "Hi I'm ___" column is 1fr, so it always stretches
          to fill whatever's left of that width, and right-aligning its text against
          that edge is what lands the rotating word's start flush with the photo's
          right edge further down - no visible gap to fake it with. */}
      <div className="w-full max-w-4xl">
        <div
          ref={wordRowRef}
          className="grid grid-cols-[1fr_auto] items-center gap-3 font-subtitle text-[clamp(2.4rem,6vw,4.2rem)] tracking-normal text-(--color-oxblood) sm:gap-4"
          style={{ transform: `scale(${wordRowScale})`, transformOrigin: "center" }}
        >
          <span className="whitespace-nowrap text-right">
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

      {/* The preview frame is a fixed height (image-gallery.tsx sizes it to the
          tallest photo in the carousel), so this row - and the thumbnails/note
          beside it - never reflow as the active photo changes. Thumbnails sit
          above the note rather than above the preview so the section's height
          is just the preview's, not preview-plus-thumbnails stacked; the note
          column is kept narrow so the (larger) preview reads as closer to page
          center, with the slim text column balancing it on the other side. */}
      <div className="mt-10 flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-6">
        <GalleryPreview gallery={gallery} className="w-full max-w-sm shrink-0" />
        <div className="flex w-full max-w-sm flex-col items-center gap-4 md:w-64 md:max-w-64 md:items-start md:text-left">
          <GalleryThumbnails gallery={gallery} className="w-full" />
          {note && (
            <p className="text-[clamp(0.95rem,1.4vw,1rem)] leading-relaxed text-(--color-oxblood)/70">
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
