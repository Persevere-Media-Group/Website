import { useState } from "react";
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

function Sparkle({
  top,
  left,
  size,
  delay,
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="var(--color-amber-gold)"
      className="pointer-events-none absolute"
      style={{ top, left, width: size, height: size }}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.1, 1, 0.6],
        rotate: [-20, 10, 0, 15],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: 0.9,
        delay,
        ease: "easeOut",
        times: [0, 0.35, 0.7, 1],
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    >
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </motion.svg>
  );
}

export function SparkleHover({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

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
    </div>
  );
}
