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
 *
 * `widthMultiplier` inflates the measured natural width before computing the fit.
 * Use it when the element's content renders visually wider than its own layout box
 * (e.g. CylinderTextRotate's drum applies an internal paint-only scale to
 * compensate for 3D perspective, so its true on-screen width exceeds `scrollWidth`).
 */
export function useAutoFitScale(ref: React.RefObject<HTMLElement | null>, widthMultiplier = 1) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const parent = el.parentElement;
      if (!parent) return;
      const naturalWidth = el.scrollWidth * widthMultiplier;
      const availableWidth = parent.clientWidth;
      const nextScale =
        availableWidth > 0 && naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
      // Callers commonly feed this scale back into a style (e.g. a wrapper's
      // height) that the observed parent itself picks up, which makes the
      // ResizeObserver below fire again from that very update. Skipping
      // sub-0.1%-different updates keeps that from becoming a permanent
      // back-and-forth: once the scale has settled, further callback firings
      // recompute essentially the same value and this bails out instead of
      // scheduling another render (which would resize the parent again).
      setScale((prev) => (Math.abs(nextScale - prev) < 0.001 ? prev : nextScale));
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
  }, [ref, widthMultiplier]);

  return scale;
}
