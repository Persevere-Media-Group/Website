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
