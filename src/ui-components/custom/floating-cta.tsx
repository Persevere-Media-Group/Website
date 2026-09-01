import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { PopupModal } from "react-calendly";
import { Phone } from "lucide-react";
import { CALENDLY_URL } from "@/container-contents/services-shared";

const STORAGE_KEY = "floating-cta-position";
const EDGE_MARGIN = 8; // px, keeps it fully clickable rather than flush against the very edge

// snappy but soft, matching the "smooth spring" feel rather than a rigid ease curve
const SNAP_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;
const SCALE_SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;

// how far (px) a press has to move before it counts as a drag rather than a tap
const DRAG_THRESHOLD = 6;
// rubber-band resistance applied to movement past the edge bounds, matching
// the "give" Motion's old dragElastic={0.12} had
const DRAG_ELASTIC = 0.12;

interface Position {
  x: number;
  y: number;
}

interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
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

// Pixel bounds for the `x`/`y` motion values themselves (which are measured from
// the button's static top-left-origin position), matching the same edge math as
// snapToNearestEdge.
function computeBounds(width: number, height: number): Bounds {
  return {
    top: EDGE_MARGIN,
    left: EDGE_MARGIN,
    right: Math.max(window.innerWidth - width - EDGE_MARGIN, EDGE_MARGIN),
    bottom: Math.max(window.innerHeight - height - EDGE_MARGIN, EDGE_MARGIN),
  };
}

function withElastic(value: number, min: number, max: number): number {
  if (value < min) return min - (min - value) * DRAG_ELASTIC;
  if (value > max) return max + (value - max) * DRAG_ELASTIC;
  return value;
}

export function FloatingCta() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Plain pixel bounds, recomputed only by this component's own effects below -
  // see the drag handling further down for why this button doesn't use Motion's
  // built-in `drag` gesture at all.
  const boundsRef = useRef<Bounds>(computeBounds(0, 0));
  const setBounds = (b: Bounds) => {
    boundsRef.current = b;
  };

  // driven directly by the drag gesture, then spring-animated to the snapped
  // edge position on drop, rather than plain React state (which would fight
  // the drag gesture's own per-frame transform updates)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

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
    setBounds(computeBounds(rect.width, rect.height));
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
      setBounds(computeBounds(rect.width, rect.height));
      snapTo(snapToNearestEdge({ x: rect.left, y: rect.top }, rect.width, rect.height));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- x/y are stable MotionValue refs
  }, []);

  // Dragging is handled by hand with plain pointer events rather than Motion's
  // `drag` gesture. Motion's `drag` + `dragConstraints` re-validates the
  // draggable's position against the viewport on events outside this
  // component's control - on iOS that includes the address bar's own
  // visualViewport resize/scroll as it collapses/expands mid-scroll, which
  // is distinct from (and not caught by) the width-only `resize` guard above.
  // That was still snapping this button to a "corrected" position mid-scroll
  // on mobile even once dragConstraints was switched to a plain object.
  // Handling pointer events ourselves means nothing but this component's own
  // code can ever move `x`/`y`, so a scroll can never touch them.
  const pointerState = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    dragging: boolean;
  } | null>(null);

  // A real drag shouldn't also open the popup. pointerup clears pointerState
  // before the browser's own trailing "click" event fires, so this flag - set
  // the moment a drag crosses the threshold, consumed by that click - outlives
  // pointerState for exactly as long as it needs to.
  const didDragRef = useRef(false);

  // Mirrors what whileHover/whileTap/whileDrag used to do declaratively:
  // dragging beats pressed beats hovered beats idle.
  const isHoveringRef = useRef(false);
  const applyScale = (dragging: boolean) => {
    const target = dragging ? 1.08 : pointerState.current ? 0.95 : isHoveringRef.current ? 1.05 : 1;
    animate(scale, target, SCALE_SPRING);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    isHoveringRef.current = true;
    applyScale(false);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    isHoveringRef.current = false;
    if (!pointerState.current?.dragging) applyScale(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerState.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originX: x.get(),
      originY: y.get(),
      dragging: false,
    };
    applyScale(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const state = pointerState.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const dx = e.clientX - state.startClientX;
    const dy = e.clientY - state.startClientY;

    if (!state.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      state.dragging = true;
      didDragRef.current = true;
      e.currentTarget.setPointerCapture(state.pointerId);
      applyScale(true);
    }

    const bounds = boundsRef.current;
    x.set(withElastic(state.originX + dx, bounds.left, bounds.right));
    y.set(withElastic(state.originY + dy, bounds.top, bounds.bottom));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const state = pointerState.current;
    if (!state || state.pointerId !== e.pointerId) return;
    pointerState.current = null;
    if (!state.dragging) {
      applyScale(false);
      return;
    }
    applyScale(false);
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    snapTo(snapToNearestEdge({ x: rect.left, y: rect.top }, rect.width, rect.height));
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    const state = pointerState.current;
    if (!state || state.pointerId !== e.pointerId) return;
    pointerState.current = null;
    applyScale(false);
  };

  const handleClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setIsCalendlyOpen(true);
  };

  return (
    <>
      {/* Two things fix iOS Safari's fixed-position scroll jitter here:
          1. The drag transform lives on a plain (statically positioned) child
             rather than on this `fixed` element itself, so this element's own
             position is never recomputed frame-to-frame - just the child's
             ordinary transform, which is cheap. Net position is identical either
             way since this wrapper shrink-wraps to the button with no offset
             of its own.
          2. `translateZ(0)` below is a no-op visually, but it forces this fixed
             element onto its own GPU compositing layer up front. Without it,
             iOS Safari can leave a plain `position: fixed` element on the main
             thread's paint layer, so it visibly lags behind the viewport by a
             frame or two during scroll (worse as the dynamic toolbar
             collapses/expands) instead of being pinned by the compositor. */}
      {/* z-60 is deliberately higher than the fixed nav/header (z-50) and the
          ScrollProgress bar, otherwise wherever this overlaps them, clicks get
          intercepted by whatever's stacked on top rather than reaching this button.
          pointer-events-none here (re-enabled on the button below) because this
          wrapper's own untransformed layout box sits at the top-left origin - the
          button only ends up elsewhere visually via the drag/position transform - so
          without this, that empty top-left box would silently swallow clicks meant
          for whatever's underneath it. */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-60"
        style={{
          visibility: ready ? "visible" : "hidden",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <motion.button
          ref={buttonRef}
          type="button"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={handleClick}
          className="pointer-events-auto flex cursor-grab touch-none items-center gap-2 rounded-full bg-(--color-amber-gold) px-5 py-3 text-base font-subtitle font-bold whitespace-nowrap text-(--color-oxblood) shadow-[0_8px_24px_rgba(0,0,0,0.25)] select-none active:cursor-grabbing md:text-lg"
          style={{ x, y, scale }}
        >
          <Phone className="h-4 w-4" />
          Book a call !
        </motion.button>
      </div>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </>
  );
}
