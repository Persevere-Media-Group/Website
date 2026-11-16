import type { Transition } from "motion/react";
import { POPOVER_SPRING, POPOVER_START_SCALE } from "@/lib/motion";

// The "pop" open/close feel used by every accordion on the site (FAQ, origin story).
// Critically damped so it settles without bouncing, and it grows out of its top edge
// (where the trigger sits) from a small scale rather than from the middle of nowhere.
export const SPRING_TRANSITION: Transition = POPOVER_SPRING;
export const SPRING_SCALE_VARIANTS = {
  expanded: { opacity: 1, scale: 1, transformOrigin: "top center" },
  collapsed: { opacity: 0, scale: POPOVER_START_SCALE, transformOrigin: "top center" },
};
