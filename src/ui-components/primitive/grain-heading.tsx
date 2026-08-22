import { useEffect, useRef, useState } from "react";
import opentype, { type Font } from "opentype.js";
import { paintGrainOverlay, resolveColor } from "@/lib/grain-canvas";

interface GrainHeadingProps {
  text: string;
  /** which TG display font to draw the glyphs from */
  fontUrl?: string;
  /** sizing classes only (e.g. text-[clamp(...)]) - drives the rendered font-size,
   * the same way any other heading would be sized */
  className?: string;
  /** extra letter-spacing, as a fraction of font-size */
  tracking?: number;
  /** lighter end of the subtle ivory gradient, defaults to the site's ivory */
  lightColor?: string;
  /** darker end of the gradient - just enough value difference for the grain to read */
  deepColor?: string;
  noiseIntensity?: number;
}

// opentype.js's own load()/loadSync() are deprecated no-ops in this version's
// browser build, so the font is fetched and parsed directly instead. Cached per
// URL so switching fonts across headings doesn't re-fetch on every render.
const fontPromises = new Map<string, Promise<Font>>();
function loadFont(fontUrl: string): Promise<Font> {
  let promise = fontPromises.get(fontUrl);
  if (!promise) {
    promise = fetch(fontUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => opentype.parse(buffer));
    fontPromises.set(fontUrl, promise);
  }
  return promise;
}

// Builds a name -> glyph index map once per font (font.glyphNames.nameToGlyphIndex
// doesn't resolve CFF charset names for this font, so this is done by hand).
const glyphIndexCache = new WeakMap<Font, Map<string, number>>();
function getGlyphNameIndex(font: Font): Map<string, number> {
  let map = glyphIndexCache.get(font);
  if (!map) {
    map = new Map();
    for (let i = 0; i < font.numGlyphs; i++) {
      const name = font.glyphs.get(i).name;
      if (name) map.set(name, i);
    }
    glyphIndexCache.set(font, map);
  }
  return map;
}

// For each letter in `text`, picks a glyph so that no letter shape repeats within
// the word unless it has to: fonts that ship hand-drawn alternates per letter
// (e.g. TG-MotionSickness.otf's "e.alt1".."e.alt4") give the first occurrence the
// base glyph and cycle each subsequent occurrence of the same letter to the
// next-unused alternate. If a letter repeats more times than it has alternates,
// styles start recurring, but only after every other variant has been used -
// which is what keeps any two repeats of the same style as far apart as the
// font's variety allows. Fonts with no alternates (e.g. TG-Pomelo.otf) just fall
// back to the single base glyph every time, a no-op.
function pickGlyphIndices(text: string, font: Font): number[] {
  const nameIndex = getGlyphNameIndex(font);
  const seenCount: Record<string, number> = {};

  return Array.from(text).map((char) => {
    if (!/[a-zA-Z]/.test(char)) {
      return font.charToGlyphIndex(char);
    }

    const occurrence = seenCount[char] ?? 0;
    seenCount[char] = occurrence + 1;

    const candidateName = occurrence === 0 ? char : `${char}.alt${occurrence}`;
    const candidateIndex = nameIndex.get(candidateName);
    if (candidateIndex !== undefined) return candidateIndex;

    // ran out of alternates for this letter - cycle back to the least-recently-used
    // style rather than reusing the one immediately before it
    const availableNames = [char, ...[1, 2, 3, 4, 5].map((n) => `${char}.alt${n}`)].filter((n) =>
      nameIndex.has(n)
    );
    const wrapped = availableNames[occurrence % availableNames.length];
    return nameIndex.get(wrapped)!;
  });
}

/**
 * Renders `text` in the given TG font by drawing each letter's outline onto a
 * canvas itself (rather than leaving it to the browser's normal text layout),
 * which is what makes two things possible at once:
 *  - picking a different hand-drawn alternate glyph for each repeated letter
 *    (see pickGlyphIndices), which plain CSS text can't do
 *  - filling the glyph shapes with a painted texture (a subtle ivory gradient
 *    plus the same grain noise as Grainient) instead of a flat colour, so the
 *    grain actually reads against the light ivory instead of washing out
 */
export function GrainHeading({
  text,
  fontUrl = "/fonts/TG-Pomelo.otf",
  className = "",
  tracking = 0.025,
  lightColor = "--color-ivory",
  deepColor = "#e2d7b2",
  noiseIntensity = 5,
}: GrainHeadingProps) {
  const sizerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadFont(fontUrl).then((loaded) => {
      if (!cancelled) setFont(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [fontUrl]);

  useEffect(() => {
    const sizer = sizerRef.current;
    const canvas = canvasRef.current;
    if (!font || !sizer || !canvas) return;

    function render() {
      const fontSizePx = parseFloat(getComputedStyle(sizer!).fontSize);
      if (!fontSizePx) return;

      // everything below is computed directly in device pixels (fontSizePx already
      // includes dpr) so the grain noise stays crisp instead of being upscaled and
      // softened by the browser on high-DPI screens
      const dpr = window.devicePixelRatio || 1;
      const devicePx = fontSizePx * dpr;
      const scale = devicePx / font!.unitsPerEm;
      const trackingPx = devicePx * tracking;
      const glyphIndices = pickGlyphIndices(text, font!);

      let totalWidth = 0;
      const glyphs = glyphIndices.map((index, i) => {
        const glyph = font!.glyphs.get(index);
        const advance =
          glyph.advanceWidth! * scale + (i < glyphIndices.length - 1 ? trackingPx : 0);
        totalWidth += advance;
        return { glyph, advance };
      });

      const ascender = font!.ascender * scale;
      const descender = Math.abs(font!.descender) * scale;
      const lineHeight = ascender + descender;
      const width = Math.max(1, Math.ceil(totalWidth));
      const height = Math.max(1, Math.ceil(lineHeight));

      // paint the texture (gradient + grain) on its own canvas first
      const paint = document.createElement("canvas");
      paint.width = width;
      paint.height = height;
      const paintCtx = paint.getContext("2d")!;
      const gradient = paintCtx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, resolveColor(lightColor));
      gradient.addColorStop(1, resolveColor(deepColor));
      paintCtx.fillStyle = gradient;
      paintCtx.fillRect(0, 0, width, height);
      paintGrainOverlay(paintCtx, width, height, noiseIntensity);

      // draw the glyph outlines as a mask, then composite the texture into just
      // the glyph ink using source-in
      canvas!.width = width;
      canvas!.height = height;
      canvas!.style.width = `${width / dpr}px`;
      canvas!.style.height = `${height / dpr}px`;
      const ctx = canvas!.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      let x = 0;
      for (const { glyph, advance } of glyphs) {
        const path = glyph.getPath(x, ascender, devicePx);
        path.fill = "#000";
        path.draw(ctx);
        x += advance;
      }
      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(paint, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }

    render();
    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(sizer);
    return () => resizeObserver.disconnect();
  }, [font, text, tracking, lightColor, deepColor, noiseIntensity]);

  return (
    <span className="inline-block align-middle">
      {/* drives the responsive font-size via ordinary CSS and keeps the text
          accessible/selectable; visually replaced by the canvas once it draws */}
      <span ref={sizerRef} className={`sr-only ${className}`}>
        {text}
      </span>
      <canvas ref={canvasRef} aria-hidden className="inline-block align-middle" />
    </span>
  );
}
