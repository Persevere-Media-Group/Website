import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Generic image gallery: large preview on top, click-to-swap thumbnail row
// below. Carries no content of its own, callers supply the images.
// ---------------------------------------------------------------------------

export type GalleryImage = {
  src: string;
  alt: string;
};

export type ImageGalleryProps = {
  images: GalleryImage[];
  className?: string;
  initialIndex?: number;
};

export function ImageGallery({ images, className, initialIndex = 0 }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  if (images.length === 0) return null;

  const active = images[activeIndex];

  return (
    <div className={cn("flex w-full max-w-3xl flex-col items-center gap-4", className)}>
      <div className="w-full overflow-hidden rounded-2xl bg-(--color-ivory)">
        <AnimatePresence mode="wait">
          <motion.img
            key={active.src}
            src={active.src}
            alt={active.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="aspect-4/3 w-full object-cover"
          />
        </AnimatePresence>
      </div>

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
                "h-14 cursor-pointer overflow-hidden rounded-xl outline-offset-2 transition focus-visible:outline-2 focus-visible:outline-(--color-terracotta) md:h-24",
                isActive
                  ? "ring-2 ring-(--color-terracotta) ring-offset-2 ring-offset-(--color-ivory)"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
