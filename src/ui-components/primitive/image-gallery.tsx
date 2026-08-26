import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Click-to-swap image gallery, split into a `useImageGallery` hook plus two
// presentational pieces - <GalleryThumbnails> and <GalleryPreview> - so a
// caller can lay them out however it needs (stacked, side by side, thumbnails
// paired with unrelated content) while sharing one source of truth for which
// photo is active and how tall the preview frame is.
//
// The preview frame is a fixed height - the tallest of the carousel's own
// photos, rendered at the frame's own width - so switching the active photo
// never changes the frame's size (and anything laid out beside the gallery
// never reflows because of it). Every photo, including the tallest, is then
// cropped (background-size: cover) to fill that frame exactly, the same
// treatment the thumbnails use; `focalPoint` (shared with the thumbnail crop)
// is what keeps a given photo's subject centred in that crop rather than
// whatever the image's geometric center happens to be. `maxPreviewHeight`
// remains a ceiling on the computed frame height for an unusually tall
// carousel.
//
// The preview paints via a background-image div, not an <img src> with
// object-fit: a large <img> using object-fit inside a border-radius +
// overflow:hidden ancestor can fail in Chromium to clip its top corners
// (bottom corners are fine) - reproduces outside React too, not a
// framer-motion/Lenis interaction.
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
}: {
  images: GalleryImage[];
  initialIndex?: number;
  /** Ceiling on the fixed frame height, for an unusually tall carousel. */
  maxPreviewHeight?: string;
}) {
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

  const reportNaturalSize = (src: string, width: number, height: number) => {
    setNaturalSizes((prev) => (prev[src] ? prev : { ...prev, [src]: { width, height } }));
  };

  const tallestHeight = images.reduce((max, image) => {
    const natural = naturalSizes[image.src];
    if (!natural || !frameWidth) return max;
    const rendered = (frameWidth * natural.height) / natural.width;
    return Math.max(max, rendered);
  }, 0);

  const frameHeight = tallestHeight > 0 ? Math.min(tallestHeight, cssLengthToPx(maxPreviewHeight)) : 0;

  const active = images[activeIndex];

  return {
    images,
    activeIndex,
    setActiveIndex,
    active,
    frameRef,
    frameHeight,
    maxPreviewHeight,
    reportNaturalSize,
  };
}

export type ImageGallery = ReturnType<typeof useImageGallery>;

export function GalleryThumbnails({ gallery, className }: { gallery: ImageGallery; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {gallery.images.map((image, index) => {
        const isActive = index === gallery.activeIndex;
        return (
          <button
            key={image.src + index}
            type="button"
            onClick={() => gallery.setActiveIndex(index)}
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
                gallery.reportNaturalSize(image.src, target.naturalWidth, target.naturalHeight);
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

export function GalleryPreview({ gallery, className }: { gallery: ImageGallery; className?: string }) {
  if (!gallery.active) return null;

  return (
    <div
      ref={gallery.frameRef}
      className={cn("relative overflow-hidden rounded-2xl bg-(--color-ivory)", className)}
      style={{
        height: gallery.frameHeight > 0 ? gallery.frameHeight : undefined,
        maxHeight: gallery.maxPreviewHeight,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={gallery.active.src}
          role="img"
          aria-label={gallery.active.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-0 rounded-2xl bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${gallery.active.src})`,
            backgroundPosition: gallery.active.focalPoint ?? "center",
          }}
        />
      </AnimatePresence>
    </div>
  );
}
