import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Grainient } from "@/components/primitive/grainient";
import { SectionWave } from "@/components/primitive/section-wave";

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
  /** whether to render the bottom wave, cutting down into `fillColor`. Default true,
   * matching every existing use of this component as a page-top header band. Turn
   * off when the gradient itself should run flush to whatever comes after it (e.g.
   * the footer) instead of being capped by a curve. */
  waveBottom?: boolean;
  /** whether to render a mirrored wave at the top, cutting UP from `topFillColor` into
   * the gradient - the inverse of the usual bottom wave, for bands placed mid-page
   * that need to transition in from the section above rather than just starting flat. */
  waveTop?: boolean;
  /** the colour the top wave cuts up from, should match whatever section precedes this
   * one. Defaults to `fillColor` since in practice both are usually ivory. */
  topFillColor?: string;
  /** optional content to sit on top of the gradient, e.g. a page title */
  children?: ReactNode;
  className?: string;
  /** shows the site logo pinned top-left of the band, linking home. Only pass this on
   * the `GrainWave` instance that acts as a page's actual top header — not on
   * mid-page decorative uses of this same component. */
  logo?: boolean;
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
  waveBottom = true,
  waveTop = false,
  topFillColor,
  children,
  className,
  logo = false,
}: GrainWaveProps) {
  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden bg-(--color-terracotta) ${className ?? ""}`}
      style={{ minHeight: height }}
    >
      {logo && (
        <Link to="/" aria-label="Go to home page" className="absolute top-4 left-4 z-[60]">
          <img
            src="/logos/persevere-logo.png"
            alt="Persevere Media"
            className="h-10 w-auto sm:h-11"
            draggable={false}
          />
        </Link>
      )}

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

      {/* optional content sits above the gradient but below the waves, padded so it
          doesn't collide with whichever curves are actually enabled */}
      {children && (
        <div
          className={`relative z-10 w-full px-4 text-center ${waveTop ? "pt-24 sm:pt-28 md:pt-32" : "pt-20"} ${waveBottom ? "pb-24 sm:pb-28 md:pb-32" : "pb-16"}`}
        >
          {children}
        </div>
      )}

      {/* solid curve capping the top, mirrored so it reads as cutting UP from the
          previous section into the gradient rather than down out of it */}
      {waveTop && (
        <SectionWave
          fillColor={topFillColor ?? fillColor}
          flip
          className={`z-20 ${waveClassName}`}
        />
      )}

      {/* solid curve capping the bottom, sits above the animated layers so it reads as
          a clean edge rather than picking up the grain underneath it */}
      {waveBottom && <SectionWave fillColor={fillColor} className={`z-20 ${waveClassName}`} />}
    </div>
  );
}
