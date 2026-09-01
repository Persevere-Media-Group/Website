import { useRef } from "react";
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
// doesn't contribute to the <p>'s own layout width, so useAutoFitScale's
// shrink-to-fit (which measures the <p> itself) has no idea the circle exists
// and only ever sizes the *text* to fit its container, not the wider circle
// around it. That 64px-per-side gap is a bigger fraction of the whole mark's
// width at mobile's smaller clamp() size than at desktop's larger one, which
// is why only mobile actually overflows in practice - passed as
// useAutoFitScale's widthMultiplier to correct for it, tuned per breakpoint
// rather than shared, since a single value tuned for mobile's worse ratio
// would over-shrink desktop, which isn't overflowing and shouldn't change.
const CIRCLE_WIDTH_MULTIPLIER = { mobile: 1.35, desktop: 1 };

function Mark({
  className,
  wrapperClassName,
  widthMultiplier,
}: {
  className?: string;
  wrapperClassName: string;
  widthMultiplier: number;
}) {
  // Sized deliberately larger than any viewport can hold at 1:1 (up to 6.5rem), so
  // it always wants to be as wide as its container; useAutoFitScale then shrinks
  // it down only as much as needed to avoid overflow, which is what makes it span
  // the full width on mobile while still scaling up on wider screens instead of
  // being pinned to a small fixed size.
  const markRef = useRef<HTMLParagraphElement>(null);
  const markScale = useAutoFitScale(markRef, widthMultiplier);

  return (
    // w-full is load-bearing: two of this component's three callers wrap it in
    // a `flex items-center` row, where a child with no explicit width sizes via
    // shrink-to-fit instead of filling the available cross-axis width - without
    // this, useAutoFitScale would measure that shrunk width as "available" and
    // never detect any overflow to correct for.
    <div className={cn("w-full", wrapperClassName)}>
      <p
        ref={markRef}
        className={cn(
          "w-fit mx-auto font-accent text-[clamp(2.75rem,16vw,6.5rem)] leading-none tracking-wide whitespace-nowrap text-(--color-oxblood)",
          className
        )}
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

// the site's recurring closing wordmark - "Choose Persevere." set in the accent
// (Pomelo) font with a hand-drawn terracotta circle around it. Used as the payoff
// beat at the end of the About page and the services pages' closing CTA.
//
// Rendered twice (one per breakpoint, toggled with hidden/md:hidden) rather
// than made responsive in place: useAutoFitScale returns one scale number from
// one widthMultiplier, so a single instance can't apply desktop's correct (1x)
// and mobile's correct (1.35x) circle-overflow correction at once - see
// CIRCLE_WIDTH_MULTIPLIER above.
export function ChoosePersevereMark({ className }: ChoosePersevereMarkProps) {
  return (
    <>
      <Mark
        className={className}
        wrapperClassName="hidden md:block"
        widthMultiplier={CIRCLE_WIDTH_MULTIPLIER.desktop}
      />
      <Mark
        className={className}
        wrapperClassName="md:hidden"
        widthMultiplier={CIRCLE_WIDTH_MULTIPLIER.mobile}
      />
    </>
  );
}
