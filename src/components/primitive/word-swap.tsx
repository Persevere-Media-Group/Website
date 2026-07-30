import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export function FlipWords({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentWord = words[index];

  const startAnimation = useCallback(() => {
    setIndex((i) => (i + 1) % words.length);
    setIsAnimating(true);
  }, [words.length]);

  useEffect(() => {
    if (isAnimating || words.length < 2) return;
    const timeout = setTimeout(startAnimation, duration);
    return () => clearTimeout(timeout);
  }, [isAnimating, duration, startAnimation, words.length]);

  return (
    <span className={cn("relative inline-block align-baseline text-center", className)}>
      {/* Invisible stack, sized to the widest word, so surrounding text never
          shifts when the visible word below changes width. */}
      <span className="invisible inline-grid" aria-hidden="true">
        {words.map((word) => (
          <span key={word} className="col-start-1 row-start-1 px-2 whitespace-nowrap">
            {word}
          </span>
        ))}
      </span>

      <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.8 }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: 2,
            transition: { type: "spring", stiffness: 200, damping: 20, duration: 0.4 },
          }}
          className="absolute inset-0 px-2 whitespace-nowrap"
          key={currentWord}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.4,
                type: "spring",
                stiffness: 120,
                damping: 12,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={word + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 140,
                    damping: 14,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
