import type { Transition } from "motion/react";

// The "pop" open/close feel used by every accordion on the site (FAQ, origin story).
export const SPRING_TRANSITION: Transition = { type: "spring", stiffness: 120, damping: 20 };
export const SPRING_SCALE_VARIANTS = {
  expanded: { opacity: 1, scale: 1 },
  collapsed: { opacity: 0, scale: 0.7 },
};
