import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "motion/react";
import { PopupModal } from "react-calendly";
import { Phone } from "lucide-react";

// same link used in HeroSection/CtaBanner, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

const STORAGE_KEY = "floating-cta-position";
const EDGE_MARGIN = 8; // px, keeps it fully clickable rather than flush against the very edge

// snappy but soft, matching the "smooth spring" feel rather than a rigid ease curve
const SNAP_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

interface Position {
  x: number;
  y: number;
}

// keeps the button pinned to whichever edge of the screen it's nearest to, sliding
// freely along that edge (any point along it, not fixed corners), rather than being
// clampable to sit anywhere including the middle of the screen
function snapToNearestEdge(pos: Position, width: number, height: number): Position {
  const distLeft = pos.x;
  const distRight = window.innerWidth - (pos.x + width);
  const distTop = pos.y;
  const distBottom = window.innerHeight - (pos.y + height);
  const minDist = Math.min(distLeft, distRight, distTop, distBottom);

  const clampedX = Math.min(
    Math.max(pos.x, EDGE_MARGIN),
    Math.max(window.innerWidth - width - EDGE_MARGIN, EDGE_MARGIN)
  );
  const clampedY = Math.min(
    Math.max(pos.y, EDGE_MARGIN),
    Math.max(window.innerHeight - height - EDGE_MARGIN, EDGE_MARGIN)
  );

  if (minDist === distLeft) return { x: EDGE_MARGIN, y: clampedY };
  if (minDist === distRight) return { x: window.innerWidth - width - EDGE_MARGIN, y: clampedY };
  if (minDist === distTop) return { x: clampedX, y: EDGE_MARGIN };
  return { x: clampedX, y: window.innerHeight - height - EDGE_MARGIN };
}

function getStoredPosition(): Position | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
  } catch {
    // ignore malformed storage, fall through to default
  }
  return null;
}

export function FloatingCta() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // driven directly by the drag gesture, then spring-animated to the snapped
  // edge position on drop, rather than plain React state (which would fight
  // the drag gesture's own per-frame transform updates)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const snapTo = (pos: Position) => {
    animate(x, pos.x, SNAP_SPRING);
    animate(y, pos.y, SNAP_SPRING);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  };

  // default to bottom-right on first ever load (nothing in storage yet), computed once
  // the button has actually rendered so its real size is known
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stored = getStoredPosition();
    const target = snapToNearestEdge(
      stored ?? {
        x: window.innerWidth - rect.width - 24,
        y: window.innerHeight - rect.height - 24,
      },
      rect.width,
      rect.height
    );
    x.set(target.x);
    y.set(target.y);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- x/y are stable MotionValue refs
  }, []);

  // re-clamp on resize, so shrinking the window can't leave it stranded off-screen.
  // Mobile browsers fire `resize` constantly while scrolling as the address bar
  // collapses/expands, which only ever changes innerHeight, not innerWidth. Reacting
  // to those made the button visibly jitter mid-scroll and, since the position was
  // re-saved on every firing, could overwrite the user's placed spot with whatever
  // got clamped during a transient (mid-scroll) viewport height. Only a genuine width
  // change (window resize, orientation change) should trigger a re-snap.
  const lastWidthRef = useRef(window.innerWidth);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth === lastWidthRef.current) return;
      lastWidthRef.current = window.innerWidth;
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      snapTo(snapToNearestEdge({ x: rect.left, y: rect.top }, rect.width, rect.height));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- x/y are stable MotionValue refs
  }, []);

  // Motion's tap and drag gestures are recognised independently, so a real drag
  // can still leave a trailing tap event on release. This flag is set the moment
  // a drag actually starts and consumed by the next tap, so that a drag never
  // also opens the popup, while a genuine click (no drag) still does
  const draggedRef = useRef(false);

  const handleDragStart = () => {
    draggedRef.current = true;
  };

  const handleDragEnd: (
    event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo
  ) => void = () => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    snapTo(snapToNearestEdge({ x: rect.left, y: rect.top }, rect.width, rect.height));
  };

  const handleTap = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setIsCalendlyOpen(true);
  };

  return (
    <>
      {/* invisible, full-viewport drag boundary, inset by EDGE_MARGIN so the button
          can never be dragged flush against the very edge of the screen */}
      <div ref={constraintsRef} className="pointer-events-none fixed inset-2" aria-hidden />

      <motion.button
        ref={buttonRef}
        type="button"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        whileDrag={{ scale: 1.08 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        // z-[60] is deliberately higher than the fixed nav/header (z-50) and the
        // ScrollProgress bar, otherwise wherever this overlaps them, clicks get
        // intercepted by whatever's stacked on top rather than reaching this button
        className="fixed top-0 left-0 z-60 flex cursor-grab touch-none items-center gap-2 rounded-full bg-(--color-amber-gold) px-5 py-3 text-sm font-bold whitespace-nowrap text-(--color-oxblood) shadow-[0_8px_24px_rgba(0,0,0,0.25)] select-none active:cursor-grabbing"
        style={{ x, y, visibility: ready ? "visible" : "hidden" }}
      >
        <Phone className="h-4 w-4" />
        Give us a bell !
      </motion.button>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </>
  );
}
