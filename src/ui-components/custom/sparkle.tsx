import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// small fixed constellation of sparkle positions/sizes/delays, rather than
// randomising on every render (which would make them jump around each time
// React re-renders while hovered, not just appear once and twinkle)
const SPARKLES = [
  { top: "-20%", left: "-20%", size: 10, delay: 0 },
  { top: "50%", left: "-25%", size: 7, delay: 0.1 },
  { top: "-10%", left: "38%", size: 8, delay: 0.18 },
  { top: "90%", left: "40%", size: 6, delay: 0.28 },
  { top: "8%", left: "95%", size: 9, delay: 0.08 },
  { top: "55%", left: "102%", size: 6, delay: 0.22 },
];

// idle (unhovered) sparkles fire on their own timer, one at a time, roughly
// once a second - a quiet twinkle rather than the full hover wave
const IDLE_MIN_DELAY_MS = 800;
const IDLE_MAX_DELAY_MS = 1400;

function Sparkle({
  top,
  left,
  size,
  delay,
  duration = 0.9,
  repeatDelay = 0.4,
  repeat = Infinity,
  fillOpacity = 1,
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration?: number;
  repeatDelay?: number;
  repeat?: number;
  fillOpacity?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="var(--color-amber-gold)"
      className="pointer-events-none absolute"
      style={{ top, left, width: size, height: size, fillOpacity }}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.1, 1, 0.6],
        rotate: [-20, 10, 0, 15],
      }}
      // exit needs its own transition, not the shared one below: that one has
      // repeat: Infinity, and since exit inherits the parent transition unless
      // overridden, the fade-out itself would loop forever and never finish -
      // which is why AnimatePresence never got to unmount these, leaving the
      // sparkles animating even after the hover had ended.
      exit={{ opacity: 0, scale: 0, transition: { duration: 0.2, ease: "easeOut" } }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        times: [0, 0.35, 0.7, 1],
        repeat,
        repeatDelay,
      }}
    >
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </motion.svg>
  );
}

export function SparkleHover({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const [idlePulse, setIdlePulse] = useState(0);
  const [idleSparkleIndex, setIdleSparkleIndex] = useState(0);

  // schedules a single, muted sparkle roughly once a second while nobody's
  // hovering, picking a random spot from the constellation each time -
  // a quiet twinkle rather than the full hover wave
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const wait = IDLE_MIN_DELAY_MS + Math.random() * (IDLE_MAX_DELAY_MS - IDLE_MIN_DELAY_MS);
      timeoutId = setTimeout(() => {
        setIdlePulse((n) => n + 1);
        setIdleSparkleIndex(Math.floor(Math.random() * SPARKLES.length));
        scheduleNext();
      }, wait);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className="relative inline-flex cursor-default items-center opacity-60 transition-opacity duration-300 hover:opacity-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <>
            {SPARKLES.map((sparkle, i) => (
              <Sparkle key={i} {...sparkle} />
            ))}
          </>
        )}
      </AnimatePresence>

      {!isHovered && idlePulse > 0 && (
        // key includes idlePulse so each tick remounts and replays from its
        // initial state instead of being a no-op on an already-settled node
        <Sparkle
          key={`idle-${idlePulse}`}
          {...SPARKLES[idleSparkleIndex]}
          delay={0}
          duration={0.45}
          repeatDelay={0.2}
          repeat={0}
          fillOpacity={0.5}
        />
      )}
    </div>
  );
}
