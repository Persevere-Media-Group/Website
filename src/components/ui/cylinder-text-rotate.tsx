"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CylinderTextRotateProps {
  words: string[];
  duration?: number;
  // if false, stops once it reaches the last word in the list; if true, spins forever without ever snapping back
  loop?: boolean;
  className?: string;
  segmentAngle?: number;
  neighbourOpacity?: number;
  highlightWord?: string;
  highlightClassName?: string;
  // how long the drum pauses on highlightWord specifically, instead of the normal duration
  highlightDuration?: number;
}

export function CylinderTextRotate({
  words,
  duration = 900,
  loop = false,
  className,
  segmentAngle = 30,
  neighbourOpacity = 0.4,
  highlightWord,
  highlightClassName,
  highlightDuration = 2200,
}: CylinderTextRotateProps) {
  // counts every step the drum has ever taken and never resets, this is what keeps the spin
  // moving in one direction forever instead of snapping backwards to restart the list
  const [spinCount, setSpinCount] = useState(0);

  // wraps a raw offset back into a valid word index, handling negative numbers safely too
  const getWordAtOffset = (offset: number) =>
    words[(((spinCount + offset) % words.length) + words.length) % words.length];

  useEffect(() => {
    // once we've reached the real last word and looping is switched off, just stop here
    if (!loop && spinCount === words.length - 1) {
      return;
    }

    // the word currently centred decides how long we wait before advancing again,
    // this is what lets the drum linger specifically on the highlighted word
    const currentWord = getWordAtOffset(0);
    const isCurrentlyHighlighted = highlightWord !== undefined && currentWord === highlightWord;
    const delayBeforeNextStep = isCurrentlyHighlighted ? highlightDuration : duration;

    const advanceTimer = setTimeout(() => {
      setSpinCount((count) => (loop ? count + 1 : Math.min(count + 1, words.length - 1)));
    }, delayBeforeNextStep);

    return () => clearTimeout(advanceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, duration, highlightDuration, loop, spinCount, highlightWord]);

  const segmentAngleRadians = (segmentAngle * Math.PI) / 180;
  const drumRadiusEm = 0.5 / Math.tan(segmentAngleRadians / 2);
  const perspectiveEm = drumRadiusEm * 6;
  const sizeCompensationScale = (perspectiveEm + drumRadiusEm) / perspectiveEm;

  // only the previous, current, and next word ever need to be on screen at once,
  // their content is picked with modulo so the same three slots keep recycling forever
  const visibleOffsets = [-1, 0, 1];

  return (
    <div
      className={`relative overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] ${className ?? ""}`}
      style={{
        height: "2.2em",
        perspective: `${perspectiveEm}em`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", scale: sizeCompensationScale }}
        // this target keeps growing every single step, forever, so the drum only ever
        // spins forward, it never has to jump back to loop the word list around
        animate={{ rotateX: -(spinCount + 1) * segmentAngle }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {visibleOffsets.map((offset) => {
          const word = getWordAtOffset(offset);
          const slotPosition = spinCount + 1 + offset;
          const isCurrentWord = offset === 0;
          const isHighlighted = highlightWord !== undefined && word === highlightWord;

          return (
            <div
              key={offset}
              className={`absolute inset-x-0 top-1/2 flex h-[1em] items-center justify-start whitespace-nowrap transition-opacity duration-500 ${isHighlighted ? (highlightClassName ?? "") : ""}`}
              style={{
                transform: `translateY(-50%) rotateX(${slotPosition * segmentAngle}deg) translateZ(${-drumRadiusEm}em)`,
                backfaceVisibility: "hidden",
                opacity: isCurrentWord ? 1 : neighbourOpacity,
              }}
            >
              {word}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
