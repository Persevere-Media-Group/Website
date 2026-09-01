import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { PulsatingButton } from "@/ui-components/primitive/pulsating-button";

// The site's one recurring CTA button style (amber-gold, pulsing), used for the
// "Get Started" / "Book a call" buttons on Home and the services
// pages. Wraps the primitive with the shared styling so callers only supply the
// label and onClick.
export const YellowPulsatingButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof PulsatingButton>
>(({ className, ...props }, ref) => (
  <PulsatingButton
    ref={ref}
    pulseColor="color-mix(in srgb, var(--color-amber-gold) 50%, transparent)"
    duration="1.8s"
    className={cn(
      "rounded-full bg-(--color-amber-gold) px-8 py-4 text-lg font-subtitle font-bold text-(--color-oxblood) shadow-[0_0_28px_-6px_var(--color-amber-gold)] transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-110",
      className
    )}
    {...props}
  />
));

YellowPulsatingButton.displayName = "YellowPulsatingButton";
