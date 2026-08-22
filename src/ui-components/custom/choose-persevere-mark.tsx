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

// the site's recurring closing wordmark - "Choose Persevere." set in the accent
// (Pomelo) font with a hand-drawn terracotta circle around it. Used as the payoff
// beat at the end of the About page and the services pages' closing CTA.
export function ChoosePersevereMark({ className }: ChoosePersevereMarkProps) {
  // Sized deliberately larger than any viewport can hold at 1:1 (up to 6.5rem), so
  // it always wants to be as wide as its container; useAutoFitScale then shrinks
  // it down only as much as needed to avoid overflow, which is what makes it span
  // the full width on mobile while still scaling up on wider screens instead of
  // being pinned to a small fixed size.
  const markRef = useRef<HTMLParagraphElement>(null);
  const markScale = useAutoFitScale(markRef);

  return (
    <p
      ref={markRef}
      className={cn(
        "font-accent text-[clamp(2.75rem,16vw,6.5rem)] leading-none tracking-wide whitespace-nowrap text-(--color-oxblood)",
        className
      )}
      style={{ transform: `scale(${markScale})`, transformOrigin: "center" }}
    >
      {/* the ellipse rough-notation draws for "circle" is sized from the text's
          bounding box plus padding, but a wide/short line like this one still
          has its corners poke outside a symmetric ellipse - extra horizontal
          padding relative to vertical is what actually keeps the far-left/right
          characters ("C", the trailing ".") safely inside the curve */}
      <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={[20, 64, 20, 64]}>
        Choose Persevere.
      </Highlighter>
    </p>
  );
}
