import type { ReactNode } from "react";
import { GrainWave } from "@/components/custom/grain-wave";

// ---------------------------------------------------------------------------
// Shared building blocks reused across every non-home page (About, Contact,
// Services, Blog, BlogPost, Case Studies, Privacy Policy). The home page has
// its own bespoke hero and isn't part of this pattern.
// ---------------------------------------------------------------------------

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
// non-home page. Place it as the first child inside the page's own
// <section>; leave that section un-padded so GrainWave reaches the screen
// edges, and put padding on the content wrapper below it instead.
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

// Standard "this page isn't built yet" body, used below the PageHero on
// pages that don't have real content yet.
export function Placeholder() {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 pt-16 pb-24 text-center sm:pt-20">
      <h2 className="font-subtitle text-[clamp(2rem,5vw,3.5rem)] font-black tracking-wide text-(--color-oxblood)">
        Placeholder
      </h2>
      <p className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
        Real content goes here once it's ready.
      </p>
    </div>
  );
}
