import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Generic image gallery: click-to-swap thumbnail row on top, large preview
// below. Carries no content of its own, callers supply the images.
//
// The preview frame is a fixed height - the tallest of the carousel's own
// photos, rendered at the frame's own width - so switching the active photo
// never changes the frame's size (and anything laid out beside the gallery
// never reflows because of it). Shorter/wider photos letterbox within that
// fixed height rather than shrinking the frame. `maxPreviewHeight` remains a
// ceiling on that computed height for an unusually tall carousel. Thumbnails
// stay uniform squares regardless of the source image's shape, object-cover
// cropping to whatever `focalPoint` each image specifies (or the center by
// default) so the crop lands on the recognizable part of the shot rather
// than a shrunk whole frame.
//
// The preview paints via a background-image div sized to the image's own
// rendered box in pixels, not an <img src> with object-fit and not a div that
// simply fills the frame. Two bugs otherwise show up:
//  - A large <img> using object-fit inside a border-radius + overflow:hidden
//    ancestor can fail in Chromium to clip its top corners (bottom corners
//    are fine) - reproduces outside React too, not a framer-motion/Lenis
//    interaction.
//  - object-fit: contain (or background-size: contain) inside a box sized
//    to the *frame*, not the content, leaves a letterboxed gap around the
//    image wherever its aspect ratio doesn't match the frame. That gap is
//    the same ivory as the frame background, so the rounded corner sits in
//    it invisibly and only the photo's own square edge (inset from the
//    corner) reads as visible - looks unrounded even though the frame
//    genuinely is.
// A hidden sizer <img> with no forced width - only max-width/max-height -
// lets the browser's own intrinsic-ratio sizing shrink its box to exactly
// match the rendered content (no letterbox slack in the box itself); we read
// that box in pixels and paint the background-image div at that exact size,
// so the rounded corner always cuts real photo pixels.
// ---------------------------------------------------------------------------

export type GalleryImage = {
  src: string;
  alt: string;
  /** CSS object-position for the thumbnail crop, e.g. "50% 20%". Defaults to center. */
  focalPoint?: string;
};

export type ImageGalleryProps = {
  images: GalleryImage[];
  className?: string;
  initialIndex?: number;
  /** Ceiling on the fixed frame height, for an unusually tall carousel. */
  maxPreviewHeight?: string;
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

export function ImageGallery({
  images,
  className,
  initialIndex = 0,
  maxPreviewHeight = "34rem",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  // Frame width + each photo's intrinsic size determine the tallest photo's
  // rendered height at that width, which becomes the frame's fixed height.
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [naturalSizes, setNaturalSizes] = useState<Record<string, { width: number; height: number }>>(
    {}
  );

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => setFrameWidth(frame.clientWidth);
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(frame);
    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    setNaturalSizes({});
  }, [images]);

  const tallestHeight = images.reduce((max, image) => {
    const natural = naturalSizes[image.src];
    if (!natural || !frameWidth) return max;
    const rendered = (frameWidth * natural.height) / natural.width;
    return Math.max(max, rendered);
  }, 0);

  const frameHeight = tallestHeight > 0 ? Math.min(tallestHeight, cssLengthToPx(maxPreviewHeight)) : 0;

  const sizerRef = useRef<HTMLImageElement>(null);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);

  const active = images[activeIndex];

  useLayoutEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;

    const measure = () => {
      const rect = sizer.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPreviewSize({ width: rect.width, height: rect.height });
      }
    };

    measure();
    sizer.addEventListener("load", measure);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(sizer);

    return () => {
      sizer.removeEventListener("load", measure);
      resizeObserver.disconnect();
    };
  }, [active?.src, frameHeight]);

  if (images.length === 0) return null;

  return (
    <div className={cn("flex w-full max-w-3xl flex-col items-center gap-4", className)}>
      <div className="grid w-full grid-cols-4 gap-4">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={image.src + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${image.alt}`}
              aria-current={isActive}
              className={cn(
                "aspect-square w-full cursor-pointer overflow-hidden rounded-xl outline-offset-2 transition focus-visible:outline-2 focus-visible:outline-(--color-terracotta)",
                isActive
                  ? "ring-2 ring-(--color-terracotta) ring-offset-2 ring-offset-(--color-ivory)"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: image.focalPoint ?? "center" }}
                onLoad={(event) => {
                  const target = event.currentTarget;
                  setNaturalSizes((prev) =>
                    prev[image.src]
                      ? prev
                      : { ...prev, [image.src]: { width: target.naturalWidth, height: target.naturalHeight } }
                  );
                }}
              />
            </button>
          );
        })}
      </div>

      <div
        ref={frameRef}
        className="grid w-full place-items-center overflow-hidden rounded-2xl bg-(--color-ivory)"
        style={{ height: frameHeight > 0 ? frameHeight : undefined, maxHeight: maxPreviewHeight }}
      >
        {/* Invisible - exists only so the browser's own intrinsic-ratio sizing tells us
            the pixel box to paint the background-image div at (see file banner). */}
        <img
          ref={sizerRef}
          key={active.src}
          src={active.src}
          alt=""
          aria-hidden
          className="invisible max-w-full object-contain [grid-area:1/1]"
          style={{ maxHeight: frameHeight > 0 ? frameHeight : maxPreviewHeight }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active.src}
            role="img"
            aria-label={active.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl bg-cover bg-center bg-no-repeat [grid-area:1/1]"
            style={{
              width: previewSize?.width,
              height: previewSize?.height,
              backgroundImage: `url(${active.src})`,
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
