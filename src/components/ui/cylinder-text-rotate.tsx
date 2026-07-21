"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CylinderTextRotateProps {
  words: string[];
  // how long each word holds centre-stage before spinning to the next, in ms
  duration?: number;
  // set to false to stop on the last word in the list, instead of looping forever
  loop?: boolean;
  className?: string;
  // degrees of the drum given to each word, smaller means a bigger, gentler barrel with more of each neighbour visible
  segmentAngle?: number;
  // opacity applied to every word that isn't the current centred one
  neighbourOpacity?: number;
}

export function CylinderTextRotate({
  words,
  duration = 900,
  loop = false,
  className,
  segmentAngle = 30,
  neighbourOpacity = 0.4,
}: CylinderTextRotateProps) {
  const [index, setIndex] = useState(0);

  // pads both ends of the drum with a duplicate word, a copy of the last word before the first,
  // and a copy of the first word after the last, so there's always something to spin in from
  // above and out towards below, even on the very first and very last word. these duplicates are
  // never actually selected as the current word, they're purely there to be seen as neighbours
  const wordsOnDrum = [words[words.length - 1], ...words, words[0]];

  // since we've prepended one padding word, the real word's position on the drum is always one ahead of its index
  const currentDrumIndex = index + 1;

  useEffect(() => {
    // once we've hit the real last word (not the duplicate) and looping is switched off, just stop here
    if (!loop && index === words.length - 1) {
      return;
    }

    const advanceTimer = setInterval(() => {
      setIndex((currentIndex) => {
        const isLastWord = currentIndex === words.length - 1;
        return isLastWord ? (loop ? 0 : currentIndex) : currentIndex + 1;
      });
    }, duration);

    return () => clearInterval(advanceTimer);
  }, [words, duration, loop, index]);

  // works out how far back the drum needs to sit so adjacent words meet edge to edge, with no gaps or overlap
  const segmentAngleRadians = (segmentAngle * Math.PI) / 180;
  const drumRadiusEm = 0.5 / Math.tan(segmentAngleRadians / 2);
  const perspectiveEm = drumRadiusEm * 6;

  // cancels out the size reduction that perspective naturally applies to anything pushed back on the z-axis,
  // so the centred word ends up the same rendered size as flat text like CHOOSE, not visibly smaller
  const sizeCompensationScale = (perspectiveEm + drumRadiusEm) / perspectiveEm;

  return (
    // the text size class lives here too, so every em unit below (height, perspective, translateZ) shares the same font-size context
    <div
      className={`relative overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] ${className ?? ""}`}
      style={{
        height: "2.2em",
        perspective: `${perspectiveEm}em`,
      }}
    >
      {/* the drum itself, holding every word wrapped around its surface */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", scale: sizeCompensationScale }}
        animate={{ rotateX: -currentDrumIndex * segmentAngle }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {wordsOnDrum.map((word, wordIndex) => {
          const isCurrentWord = wordIndex === currentDrumIndex;

          return (
            <div
              key={wordIndex}
              className="absolute inset-x-0 top-1/2 flex h-[1em] items-center justify-start whitespace-nowrap transition-opacity duration-500"
              style={{
                // negative translateZ pushes the word back onto the drum's surface, away from the viewer
                transform: `translateY(-50%) rotateX(${wordIndex * segmentAngle}deg) translateZ(${-drumRadiusEm}em)`,
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
