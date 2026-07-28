import { useEffect, useRef, useState } from "react";
import { PopupModal } from "react-calendly";

// same link used in HeroSection/CtaBanner, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

const STORAGE_KEY = "floating-cta-position";
const EDGE_MARGIN = 8; // px, keeps it fully clickable rather than flush against the very edge

// how far the pointer has to move before a press counts as a drag rather than a click,
// without this, every click would also register as a (zero-distance) drag and the
// popup would never open
const DRAG_THRESHOLD = 6;

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
  const [position, setPosition] = useState<Position | null>(getStoredPosition);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startRef = useRef({ pointerX: 0, pointerY: 0, elX: 0, elY: 0 });

  // default to bottom-right on first ever load (nothing in storage yet), computed once
  // the button has actually rendered so its real size is known
  useEffect(() => {
    if (position !== null) return;
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(
      snapToNearestEdge(
        { x: window.innerWidth - rect.width - 24, y: window.innerHeight - rect.height - 24 },
        rect.width,
        rect.height
      )
    );
  }, [position]);

  // re-clamp on resize, so shrinking the window can't leave it stranded off-screen
  useEffect(() => {
    const onResize = () => {
      const el = buttonRef.current;
      if (!el || !position) return;
      const rect = el.getBoundingClientRect();
      setPosition((prev) => (prev ? snapToNearestEdge(prev, rect.width, rect.height) : prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [position]);

  useEffect(() => {
    if (position) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      elX: rect.left,
      elY: rect.top,
    };

    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - startRef.current.pointerX;
    const dy = e.clientY - startRef.current.pointerY;

    if (!movedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      movedRef.current = true;
    }
    if (!movedRef.current) return;

    setPosition({ x: startRef.current.elX + dx, y: startRef.current.elY + dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!draggingRef.current || !el) return;
    draggingRef.current = false;
    el.releasePointerCapture(e.pointerId);

    if (!movedRef.current) {
      // never actually dragged, treat as a genuine click
      setIsCalendlyOpen(true);
      return;
    }

    // rests exactly where it was dropped, just nudged back on-screen if needed,
    // no snapping to fixed corners
    const rect = el.getBoundingClientRect();
    setPosition((prev) => (prev ? snapToNearestEdge(prev, rect.width, rect.height) : prev));
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // z-[60] is deliberately higher than the fixed nav/header (z-50) and the
        // ScrollProgress bar, otherwise wherever this overlaps them, clicks get
        // intercepted by whatever's stacked on top rather than reaching this button
        className="fixed z-60 cursor-grab touch-none select-none whitespace-nowrap rounded-full bg-(--color-amber-gold) px-5 py-3 text-sm font-bold text-(--color-oxblood) shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow active:cursor-grabbing active:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        style={position ? { left: position.x, top: position.y } : { visibility: "hidden" }}
      >
        📞 Give us a bell!
      </button>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </>
  );
}
