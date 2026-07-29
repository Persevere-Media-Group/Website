"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// how far down from the very top of the viewport to sample, roughly matching
// where the menu button's vertical centre sits inside the fixed header
const SAMPLE_Y = 48;

// safety cap on how deep to descend, prevents runaway recursion on odd DOM structures
const MAX_DEPTH = 10;

function getLuminance(r: number, g: number, b: number): number {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

// parses "rgb(r, g, b)" or "rgba(r, g, b, a)", returns null for "transparent" or unparsable values
function parseRgba(colorString: string): { r: number; g: number; b: number; a: number } | null {
  const match = colorString.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(",").map((p) => parseFloat(p.trim()));
  if (parts.length < 3) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

interface PaintedEl {
  el: HTMLElement;
  depth: number;
}

/**
 * Walks the whole subtree collecting EVERY element that both paints a real background
 * and covers the header's sample point.
 *
 * This deliberately keeps descending past elements that already have a background, an
 * earlier version stopped at the first painted element it found, which broke on any
 * page where a coloured band (e.g. GrainWave) sits inside a section that itself has a
 * background: it would read the outer section's colour and never see the band actually
 * rendered on top of it (exactly what happens on the Contact page: the ivory <section>
 * wrapping GrainWave's terracotta band).
 */
function collectPainted(el: HTMLElement, depth = 0, found: PaintedEl[] = []): PaintedEl[] {
  if (depth >= MAX_DEPTH) return found;

  const rect = el.getBoundingClientRect();
  const coversSamplePoint = rect.top <= SAMPLE_Y && rect.bottom >= SAMPLE_Y;

  if (coversSamplePoint) {
    const rgba = parseRgba(getComputedStyle(el).backgroundColor);
    // only count meaningfully opaque backgrounds, a barely-there overlay isn't what
    // the eye reads as "the background colour" behind the button
    if (rgba && rgba.a > 0.5) {
      found.push({ el, depth });
    }
  }

  // keep descending regardless, a child may paint over this element
  for (const child of Array.from(el.children) as HTMLElement[]) {
    collectPainted(child, depth + 1, found);
  }

  return found;
}

/**
 * Watches scroll position AND route changes, returning either `lightBgColor` or
 * `darkBgColor` depending on the actual background colour of whatever is visually
 * topmost behind the fixed header.
 */
export function useHeaderContrast(lightBgTextColor: string, darkBgTextColor: string): string {
  const [color, setColor] = useState(darkBgTextColor);
  const location = useLocation();

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    let frame = 0;

    const check = () => {
      const painted = Array.from(mainEl.children).flatMap((child) =>
        collectPainted(child as HTMLElement)
      );
      if (painted.length === 0) return;

      // the deepest match is the one actually painted on top, that's what the button
      // is sitting against visually
      const target = painted.reduce((deepest, candidate) =>
        candidate.depth >= deepest.depth ? candidate : deepest
      );

      const rgba = parseRgba(getComputedStyle(target.el).backgroundColor);
      if (rgba) {
        const luminance = getLuminance(rgba.r, rgba.g, rgba.b);
        setColor(luminance > 0.55 ? lightBgTextColor : darkBgTextColor);
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };

    // re-run on mount AND on every route change, with a couple of retries just after
    // navigation, since the incoming page's transition means its final layout position
    // isn't necessarily settled the instant this effect fires
    check();
    const settleTimeout1 = setTimeout(check, 50);
    const settleTimeout2 = setTimeout(check, 400);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [lightBgTextColor, darkBgTextColor, location.pathname]);

  return color;
}
