import { useEffect, useRef, useState } from "react";
import "./PersevereAnimation.css";

// ---------------------------------------------------------------------------
// Persevere animation
// ---------------------------------------------------------------------------
// Renders "persevere" in TG Motion Sickness, where each letter randomly flicks
// between its hand-drawn glyph variants (base + up to 4 alternates), mapped to
// PUA codepoints baked into the embedded subset font in persevere-animation.css.
//
// - Every letter trembles continuously: a fraction of a degree of rotation and
//   a fraction of a pixel of drift, refreshed on every tick, so the word feels
//   hand-drawn even when no variant is changing, without being distracting.
// - Roughly once every UPDATE_INTERVAL_MS, exactly one letter swaps to a new
//   variant, forever, so it never needs to jump back to a starting state and
//   never has more than one letter changing at a time.
// - No two occurrences of the same letter (the four "e"s, the two "r"s) ever
//   show the same variant at the same time.
// - Each letter sits in a box sized to the widest of that letter's variants
//   (measured off-screen up front), so no variant swap ever clips or shifts
//   neighbouring letters, and the word's total width never changes.

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

const UNIQUE_LETTERS = Object.keys(VARIANT_MAP);

function pickNewVariant(current: string[], pos: number): string {
  const ch = WORD[pos];
  const sameLetterPositions = WORD.split("")
    .map((c, i) => (c === ch ? i : -1))
    .filter((i) => i !== -1 && i !== pos);

  const usedByOthers = new Set(sameLetterPositions.map((i) => current[i]));
  const options = VARIANT_MAP[ch].filter((v) => v !== current[pos] && !usedByOthers.has(v));

  return options.length === 0 ? current[pos] : randOf(options);
}

export function PersevereAnimation({
  className = "",
  textClassName = "text-(--color-ivory)",
  sizeClassName = "text-[clamp(48px,9vw,140px)]",
  showBackground = true,
}: {
  className?: string;
  textClassName?: string;
  sizeClassName?: string;
  showBackground?: boolean;
}) {
  const [initial] = useState(buildInitialAssignment);
  const [glyphs, setGlyphs] = useState(initial);
  const [trembles, setTrembles] = useState<Tremble[]>(() =>
    WORD.split("").map(() => ({ rot: 0, dx: 0, dy: 0 }))
  );
  const currentRef = useRef(initial);
  const measureRefs = useRef<Record<string, (HTMLSpanElement | null)[]>>({});
  const [maxWidths, setMaxWidths] = useState<Record<string, number> | null>(null);

  // Measure every variant of every letter off-screen and take the widest per
  // letter, so each letter's box can be sized to fit its widest variant up
  // front. Re-measures after fonts load, and on resize since sizeClassName
  // is typically a vw-based clamp().
  useEffect(() => {
    const measure = () => {
      const widths: Record<string, number> = {};
      for (const ch of UNIQUE_LETTERS) {
        const spans = measureRefs.current[ch] ?? [];
        widths[ch] = Math.max(0, ...spans.map((el) => el?.offsetWidth ?? 0));
      }
      setMaxWidths(widths);
    };

    measure();
    document.fonts.ready.then(measure);
    const settleTimeout1 = setTimeout(measure, 150);
    const settleTimeout2 = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      window.removeEventListener("resize", measure);
    };
  }, [sizeClassName]);

  // Continuous trembling, every letter, every tick, independent of variant swaps.
  useEffect(() => {
    const id = setInterval(() => {
      setTrembles(
        WORD.split("").map(() => ({
          rot: (Math.random() - 0.5) * 1, // -0.5deg .. 0.5deg
          dx: (Math.random() - 0.5) * 0.8, // -0.4px .. 0.4px
          dy: (Math.random() - 0.5) * 0.8,
        }))
      );
    }, TREMBLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Slow, single-letter variant swapping, forever, one letter per tick.
  useEffect(() => {
    const id = setInterval(() => {
      const pos = Math.floor(Math.random() * WORD.length);
      const next = [...currentRef.current];
      next[pos] = pickNewVariant(next, pos);

      currentRef.current = next;
      setGlyphs(next);
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-label="persevere"
      // rounded-[8px] used deliberately rather than rounded-lg, this repo's
      // rounded-lg is redefined to 0.625rem (10px) via --radius, not the
      // default Tailwind 8px, and the original design called for 8px exactly.
      className={`relative inline-flex w-fit items-baseline justify-center leading-none ${
        showBackground ? "rounded-[8px] bg-(--color-oxblood) px-16 py-12" : ""
      } ${className}`}
    >
      {/* Off-screen: every variant of every letter, rendered once to measure
          natural widths. Never visible, positioned out of flow so it can't
          affect layout or scroll. */}
      <div aria-hidden className="pointer-events-none absolute -z-10 -translate-x-full opacity-0">
        {UNIQUE_LETTERS.map((ch) =>
          VARIANT_MAP[ch].map((variant, vi) => (
            <span
              key={variant}
              ref={(el) => {
                (measureRefs.current[ch] ??= [])[vi] = el;
              }}
              className={`inline-block font-[TGMotionSicknessSubset] whitespace-pre ${sizeClassName}`}
            >
              {variant}
            </span>
          ))
        )}
      </div>

      {glyphs.map((char, i) => {
        const t = trembles[i] ?? { rot: 0, dx: 0, dy: 0 };
        const width = maxWidths?.[WORD[i]];
        return (
          <span
            key={i}
            className={`inline-block text-center font-[TGMotionSicknessSubset] transition-transform duration-90 ease-linear will-change-transform ${sizeClassName} ${textClassName}`}
            style={{
              transform: `translate(${t.dx}px, ${t.dy}px) rotate(${t.rot}deg)`,
              width: width !== undefined ? `${width}px` : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
