import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ThreeDCard from "@/ui-components/primitive/3d-card";
import { DisplayHeading } from "@/ui-components/custom/display-heading";

// Gap between cards - also applied as the track's gap-6 Tailwind class below,
// kept as a JS constant too since the centering/slide math needs it as a number.
const GAP = 24;
// Sane pre-measurement default (roughly max-w-5xl minus the section's px-4),
// used for exactly one frame before the ResizeObserver below reports the
// real viewport width.
const FALLBACK_VIEWPORT_WIDTH = 992;
// Minimum horizontal finger travel before a touch is treated as a swipe
// rather than an attempt to scroll the page or just a tap.
const SWIPE_THRESHOLD = 40;

// ---------------------------------------------------------------------------
// Generic testimonials carousel. Carries no content of its own, callers
// supply the quotes via the `testimonials` prop.
// ---------------------------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
  /** 1-5, omit to hide the star row entirely */
  rating?: number;
};

function QuoteMark() {
  return (
    <svg
      width="36"
      height="32"
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-(--color-amber-gold)"
    >
      <path
        d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
        fill="currentColor"
      />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={filled ? "text-(--color-amber-gold)" : "text-(--color-oxblood)/15"}
    >
      <path
        d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
        fill="currentColor"
      />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Width comes from --card-w, a CSS variable the carousel below sets on the
// track (computed as half the viewport, so the centered card plus a half
// card peeking on each side exactly fill it - see the centering math in
// Testimonials). Height is deliberately NOT fixed: every card is h-full
// through this whole chain, so the track's default flex stretch (align-items:
// stretch on a row-direction flex container) sizes every card to match the
// tallest testimonial's natural content height - no more, no less - instead
// of a hand-picked px value that overshoots shorter quotes. Because that's
// content-driven rather than a hardcoded breakpoint pair, it also self-
// adjusts for narrower cards wrapping the same quote into more lines (no
// separate mobile/desktop height needed). The line-clamps below stay as a
// safety net against a future pathologically long quote. overflow-hidden
// (rather than -visible) clips each card's drop shadow at its own edge, so
// an unclipped shadow doesn't bleed into the peeking neighbour card next to it.
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <ThreeDCard
      innerClassName="h-full w-(--card-w) rounded-3xl overflow-hidden"
      enableGlow={false}
      enableShadow={false}
      enableBorder={false}
    >
      <div className="flex h-full w-(--card-w) flex-col items-start gap-3 rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-6 shadow-[0_12px_44px_-18px_rgba(74,31,29,0.25)]">
        <QuoteMark />

        {testimonial.rating != null && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} filled={i < testimonial.rating!} />
            ))}
          </div>
        )}

        <p className="mt-1 line-clamp-18 text-[clamp(0.9rem,1.4vw,0.98rem)] leading-relaxed text-(--color-oxblood)/80 sm:line-clamp-9">
          {testimonial.quote}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="size-18 shrink-0 rounded-full border-2 border-(--color-terracotta) object-cover"
            />
          ) : (
            <span className="flex size-18 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-lg font-bold text-(--color-terracotta)">
              {initials(testimonial.name)}
            </span>
          )}
          <div className="flex min-h-16 flex-col justify-center">
            <p className="font-bold text-(--color-oxblood)">{testimonial.name}</p>
            {testimonial.role && (
              <p className="line-clamp-2 text-sm text-(--color-oxblood)/60">{testimonial.role}</p>
            )}
          </div>
        </div>
      </div>
    </ThreeDCard>
  );
}

export function Testimonials({
  testimonials,
  heading = "What people say",
  subheading,
  headingClassName,
  className = "",
}: {
  testimonials: Testimonial[];
  heading?: ReactNode;
  subheading?: ReactNode;
  headingClassName?: string;
  className?: string;
}) {
  const n = testimonials.length;

  // Rendered 3 copies back-to-back so there are always real cards to slide to
  // on either side, however far someone clicks; `index` starts in the middle
  // copy. After each step lands right at the edge of that middle copy, it
  // snaps (transition switched off for that one render) back to the
  // equivalent spot n cards over, so clicking never runs out of track and
  // never shows a visible jump - a click just always moves exactly one card.
  const track = [...testimonials, ...testimonials, ...testimonials];
  const [index, setIndex] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(FALLBACK_VIEWPORT_WIDTH);
  // Touch start point for swipe detection, read fresh on touchend rather than
  // kept in state - a touch gesture doesn't need a re-render until it's over.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Re-measures on resize (a ResizeObserver, not a window resize listener,
  // since this element's width can change from layout causes other than the
  // viewport resizing too, e.g. the page's own font finishing load).
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (n === 0) return null;

  // The centered card should fill the viewport with exactly half a card
  // peeking on each side: halfCard + gap + fullCard + gap + halfCard =
  // viewportWidth, and a half-card is half a full card, so cardWidth =
  // (viewportWidth - 2*gap) / 2. `step` is the distance between consecutive
  // cards. `centerOffset` is the general "center a box of this width within
  // a container of that width" formula - deliberately NOT the halfCard+gap
  // shortcut implied above, since that shortcut only centers correctly when
  // cardWidth actually equals its natural (viewportWidth - 2*gap)/2 value;
  // once the floor below clamps cardWidth on a narrow screen, that shortcut
  // and the true centering formula diverge, which showed up as a lopsided
  // peek (much more of the previous card visible than the next one).
  const cardWidth = Math.max(viewportWidth / 2 - GAP, 200);
  const step = cardWidth + GAP;
  const centerOffset = (viewportWidth - cardWidth) / 2;

  const go = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimate(true);
    setIndex((i) => i + dir);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (index >= 2 * n || index < n) {
      setAnimate(false);
      setIndex(n + ((((index - n) % n) + n) % n));
    }
  };

  // Swipe is the second, touch-native way to move the carousel alongside the
  // arrow buttons - both just call the same `go`, so a swipe always steps
  // exactly one card with the same animation an arrow click would give.
  // Threshold-based (checked once on touchend) rather than a live drag-follow,
  // so it can't fall out of sync with the arrow-driven index math above.
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Ignore mostly-vertical drags so scrolling the page past the carousel
    // still works.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  const arrowButtonClasses =
    "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-(--color-oxblood)/20 bg-(--color-ivory-raised) text-(--color-oxblood) shadow-[0_8px_24px_-10px_rgba(74,31,29,0.3)] transition-colors hover:border-(--color-terracotta) hover:text-(--color-terracotta)";

  return (
    <section className={`px-4 py-4 text-center ${className}`}>
      <DisplayHeading subheading={subheading} headingClassName={headingClassName}>
        {heading}
      </DisplayHeading>

      {/* Arrows sit in their own row below the carousel (never over a card,
          at any viewport width) rather than beside it - there's no side
          gutter to put them in without eating into the half-card peek the
          centering math above is aiming for. */}
      <div className="relative mx-auto mt-16 max-w-5xl">
        <div
          ref={viewportRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="touch-pan-y overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex gap-6 py-2 text-left ${animate ? "transition-transform duration-500 ease-out" : ""}`}
            style={
              {
                transform: `translateX(${centerOffset - index * step}px)`,
                "--card-w": `${cardWidth}px`,
              } as CSSProperties
            }
          >
            {track.map((testimonial, i) => (
              <TestimonialCard key={i} testimonial={testimonial} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className={arrowButtonClasses}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className={arrowButtonClasses}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
