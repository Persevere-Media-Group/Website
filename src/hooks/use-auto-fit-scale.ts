import { useEffect, useState } from "react";

/**
 * Scales an element down so it never overflows its parent horizontally.
 *
 * Used for single-line headlines that must not wrap: the text keeps its natural
 * size until the parent gets too narrow, then shrinks to fit instead of breaking
 * onto a second line. Returns a scale factor to feed into `transform: scale(...)`.
 *
 * Re-measures after fonts load and on resize, since a webfont swapping in changes
 * the natural width after first paint.
 */
export function useAutoFitScale(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const parent = el.parentElement;
      if (!parent) return;
      const naturalWidth = el.scrollWidth;
      const availableWidth = parent.clientWidth;
      const nextScale =
        availableWidth > 0 && naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
      setScale(nextScale);
    };

    fit();

    document.fonts.ready.then(fit);
    const settleTimeout1 = setTimeout(fit, 150);
    const settleTimeout2 = setTimeout(fit, 500);

    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref]);

  return scale;
}
