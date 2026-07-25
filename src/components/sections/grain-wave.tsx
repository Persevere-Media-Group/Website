import type { ReactNode } from "react";
import { Grainient } from "@/components/ui/grainient";
import { SectionWave } from "@/components/ui/section-wave";

interface GrainWaveProps {
  /**
   * Any CSS length, e.g. "18rem", "40vh", "300px". Applied as a MIN height, so if you
   * pass children that need more room than this, the band grows rather than clipping
   * them (same reasoning as the hero, fixed heights cause content to get cut off on
   * short screens).
   */
  height?: string;
  /** brand gradient stops, defaults to the same three used in the hero */
  colors?: string[];
  /** how fast the gradient drifts */
  speed?: number;
  /** grain texture strength */
  noiseIntensity?: number;
  /** the colour the wave cuts down to, should match whatever section follows this one */
  fillColor?: string;
  /** wave height, responsive by default and matching the hero's */
  waveClassName?: string;
  /** optional content to sit on top of the gradient, e.g. a page title */
  children?: ReactNode;
  className?: string;
}

/**
 * The animated grain gradient band with the ivory wave cutting across the bottom,
 * pulled out of HeroSection so it can be reused as a decorative header on any page.
 * Always full width, height is customisable via the `height` prop.
 */
export function GrainWave({
  height = "18rem",
  colors = ["--color-deep-plum", "--color-terracotta", "--color-amber-gold"],
  speed = 7,
  noiseIntensity = 1.5,
  fillColor = "--color-ivory",
  waveClassName = "h-20 sm:h-28 md:h-36",
  children,
  className,
}: GrainWaveProps) {
  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden bg-(--color-terracotta) ${className ?? ""}`}
      style={{ minHeight: height }}
    >
      {/* absolute so it fills whatever height the band ends up being, purely
          decorative, never affects layout */}
      <Grainient
        colors={colors}
        speed={speed}
        scale={1}
        noiseIntensity={noiseIntensity}
        rotation={0}
        className="absolute inset-0"
      />

      {/* optional content sits above the gradient but below the wave, padded so it
          doesn't collide with the curve at the bottom */}
      {children && (
        <div className="relative z-10 w-full px-4 pb-24 pt-20 text-center sm:pb-28 md:pb-32">
          {children}
        </div>
      )}

      {/* solid curve capping the bottom, sits above the animated layers so it reads as
          a clean edge rather than picking up the grain underneath it */}
      <SectionWave fillColor={fillColor} className={`z-20 ${waveClassName}`} />
    </div>
  );
}
