"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface OrbitCarouselItem {
  id: string | number;
  name: string;
  // optional second line under the name, e.g. a category, tagline, or industry, not tied to any specific field like "role"
  subtitle?: string;
  // optional, falls back to an initials circle when not provided, useful for placeholder entries with no real logo yet
  image?: string;
}

interface OrbitCarouselProps {
  items: OrbitCarouselItem[];
  className?: string;
}

// turns "Brand One" into "BO", or the first two letters of a single word if there's no space
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const safeImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
};

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkScreenSize = (): void => setIsMobile(window.innerWidth < breakpoint);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

// renders either the real image, or an initials circle if no image was provided,
// these render as normal DOM elements (unlike the IconCloud's canvas approach), so
// CSS custom properties like var(--color-oxblood) resolve normally here, no workaround needed
function ItemAvatar({ item, className }: { item: OrbitCarouselItem; className?: string }) {
  if (item.image) {
    return <img src={item.image} alt={item.name} onError={safeImage} className={className} />;
  }
  return (
    <div
      className={`${className} flex items-center justify-center bg-(--color-ivory) font-bold text-(--color-oxblood)`}
    >
      {getInitials(item.name)}
    </div>
  );
}

export function OrbitCarousel({ items, className }: OrbitCarouselProps) {
  // deliberately NOT wrapped with modulo here, this is a continuous counter that can grow
  // past items.length or go negative, so every next()/prev() step is always exactly one
  // increment. wrapping this with % is what caused the "long way around" jump between the
  // last and first item, since 7 -> 0 via modulo is a jump of -7, not the +1 it visually is.
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();

  const n = items.length;
  // the actual 0..n-1 index into the items array, only computed at the point we need to
  // look up real data (which item's name/image to show), never used for rotation math
  const realIndex = ((activeIndex % n) + n) % n;
  const activeItem = items[realIndex];

  const containerRadius = isMobile ? 130 : 200;
  const profileSize = isMobile ? 60 : 80;
  const containerSize = containerRadius * 2 + 100;

  const getRotation = React.useCallback(
    (index: number): number => (index - activeIndex) * (360 / n),
    [activeIndex, n]
  );

  const next = () => setActiveIndex((i) => i + 1);
  const prev = () => setActiveIndex((i) => i - 1);

  const handleItemClick = React.useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        const currentReal = ((current % n) + n) % n;
        if (index === currentReal) return current;

        // shortest-path diff: instead of always rotating "forward" to reach the clicked
        // item, pick whichever direction (positive or negative) covers less distance
        let diff = index - currentReal;
        if (diff > n / 2) diff -= n;
        else if (diff <= -n / 2) diff += n;

        return current + diff;
      });
    },
    [n]
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={`relative flex min-h-100 flex-col items-center p-4 ${className ?? ""}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* orbit ring */}
        <div
          className="absolute rounded-full border border-(--color-oxblood)/20"
          style={{
            width: containerRadius * 2,
            height: containerRadius * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* active item card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="z-10 w-48 rounded-xl border border-(--color-oxblood)/10 bg-(--color-ivory) p-3 text-center shadow-xl md:w-52 md:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ItemAvatar
                item={activeItem}
                className="mx-auto -mt-10 h-16 w-16 rounded-full border-4 border-(--color-ivory) object-cover shadow-md md:-mt-12 md:h-20 md:w-20"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <h2 className="mt-2 text-base font-bold text-(--color-oxblood) md:text-lg">
                {activeItem.name}
              </h2>
              {activeItem.subtitle && (
                <p className="mt-1 truncate text-xs text-(--color-oxblood)/70 md:text-sm">
                  {activeItem.subtitle}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-3 flex items-center justify-center space-x-2"
            >
              <button
                onClick={prev}
                aria-label="Previous"
                className="rounded-full bg-(--color-oxblood)/5 p-1.5 transition-colors hover:bg-(--color-oxblood)/10"
              >
                <ChevronLeft size={16} className="text-(--color-oxblood)" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="rounded-full bg-(--color-oxblood)/5 p-1.5 transition-colors hover:bg-(--color-oxblood)/10"
              >
                <ChevronRight size={16} className="text-(--color-oxblood)" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* orbiting items with counter-rotation to keep each avatar upright */}
        {items.map((item, i) => {
          const rotation = getRotation(i);
          return (
            <motion.div
              key={item.id}
              animate={{
                transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
              }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: profileSize,
                height: profileSize,
                position: "absolute",
                top: `calc(50% - ${profileSize / 2}px)`,
                left: `calc(50% - ${profileSize / 2}px)`,
              }}
            >
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full w-full"
              >
                <motion.button
                  onClick={() => handleItemClick(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={item.name}
                  className="h-full w-full cursor-pointer rounded-full"
                >
                  <ItemAvatar
                    item={item}
                    className={`h-full w-full rounded-full object-cover transition-all duration-300 ${
                      i === realIndex
                        ? "border-4 border-(--color-terracotta) shadow-lg"
                        : "border-2 border-(--color-oxblood)/20 hover:border-(--color-terracotta)/60"
                    }`}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
