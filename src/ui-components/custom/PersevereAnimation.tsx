import { useEffect, useRef, useState } from "react";
import { paintGrainOverlay, resolveColor } from "@/lib/grain-canvas";
import "./PersevereAnimation.css";

// Same fill colour as GrainHeading (the About/Contact/Blog/Case Studies and
// Ads/Creative page titles) - see that component for why the grain matters
// (Grainient's overlay-blend noise barely reads against flat ivory on its own).
const GRAIN_COLOR = "#e2d7b2";
const GRAIN_NOISE_INTENSITY = 5;

// How much taller than the font size each letter's texture canvas is, so a
// glyph drawn at vertical-centre has generous headroom for any variant's
// ascender/descender overshoot without needing to know the exact overshoot
// up front.
const GRAIN_CANVAS_HEIGHT_RATIO = 2.2;

type GrainTexture = { url: string; width: number; height: number };

// Renders one glyph variant's grain texture: the glyph shape is drawn as a
// black mask, then a gradient+grain "paint" layer is composited into just
// that mask via source-in (same two-canvas technique as GrainHeading), so
// the resulting PNG is transparent everywhere except the glyph's own ink.
// Called once per (letter, variant) up front - not on every render or swap -
// so the actual grain noise is generated a fixed number of times and then
// just reused, rather than regenerated continuously.
function buildGrainTexture(variant: string, widthCss: number, fontSizePx: number): GrainTexture {
  const dpr = window.devicePixelRatio || 1;
  const heightCss = fontSizePx * GRAIN_CANVAS_HEIGHT_RATIO;
  const width = Math.max(1, Math.ceil(widthCss * dpr));
  const height = Math.max(1, Math.ceil(heightCss * dpr));

  const paint = document.createElement("canvas");
  paint.width = width;
  paint.height = height;
  const paintCtx = paint.getContext("2d")!;
  paintCtx.fillStyle = resolveColor(GRAIN_COLOR);
  paintCtx.fillRect(0, 0, width, height);
  paintGrainOverlay(paintCtx, width, height, GRAIN_NOISE_INTENSITY);

  const glyphCanvas = document.createElement("canvas");
  glyphCanvas.width = width;
  glyphCanvas.height = height;
  const ctx = glyphCanvas.getContext("2d")!;
  ctx.font = `${fontSizePx * dpr}px TGMotionSicknessSubset`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(variant, 0, height / 2);
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(paint, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  return { url: glyphCanvas.toDataURL(), width: widthCss, height: heightCss };
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

type TrembleTiming = { durationS: number; delayS: number };

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

const UPDATE_INTERVAL_MS = 900;

// Randomized once per letter (not re-rolled on every tick, unlike the old
// JS-driven version), so each letter trembles on its own phase via the CSS
// `persevere-tremble` keyframe animation instead of a JS setInterval.
function randomTrembleTiming(): TrembleTiming {
  const durationS = 1.6 + Math.random() * 0.8; // 1.6s .. 2.4s
  return { durationS, delayS: -Math.random() * durationS };
}

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
  /** texture each glyph with the same ivory grain used elsewhere on the
   * site, instead of a flat colour from `textClassName`. The grain itself is
   * pre-rendered once per (letter, variant) and cached, not regenerated on
   * every tremble/variant swap. */
  grainy?: boolean;
}) {
  // One pre-rendered texture per glyph variant (25 for "persevere"'s 5
  // unique letters x 5 variants each), keyed by variant codepoint/char.
  // Rebuilt only when the measured letter widths or font size actually
  // change (debounced on resize), never on the recurring variant-swap timer.
  const [grainTextures, setGrainTextures] = useState<Record<string, GrainTexture> | null>(null);
  const grainBuildTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [initial] = useState(buildInitialAssignment);
  const [glyphs, setGlyphs] = useState(initial);
  const [trembleTimings] = useState<TrembleTiming[]>(() => WORD.split("").map(randomTrembleTiming));
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
  // font's normal descent.
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

      // Debounced: rebuilding 25 glyph textures (canvas draw + toDataURL
      // each) is cheap once, but resize fires repeatedly while dragging, so
      // only the settled size actually triggers a rebuild.
      if (grainy) {
        const firstSpan = measureRefs.current[UNIQUE_LETTERS[0]]?.[0];
        const fontSizePx = firstSpan ? parseFloat(getComputedStyle(firstSpan).fontSize) : 0;
        if (fontSizePx) {
          if (grainBuildTimeoutRef.current) clearTimeout(grainBuildTimeoutRef.current);
          grainBuildTimeoutRef.current = setTimeout(() => {
            grainBuildTimeoutRef.current = null;
            const textures: Record<string, GrainTexture> = {};
            for (const ch of UNIQUE_LETTERS) {
              const letterWidth = widths[ch];
              if (!letterWidth) continue;
              for (const variant of VARIANT_MAP[ch]) {
                textures[variant] = buildGrainTexture(variant, letterWidth, fontSizePx);
              }
            }
            setGrainTextures(textures);
          }, 200);
        }
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
      if (grainBuildTimeoutRef.current) clearTimeout(grainBuildTimeoutRef.current);
      window.removeEventListener("resize", measure);
    };
  }, [sizeClassName, grainy]);

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
        const timing = trembleTimings[i];
        const width = maxWidths?.[WORD[i]];
        const tex = grainy ? grainTextures?.[char] : undefined;
        return (
          <span
            // Keyed on the variant, not just position, so a swap remounts a
            // fresh DOM node instead of updating the existing one's text in
            // place. Mobile Safari otherwise reuses the GPU-composited layer
            // from will-change-transform without fully repainting it, so ink
            // from the previous (sometimes taller) variant lingers as visible
            // artefacts above the new glyph.
            key={`${i}-${char}`}
            aria-hidden="true"
            className={`inline-block text-center font-[TGMotionSicknessSubset] will-change-transform ${sizeClassName} ${textClassName}`}
            style={{
              animationName: "persevere-tremble",
              animationDuration: `${timing.durationS}s`,
              animationDelay: `${timing.delayS}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              width: width !== undefined ? `${width}px` : undefined,
              paddingTop: `${topPadEm}em`,
              paddingBottom: `${bottomPadEm}em`,
              // Pre-rendered texture (see buildGrainTexture): a plain
              // background-image with the grain baked into its alpha, no
              // background-clip: text mask needed at runtime. Falls back to
              // the flat textClassName colour until the texture for this
              // variant is ready.
              ...(tex
                ? {
                    backgroundImage: `url(${tex.url})`,
                    backgroundSize: `${tex.width}px ${tex.height}px`,
                    backgroundPosition: "50% 50%",
                    backgroundRepeat: "no-repeat",
                    color: "transparent",
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
