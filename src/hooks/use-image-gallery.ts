import { useLayoutEffect, useState } from "react";

// ---------------------------------------------------------------------------
// State + derived layout for the click-to-swap image gallery (see
// image-gallery.tsx for the presentational half). Kept ref-free: nothing here
// touches a DOM ref, and nothing returned from this hook wraps one either -
// the components own their own refs and report measurements back up via
// plain callbacks (reportNaturalSize, reportFrameWidth), the same way. A hook
// that returns an object bundling a ref with ordinary reactive state makes
// every field on that object look ref-tainted to the React Compiler's
// analysis, so every render-time read of it - `gallery.active.src`, an
// autoplay countdown, all of it - gets flagged as an unsafe ref read even
// though none of them touch `.current`.
// ---------------------------------------------------------------------------

export type GalleryImage = {
  src: string;
  alt: string;
  /** CSS object-position for the thumbnail crop, e.g. "50% 20%". Defaults to center. */
  focalPoint?: string;
};

function cssLengthToPx(value: string): number {
  if (typeof document === "undefined") return Number.POSITIVE_INFINITY;
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.height = value;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

export function useImageGallery({
  images,
  initialIndex = 0,
  maxPreviewHeight = "34rem",
  autoRotateMs = 5000,
}: {
  images: GalleryImage[];
  initialIndex?: number;
  /** Ceiling on the fixed frame height, for an unusually tall carousel. */
  maxPreviewHeight?: string;
  /** How often the preview advances on its own. Pass 0 to disable. */
  autoRotateMs?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  // Re-runs (and so restarts its countdown) whenever activeIndex changes, whether
  // that change came from this tick or from the visitor clicking a thumbnail - so
  // a manual pick always buys a full autoRotateMs before the next auto-advance.
  // setActiveIndex only ever runs inside the interval's callback here, never
  // synchronously in the effect body, which is what keeps this a legitimate
  // "subscribe to an external timer" effect rather than a state-sync one.
  useLayoutEffect(() => {
    if (!autoRotateMs || images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, autoRotateMs);
    return () => clearInterval(id);
  }, [images, activeIndex, autoRotateMs]);

  const [frameWidth, setFrameWidth] = useState(0);
  const [naturalSizes, setNaturalSizes] = useState<
    Record<string, { width: number; height: number }>
  >({});

  // Resetting derived state when `images` changes belongs in the render body, not an
  // effect (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes):
  // React re-renders immediately on this kind of setState-during-render before
  // anything commits, so it doesn't cost an extra paint the way an effect-based
  // reset would.
  const [prevImages, setPrevImages] = useState(images);
  if (prevImages !== images) {
    setPrevImages(images);
    setNaturalSizes({});
  }

  const reportNaturalSize = (src: string, width: number, height: number) => {
    setNaturalSizes((prev) => (prev[src] ? prev : { ...prev, [src]: { width, height } }));
  };

  const tallestHeight = images.reduce((max, image) => {
    const natural = naturalSizes[image.src];
    if (!natural || !frameWidth) return max;
    const rendered = (frameWidth * natural.height) / natural.width;
    return Math.max(max, rendered);
  }, 0);

  const frameHeight =
    tallestHeight > 0 ? Math.min(tallestHeight, cssLengthToPx(maxPreviewHeight)) : 0;

  const active = images[activeIndex];

  return {
    images,
    activeIndex,
    setActiveIndex,
    active,
    frameHeight,
    maxPreviewHeight,
    reportNaturalSize,
    reportFrameWidth: setFrameWidth,
  };
}

export type ImageGallery = ReturnType<typeof useImageGallery>;
