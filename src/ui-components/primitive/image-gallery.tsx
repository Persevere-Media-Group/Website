import { useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ImageGallery } from "@/hooks/use-image-gallery";

// ---------------------------------------------------------------------------
// Click-to-swap image gallery: <GalleryThumbnails> and <GalleryPreview>, two
// presentational pieces sharing one `useImageGallery()` (src/hooks) result so
// a caller can lay them out however it needs - stacked, side by side,
// thumbnails paired with unrelated content.
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

export function GalleryThumbnails({
  gallery,
  className,
}: {
  gallery: ImageGallery;
  className?: string;
}) {
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

export function GalleryPreview({
  gallery,
  className,
}: {
  gallery: ImageGallery;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reportFrameWidth = gallery.reportFrameWidth;

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => reportFrameWidth(frame.clientWidth);
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(frame);
    return () => resizeObserver.disconnect();
  }, [reportFrameWidth]);

  if (!gallery.active) return null;

  return (
    <div
      ref={frameRef}
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
