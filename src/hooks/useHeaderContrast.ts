"use client";

import { useEffect, useState } from "react";

// how far down from the very top of the viewport to sample, roughly matching
// where the menu button's vertical centre sits inside the fixed header
const SAMPLE_Y = 48;

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

/**
 * Watches scroll position and returns either `lightBgColor` or `darkBgColor` depending on
 * the actual background colour of whichever section currently sits behind the fixed header.
 *
 * Works by checking the direct children of <main> (each of your page sections), finding the
 * one whose bounding rect currently covers the header's sample point, then reading its real
 * computed background-color. This deliberately skips any element with a transparent
 * background (like the staggered menu's own fixed-position wrapper, which spans the whole
 * viewport and would otherwise always "win" the check).
 */
export function useHeaderContrast(lightBgTextColor: string, darkBgTextColor: string): string {
  const [color, setColor] = useState(darkBgTextColor);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    let frame = 0;

    const check = () => {
      const candidates = Array.from(mainEl.children) as HTMLElement[];

      const target = candidates.find((el) => {
        const rect = el.getBoundingClientRect();
        if (!(rect.top <= SAMPLE_Y && rect.bottom >= SAMPLE_Y)) return false;

        const rgba = parseRgba(getComputedStyle(el).backgroundColor);
        // skip transparent elements (e.g. the fixed nav wrapper itself), we only want
        // to match a section that actually paints a background behind the header
        return rgba !== null && rgba.a > 0.5;
      });

      if (target) {
        const rgba = parseRgba(getComputedStyle(target).backgroundColor);
        if (rgba) {
          const luminance = getLuminance(rgba.r, rgba.g, rgba.b);
          // above this threshold reads as a light background, needing dark text on top of it
          setColor(luminance > 0.55 ? lightBgTextColor : darkBgTextColor);
        }
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [lightBgTextColor, darkBgTextColor]);

  return color;
}
