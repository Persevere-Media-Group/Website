import type { ReactNode } from "react";
import { GrainWave } from "@/components/custom/grain-wave";

// ---------------------------------------------------------------------------
// Shared building blocks reused across every non-home page (About, Contact,
// Services (+ its Keir/Calum sub-pages), Blog, BlogPost, Case Studies,
// Privacy Policy). The home page has its own bespoke layout and isn't part
// of this pattern.
// ---------------------------------------------------------------------------

// The full-height ivory section every one of those pages opens with. It's
// deliberately unpadded: any padding here would push GrainWave (inside
// PageHero) down from the top of the page and stop it reaching the screen
// edges, so padding lives on the content wrapper below the hero instead.
// Contact doesn't use this - its content below the hero is a two-column
// grid rather than a centered column, so it keeps its own <section>.
export function PageSection({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      {children}
    </section>
  );
}

type PageHeroSize = "sm" | "md" | "lg";

// Full, statically-written class strings so Tailwind's scanner can find them
// (a template literal built from an interpolated clamp() value wouldn't be
// picked up at build time).
const HERO_TEXT_SIZE: Record<PageHeroSize, string> = {
  sm: "text-[clamp(3.25rem,7.5vw,5.5rem)]", // BlogPost, whose titles vary in length
  md: "text-[clamp(4rem,9vw,6.5rem)]", // Services, Privacy Policy
  lg: "text-[clamp(4.5rem,10vw,7.5rem)]", // About, Contact, Blog, Case Studies
};

interface PageHeroProps {
  children: ReactNode;
  size?: PageHeroSize;
}

// The GrainWave hero band + big font-heading title at the top of every
// non-home page. Place it as the first child inside PageSection (or
// Contact's own <section>).
export function PageHero({ children, size = "lg" }: PageHeroProps) {
  return (
    <GrainWave height="24rem">
      <h1
        className={`mt-3 font-heading ${HERO_TEXT_SIZE[size]} tracking-wide text-(--color-ivory)`}
      >
        {children}
      </h1>
    </GrainWave>
  );
}

type SectionHeadingSize = "sm" | "md" | "lg";

// Same reasoning as HERO_TEXT_SIZE above: static strings so Tailwind can see them.
const SECTION_HEADING_STYLE: Record<SectionHeadingSize, string> = {
  sm: "text-[clamp(1.85rem,4.2vw,2.75rem)] sm:whitespace-nowrap", // ServicePage's MyRole
  md: "text-[clamp(2.1rem,4.8vw,3rem)] sm:whitespace-nowrap", // ServicePage's other sections, AlwaysIncluded
  lg: "text-[clamp(2rem,5vw,3.5rem)]", // About, Privacy Policy, Placeholder
};

interface SectionHeadingProps {
  children: ReactNode;
  size?: SectionHeadingSize;
  className?: string;
}

// A centered font-subtitle heading used to introduce a section of page
// content (as opposed to PageHero's h1, which introduces the whole page).
export function SectionHeading({ children, size = "md", className = "" }: SectionHeadingProps) {
  return (
    <h2
      className={`font-subtitle text-center font-black tracking-wide text-(--color-oxblood) ${SECTION_HEADING_STYLE[size]} ${className}`}
    >
      {children}
    </h2>
  );
}

// Standard "this page isn't built yet" body, used below the PageHero on
// pages that don't have real content yet.
export function Placeholder() {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 pt-16 pb-24 text-center sm:pt-20">
      <SectionHeading size="lg">Placeholder</SectionHeading>
      <p className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
        Real content goes here once it's ready.
      </p>
    </div>
  );
}
