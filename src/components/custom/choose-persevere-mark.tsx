import { Highlighter } from "@/components/primitive/highlighter";
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
  /** sizing/spacing (e.g. font size, margin) - the mark itself is fixed: font-accent,
   * centered, circled in terracotta */
  className?: string;
}

// the site's recurring closing wordmark - "Choose Persevere." set in the accent
// (Pomelo) font with a hand-drawn orange circle around it. Used as the payoff beat
// at the end of the About page and the services pages' closing CTA.
export function ChoosePersevereMark({ className }: ChoosePersevereMarkProps) {
  return (
    <p className={cn("font-accent text-center leading-none tracking-wide text-(--color-oxblood)", className)}>
      {/* wider padding than the shared MARK_PROPS default (2px) so the circle sits
          further out from the letters instead of cutting across them */}
      <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={28}>
        Choose Persevere.
      </Highlighter>
    </p>
  );
}
