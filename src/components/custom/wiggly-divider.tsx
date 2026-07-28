import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

// a thin decorative pen-stroke break between two ivory sections. deliberately NOT
// built from SectionWave, that component is a solid FILLED shape meant to cap a full
// section, squeezing it into a short container just clips most of the fill away and
// leaves a thick flat-bottomed band rather than a line. this is a genuine stroked path,
// no fill, so it reads as a single wavy line rather than a solid block.
// the same wave unit (C120,5 240,75 360,40, a 360-wide period) repeated twice
// back to back, so the two halves of this 2880-wide path tile seamlessly.
// paired with the "section-wave-roll" keyframes (0% -> -50% translateX, the
// same trick SectionWave uses for the ivory wave up top), that lets the line
// scroll sideways forever without ever showing a seam, rather than morphing
// or inverting in place
const DIVIDER_PATH =
  "M0,40 C120,5 240,75 360,40 C480,5 600,75 720,40 C840,5 960,75 1080,40 C1200,5 1320,75 1440,40 C1560,5 1680,75 1800,40 C1920,5 2040,75 2160,40 C2280,5 2400,75 2520,40 C2640,5 2760,75 2880,40";

// the exact same curve, traced from the opposite end (each segment's control
// points swapped, points visited high-x to low-x). the roll animation only
// ever transforms the whole <svg>, so it doesn't care which way the path is
// wound, but the pathLength draw-in always grows from this string's first
// point toward its last, so this is what lets the draw start on whichever
// side the wave is about to scroll away from
const DIVIDER_PATH_REVERSED =
  "M2880,40 C2760,75 2640,5 2520,40 C2400,75 2280,5 2160,40 C2040,75 1920,5 1800,40 C1680,75 1560,5 1440,40 C1320,75 1200,5 1080,40 C960,75 840,5 720,40 C600,75 480,5 360,40 C240,75 120,5 0,40";

export function SectionDivider({ reverse = false }: { reverse?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  // same trigger pattern as Highlighter: animate once, slightly before it's
  // fully on screen, rather than replaying every time it scrolls into view
  const isInView = useInView(svgRef, { once: true, margin: "-10%" });
  const [hasDrawn, setHasDrawn] = useState(false);

  return (
    <div className="flex w-full items-center justify-center bg-(--color-ivory) py-4">
      <div className="h-14 w-full max-w-5xl overflow-hidden px-4">
        <svg
          ref={svgRef}
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
          className="block h-full"
          style={{
            width: "200%",
            animation: hasDrawn
              ? `section-wave-roll 16s linear infinite${reverse ? " reverse" : ""}`
              : undefined,
          }}
          aria-hidden
        >
          <motion.path
            // section-wave-roll (no reverse) shifts the SVG left over time, so
            // features travel right-to-left, meaning the draw-in should start
            // from the right too, hence the reversed-order path; "reverse" plays
            // that same animation backward (features travel left-to-right), so
            // it draws in from the ordinary left-to-right path instead
            d={reverse ? DIVIDER_PATH : DIVIDER_PATH_REVERSED}
            fill="none"
            stroke="var(--color-terracotta)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            onAnimationComplete={() => setHasDrawn(true)}
          />
        </svg>
      </div>
    </div>
  );
}
