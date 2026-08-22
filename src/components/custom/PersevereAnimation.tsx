import { useEffect, useRef, useState } from "react";
import { paintGrainOverlay, resolveColor } from "@/lib/grain-canvas";
import "./PersevereAnimation.css";

// Same gradient + grain as GrainHeading (the About/Contact/Blog/Case Studies and
// Ads/Creative page titles) - see that component for why the gradient matters
// (Grainient's overlay-blend noise barely reads against flat ivory on its own).
const GRAIN_LIGHT_COLOR = "--color-ivory";
const GRAIN_DEEP_COLOR = "#e2d7b2";
const GRAIN_NOISE_INTENSITY = 5;

// Paints one continuous gradient+grain texture sized to the whole word (rather
// than a small repeating tile), so each letter's `background-position` can
// sample its own slice with no risk of a repeating tile's seams showing.
function buildWordGrainTexture(width: number, height: number): string {
  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.ceil(width * dpr));
  canvas.height = Math.max(1, Math.ceil(height * dpr));
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, resolveColor(GRAIN_LIGHT_COLOR));
  gradient.addColorStop(1, resolveColor(GRAIN_DEEP_COLOR));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  paintGrainOverlay(ctx, canvas.width, canvas.height, GRAIN_NOISE_INTENSITY);
  return canvas.toDataURL();
}

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

// Font size (px) used when measuring glyph ink extents via canvas, chosen
// large for precision; the resulting overshoot is expressed as a ratio of
// this size, so it scales correctly to any rendered font size via `em`.
const INK_MEASURE_FONT_PX = 200;
// Fallback top-padding ratio (em) used before the canvas measurement
// resolves, generous enough to avoid a flash of clipped ascenders.
const FALLBACK_TOP_PAD_EM = 0.4;

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
  grainy = false,
}: {
  className?: string;
  textClassName?: string;
  sizeClassName?: string;
  showBackground?: boolean;
  /** texture the glyph fill with the same ivory grain used elsewhere on the
   * site, instead of a flat colour from `textClassName` */
  grainy?: boolean;
}) {
  // One shared texture sized to the whole word, sliced per letter via
  // background-position (see buildWordGrainTexture) rather than a repeating
  // tile, so the gradient reads as continuous across the word with no seams.
  const [wordTexture, setWordTexture] = useState<{
    url: string;
    width: number;
    height: number;
    offsets: number[];
  } | null>(null);
  const [initial] = useState(buildInitialAssignment);
  const [glyphs, setGlyphs] = useState(initial);
  const [trembles, setTrembles] = useState<Tremble[]>(() =>
    WORD.split("").map(() => ({ rot: 0, dx: 0, dy: 0 }))
  );
  const currentRef = useRef(initial);
  const measureRefs = useRef<Record<string, (HTMLSpanElement | null)[]>>({});
  const [maxWidths, setMaxWidths] = useState<Record<string, number> | null>(null);
  // How far the tallest glyph variant's ink rises above the font's normal
  // ascent, as a fraction of font-size. Applied as top padding (in `em`, so
  // it scales with sizeClassName) to every letter, so no variant's swash or
  // flourish ever gets clipped by an overflow-hidden ancestor, no matter
  // which letter happens to render tallest.
  const [topPadEm, setTopPadEm] = useState(FALLBACK_TOP_PAD_EM);
  // Same idea, but for how far the lowest variant's ink drops below the
  // font's normal descent. `leading-none` on the word wrapper keeps each
  // letter's own box tight to the font's line metrics, and a plain solid
  // colour fill doesn't care if a descender pokes past that box - but
  // `background-clip: text` does: the background (and so the grain texture)
  // never paints outside the element's own box no matter how big the texture
  // itself is, so without this, any descender overshoot the box didn't
  // already account for renders with no texture behind it, i.e. invisible.
  const [bottomPadEm, setBottomPadEm] = useState(FALLBACK_TOP_PAD_EM);

  // Measure every variant of every letter off-screen and take the widest per
  // letter, so each letter's box can be sized to fit its widest variant up
  // front. Also measures each variant's true ink extents via canvas to find
  // how far the tallest one overshoots the font's normal ascent. Re-measures
  // after fonts load, and on resize since sizeClassName is typically a
  // vw-based clamp().
  useEffect(() => {
    const measure = () => {
      const widths: Record<string, number> = {};
      for (const ch of UNIQUE_LETTERS) {
        const spans = measureRefs.current[ch] ?? [];
        widths[ch] = Math.max(0, ...spans.map((el) => el?.offsetWidth ?? 0));
      }
      setMaxWidths(widths);

      if (grainy) {
        const firstSpan = measureRefs.current[UNIQUE_LETTERS[0]]?.[0];
        const fontSizePx = firstSpan ? parseFloat(getComputedStyle(firstSpan).fontSize) : 0;
        if (fontSizePx) {
          const offsets: number[] = [];
          let cumulativeX = 0;
          for (const ch of WORD) {
            offsets.push(cumulativeX);
            cumulativeX += widths[ch] ?? 0;
          }
          // Deliberately much taller than any letter's own box (which is
          // tightened by `leading-none` on top): the texture is centred on
          // each letter via `background-position-y: 50%` rather than pinned
          // to the top, so overshoot in *either* direction (an ascender's
          // swash above, a descender below) still finds paint behind it
          // instead of the glyph running out past the texture's edge and
          // showing nothing.
          const height = fontSizePx * 4;
          setWordTexture({
            url: buildWordGrainTexture(cumulativeX, height),
            width: cumulativeX,
            height,
            offsets,
          });
        }
      }

      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        ctx.font = `${INK_MEASURE_FONT_PX}px TGMotionSicknessSubset`;
        let maxAscentOvershoot = 0;
        let maxDescentOvershoot = 0;
        for (const ch of UNIQUE_LETTERS) {
          for (const variant of VARIANT_MAP[ch]) {
            const m = ctx.measureText(variant);
            const ascentOvershoot = m.actualBoundingBoxAscent - m.fontBoundingBoxAscent;
            if (Number.isFinite(ascentOvershoot))
              maxAscentOvershoot = Math.max(maxAscentOvershoot, ascentOvershoot);
            const descentOvershoot = m.actualBoundingBoxDescent - m.fontBoundingBoxDescent;
            if (Number.isFinite(descentOvershoot))
              maxDescentOvershoot = Math.max(maxDescentOvershoot, descentOvershoot);
          }
        }
        if (maxAscentOvershoot > 0) setTopPadEm(maxAscentOvershoot / INK_MEASURE_FONT_PX + 0.05);
        if (maxDescentOvershoot > 0)
          setBottomPadEm(maxDescentOvershoot / INK_MEASURE_FONT_PX + 0.05);
      }
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
  }, [sizeClassName, grainy]);

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
            // Keyed on the variant, not just position, so a swap remounts a
            // fresh DOM node instead of updating the existing one's text in
            // place. Mobile Safari otherwise reuses the GPU-composited layer
            // from will-change-transform without fully repainting it, so ink
            // from the previous (sometimes taller) variant lingers as visible
            // artefacts above the new glyph.
            key={`${i}-${char}`}
            className={`inline-block text-center font-[TGMotionSicknessSubset] transition-transform duration-90 ease-linear will-change-transform ${sizeClassName} ${textClassName}`}
            style={{
              transform: `translate(${t.dx}px, ${t.dy}px) rotate(${t.rot}deg)`,
              width: width !== undefined ? `${width}px` : undefined,
              paddingTop: `${topPadEm}em`,
              paddingBottom: `${bottomPadEm}em`,
              ...(wordTexture
                ? {
                    backgroundImage: `url(${wordTexture.url})`,
                    backgroundSize: `${wordTexture.width}px ${wordTexture.height}px`,
                    backgroundPosition: `-${wordTexture.offsets[i]}px 50%`,
                    backgroundRepeat: "no-repeat",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }
                : undefined),
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
