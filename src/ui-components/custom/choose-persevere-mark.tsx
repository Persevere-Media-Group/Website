import { useEffect, useRef, useState, type RefObject } from "react";
import { Highlighter } from "@/ui-components/primitive/highlighter";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { cn } from "@/lib/utils";

// terracotta, matches the underline/circle color used elsewhere on the site
const UNDERLINE_COLOR = "#d5573b";

// sketchy hand-drawn feel that draws itself as it scrolls into view
const MARK_PROPS = {
  triggerOnView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

interface ChoosePersevereMarkProps {
  /** extra classes (e.g. margin) - merged with the mark's own sizing/color via
   * tailwind-merge, so a className font size overrides the default */
  className?: string;
}

// rough-notation's circle is drawn as a `position: absolute` SVG overlay sized
// from the text's own box plus `padding` (64px each side, see below) - it
// doesn't contribute to the <p>'s own layout width, so a naive shrink-to-fit
// (which only measures the <p> itself) has no idea the circle exists and only
// ever sizes the *text* to fit its container, not the wider circle around it.
// That 64px-per-side gap is a bigger fraction of the whole mark's width at
// mobile's smaller clamp() size than at desktop's larger one, which is why
// only mobile actually overflows in practice - fed into each fit mechanism's
// own width multiplier to correct for it, tuned per breakpoint rather than
// shared, since a single value tuned for mobile's worse ratio would
// over-shrink desktop, which isn't overflowing and shouldn't change.
const CIRCLE_WIDTH_MULTIPLIER = { mobile: 1.62, desktop: 1 };

const TEXT_CLASS =
  "font-accent text-[clamp(2.75rem,16vw,6.5rem)] leading-none tracking-wide whitespace-nowrap text-(--color-oxblood)";

// Desktop: unchanged from the original single-variant design. useAutoFitScale
// shrinks the text via a CSS transform, which - confirmed by measuring the
// drawn circle against the text's box at both breakpoints - rough-notation
// handles correctly here because the transform barely needs to move off 1
// (desktop's clamp() text already mostly fits). Sized deliberately larger
// than any viewport can hold at 1:1 (up to 6.5rem), so it always wants to be
// as wide as its container; useAutoFitScale then shrinks it down only as
// much as needed to avoid overflow.
function TransformMark({
  className,
  wrapperClassName,
}: {
  className?: string;
  wrapperClassName: string;
}) {
  const markRef = useRef<HTMLParagraphElement>(null);
  const markScale = useAutoFitScale(markRef, CIRCLE_WIDTH_MULTIPLIER.desktop);

  return (
    // w-full is load-bearing: two of this component's three callers wrap it in
    // a `flex items-center` row, where a child with no explicit width sizes via
    // shrink-to-fit instead of filling the available cross-axis width - without
    // this, useAutoFitScale would measure that shrunk width as "available" and
    // never detect any overflow to correct for.
    <div className={cn("w-full", wrapperClassName)}>
      <p
        ref={markRef}
        className={cn("w-fit mx-auto", TEXT_CLASS, className)}
        style={{ transform: `scale(${markScale})`, transformOrigin: "center" }}
      >
        {/* the ellipse rough-notation draws for "circle" is sized from the text's
            bounding box plus padding, but a wide/short line like this one still
            has its corners poke outside a symmetric ellipse - extra horizontal
            padding relative to vertical is what actually keeps the far-left/right
            characters ("C", the trailing ".") safely inside the curve */}
        <Highlighter
          action="circle"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
          padding={[20, 64, 20, 64]}
        >
          Choose Persevere.
        </Highlighter>
      </p>
    </div>
  );
}

// Measures the *unscaled* font-size/width TEXT_CLASS's clamp() resolves to at
// the current viewport, then returns the px font-size needed to fit `ref`'s
// parent - as an actual font-size, not a scale ratio, so the caller never has
// to apply a CSS transform (see FontSizeMark's comment for why that matters
// here). `ref` must point to an element carrying TEXT_CLASS that is NEVER
// itself resized by the returned value - reading this element's own
// (self-inflicted) shrunk size back as if it were "natural" on the next
// measurement would compound the shrink every cycle, never recovering when
// the viewport grows back. That's why FontSizeMark below measures a separate,
// untouched clone rather than the visible element it's sizing.
function useAutoFitFontSize(ref: RefObject<HTMLElement | null>, widthMultiplier: number) {
  const [fontSizePx, setFontSizePx] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const parent = el.parentElement;
      if (!parent) return;
      const naturalFontSize = parseFloat(getComputedStyle(el).fontSize);
      const naturalWidth = el.scrollWidth;
      const availableWidth = parent.clientWidth;
      if (!naturalFontSize || !naturalWidth || !availableWidth) return;
      const ratio = Math.min(1, availableWidth / (naturalWidth * widthMultiplier));
      const next = naturalFontSize * ratio;
      setFontSizePx((prev) => (prev !== null && Math.abs(next - prev) < 0.5 ? prev : next));
    };

    fit();
    document.fonts.ready.then(fit);
    const settleTimeout1 = setTimeout(fit, 150);
    const settleTimeout2 = setTimeout(fit, 500);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref, widthMultiplier]);

  return fontSizePx;
}

// Mobile: sizes the text with a real font-size instead of useAutoFitScale's
// CSS transform. rough-notation positions the circle's SVG overlay using
// getBoundingClientRect() math that doesn't correctly account for a
// non-identity transform on an ancestor - confirmed by measuring the drawn
// circle against the text's own box: desktop (transform barely off 1, its
// clamp() text mostly already fits) came out symmetric, mobile (a real ~0.7
// scale, to fit both the smaller clamp() floor and the circle's overflow
// correction) came out badly off-center, cutting the last few letters out of
// the circle entirely. A real font-size sidesteps the whole bug class: the
// element's own layout box already *is* its final visual size, so there's no
// transform for rough-notation to get wrong.
//
// key={fontSizePx} on the Highlighter remounts it whenever the fit value
// changes, forcing a fresh draw against the new geometry - unlike the
// transform version, changing a real font-size is a layout change, not a
// repaint, and the annotation has no other way to notice one happened (its
// own resize handling only listens for an actual window resize event).
function FontSizeMark({
  className,
  wrapperClassName,
}: {
  className?: string;
  wrapperClassName: string;
}) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const fontSizePx = useAutoFitFontSize(measureRef, CIRCLE_WIDTH_MULTIPLIER.mobile);

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <p
        ref={measureRef}
        aria-hidden
        className={cn("pointer-events-none invisible absolute", TEXT_CLASS)}
      >
        Choose Persevere.
      </p>
      <p
        className={cn("w-fit mx-auto", TEXT_CLASS, className)}
        style={fontSizePx ? { fontSize: `${fontSizePx}px` } : undefined}
      >
        {/* Smaller padding than TransformMark's (desktop) - the fit is tuned
            (via CIRCLE_WIDTH_MULTIPLIER.mobile) to hold the whole circle,
            padding included, within the viewport at mobile's smaller sizes,
            so a tighter padding here leaves more of that budget for the text
            itself to render bigger, without growing the circle beyond what
            the fit already accounts for. */}
        <Highlighter
          key={fontSizePx}
          action="circle"
          color={UNDERLINE_COLOR}
          {...MARK_PROPS}
          padding={[20, 44, 20, 44]}
        >
          Choose Persevere.
        </Highlighter>
      </p>
    </div>
  );
}

// the site's recurring closing wordmark - "Choose Persevere." set in the accent
// (Pomelo) font with a hand-drawn terracotta circle around it. Used as the payoff
// beat at the end of the About page and the services pages' closing CTA.
//
// Rendered twice (one per breakpoint, toggled with hidden/md:hidden) with two
// different fit mechanisms, not just two size values on one - see
// TransformMark's and FontSizeMark's comments for why mobile can't reuse
// desktop's CSS-transform approach.
export function ChoosePersevereMark({ className }: ChoosePersevereMarkProps) {
  return (
    <>
      <TransformMark className={className} wrapperClassName="hidden md:block" />
      <FontSizeMark className={className} wrapperClassName="md:hidden" />
    </>
  );
}
