import { useEffect, useRef, useState } from "react";
import "./PersevereAnimation.css";

// ---------------------------------------------------------------------------
// Persevere animation
// ---------------------------------------------------------------------------
// Renders "persevere" in TG Motion Sickness, where each letter randomly flicks
// between its hand-drawn glyph variants (base + up to 4 alternates), mapped to
// PUA codepoints baked into the embedded subset font in persevere-animation.css.
//
// - Every letter trembles continuously: a few degrees of rotation and a couple
//   of pixels of drift, refreshed on every tick, so the word feels hand-drawn
//   even when no variant is changing.
// - Roughly once every UPDATE_INTERVAL_MS, one letter swaps to a new variant.
// - No two occurrences of the same letter (the four "e"s, the two "r"s) ever
//   show the same variant at the same time.
// - After CYCLE_LENGTH swaps the word resets to its starting assignment, so
//   the loop has no visible jump.

const WORD = "persevere";

type Tremble = { rot: number; dx: number; dy: number };

// Base glyph -> its available alternate codepoints (PUA, from the subset
// font). The plain letter is the base style, alt1-4 map to the private-use-
// area codepoints baked into persevere-animation.css's embedded subset.
const VARIANT_MAP: Record<string, string[]> = {
  p: ["p", "\uE000", "\uE001", "\uE002", "\uE003"],
  e: ["e", "\uE004", "\uE005", "\uE006", "\uE007"],
  r: ["r", "\uE008", "\uE009", "\uE00A", "\uE00B"],
  s: ["s", "\uE00C", "\uE00D", "\uE00E", "\uE00F"],
  v: ["v", "\uE010", "\uE011", "\uE012", "\uE013"],
};

const TREMBLE_INTERVAL_MS = 90;
const UPDATE_INTERVAL_MS = 900;
const LETTERS_PER_UPDATE = 1;
const CYCLE_LENGTH = 12; // variant-swaps before looping back to the start

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Every occurrence of a repeated letter (e, r) gets a distinct variant up
// front, so the word never starts with two identical "e"s side by side.
function buildInitialAssignment(): string[] {
  const positionsByChar: Record<string, number[]> = {};
  WORD.split("").forEach((ch, i) => {
    if (!positionsByChar[ch]) positionsByChar[ch] = [];
    positionsByChar[ch].push(i);
  });

  const assignment = new Array(WORD.length).fill("");
  Object.entries(positionsByChar).forEach(([ch, positions]) => {
    const options = [...VARIANT_MAP[ch]];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    positions.forEach((pos, idx) => {
      assignment[pos] = options[idx % options.length];
    });
  });
  return assignment;
}

function pickNewVariant(current: string[], pos: number): string {
  const ch = WORD[pos];
  const sameLetterPositions = WORD.split("")
    .map((c, i) => (c === ch ? i : -1))
    .filter((i) => i !== -1 && i !== pos);

  const usedByOthers = new Set(sameLetterPositions.map((i) => current[i]));
  const options = VARIANT_MAP[ch].filter((v) => v !== current[pos] && !usedByOthers.has(v));

  return options.length === 0 ? current[pos] : randOf(options);
}

export function PersevereAnimation({ className = "" }: { className?: string }) {
  const [initial] = useState(buildInitialAssignment);
  const [glyphs, setGlyphs] = useState(initial);
  const [trembles, setTrembles] = useState<Tremble[]>(() =>
    WORD.split("").map(() => ({ rot: 0, dx: 0, dy: 0 }))
  );
  const updateCountRef = useRef(0);
  const currentRef = useRef(initial);

  // Continuous trembling, every letter, every tick, independent of variant swaps.
  useEffect(() => {
    const id = setInterval(() => {
      setTrembles(
        WORD.split("").map(() => ({
          rot: (Math.random() - 0.5) * 10, // -5deg .. 5deg
          dx: (Math.random() - 0.5) * 6, // -3px .. 3px
          dy: (Math.random() - 0.5) * 6,
        }))
      );
    }, TREMBLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Slow, single-letter variant swapping, looping cleanly back to the start.
  useEffect(() => {
    const id = setInterval(() => {
      if (updateCountRef.current >= CYCLE_LENGTH) {
        currentRef.current = [...initial];
        updateCountRef.current = 0;
        setGlyphs(currentRef.current);
        return;
      }

      const next = [...currentRef.current];
      const positions = Array.from({ length: WORD.length }, (_, i) => i);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      positions.slice(0, LETTERS_PER_UPDATE).forEach((pos) => {
        next[pos] = pickNewVariant(next, pos);
      });

      currentRef.current = next;
      updateCountRef.current += 1;
      setGlyphs(next);
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [initial]);

  return (
    <div
      aria-label="persevere"
      // rounded-[8px] used deliberately rather than rounded-lg, this repo's
      // rounded-lg is redefined to 0.625rem (10px) via --radius, not the
      // default Tailwind 8px, and the original design called for 8px exactly.
      className={`inline-flex w-fit items-baseline justify-center rounded-[8px] bg-(--color-oxblood) px-16 py-12 leading-none ${className}`}
    >
      {glyphs.map((char, i) => {
        const t = trembles[i] ?? { rot: 0, dx: 0, dy: 0 };
        return (
          <span
            key={i}
            className="inline-block font-[TGMotionSicknessSubset] text-[clamp(48px,9vw,140px)] text-(--color-ivory) transition-transform duration-90 ease-linear will-change-transform"
            style={{ transform: `translate(${t.dx}px, ${t.dy}px) rotate(${t.rot}deg)` }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
