"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// how far down from the very top of the viewport to sample, roughly matching
// where the menu button's vertical centre sits inside the fixed header
const SAMPLE_Y = 48;

// safety cap on how deep to descend through wrapper elements, prevents runaway
// recursion if something unexpected happens with the DOM structure
const MAX_DEPTH = 8;

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

// walks down through transparent wrapper elements (animation wrappers, layout divs, etc.)
// until it finds elements that actually paint a background colour, or gives up at MAX_DEPTH.
function collectBackgroundCandidates(el: HTMLElement, depth = 0): HTMLElement[] {
  if (depth >= MAX_DEPTH) return [el];

  const rgba = parseRgba(getComputedStyle(el).backgroundColor);
  const isTransparent = !rgba || rgba.a === 0;

  if (!isTransparent) return [el];

  const children = Array.from(el.children) as HTMLElement[];
  if (children.length === 0) return [el];

  return children.flatMap((child) => collectBackgroundCandidates(child, depth + 1));
}

/**
 * Watches scroll position AND route changes, returning either `lightBgColor` or
 * `darkBgColor` depending on the actual background colour of whichever section
 * currently sits behind the fixed header.
 *
 * The route-change awareness matters because the Navbar/header lives in a persistent
 * layout that never unmounts between pages, without tracking location changes here,
 * this would only ever check the background once on first load and then freeze,
 * leaving stale colours behind whenever you navigate without also scrolling or resizing.
 */
export function useHeaderContrast(lightBgTextColor: string, darkBgTextColor: string): string {
  const [color, setColor] = useState(darkBgTextColor);
  const location = useLocation();

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    let frame = 0;

    const check = () => {
      const topLevel = Array.from(mainEl.children) as HTMLElement[];
      const candidates = topLevel.flatMap((el) => collectBackgroundCandidates(el));

      const target = candidates.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= SAMPLE_Y && rect.bottom >= SAMPLE_Y;
      });

      if (target) {
        const rgba = parseRgba(getComputedStyle(target).backgroundColor);
        if (rgba) {
          const luminance = getLuminance(rgba.r, rgba.g, rgba.b);
          setColor(luminance > 0.55 ? lightBgTextColor : darkBgTextColor);
        }
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };

    // re-run on mount AND on every route change, with a couple of retries just after
    // navigation, since the incoming page's AnimatePresence transition means its final
    // layout position/background isn't necessarily settled the instant this effect fires
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
