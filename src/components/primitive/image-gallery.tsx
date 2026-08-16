import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Generic image gallery: click-to-swap thumbnail row on top, large preview
// below. Carries no content of its own, callers supply the images.
//
// The preview frame has no fixed aspect ratio - it sizes itself to whatever
// image is active (landscape or portrait), capped by maxPreviewHeight so a
// tall portrait doesn't take over the page. Thumbnails stay uniform squares
// regardless of the source image's shape, object-cover cropping to whatever
// `focalPoint` each image specifies (or the center by default) so the crop
// lands on the recognizable part of the shot rather than a shrunk whole frame.
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
  /** Caps how tall the preview frame can grow for very portrait images. */
  maxPreviewHeight?: string;
};

export function ImageGallery({
  images,
  className,
  initialIndex = 0,
  maxPreviewHeight = "34rem",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  if (images.length === 0) return null;

  const active = images[activeIndex];

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
              />
            </button>
          );
        })}
      </div>

      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-2xl bg-(--color-ivory)"
        style={{ maxHeight: maxPreviewHeight }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active.src}
            src={active.src}
            alt={active.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full object-contain"
            style={{ maxHeight: maxPreviewHeight }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
