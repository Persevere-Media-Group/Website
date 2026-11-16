import type { Transition } from "motion/react";

/**
 * Shared motion values, so every animation on the site pulls from the same small
 * set of curves and timings rather than each component picking its own.
 *
 * - Things that appear or respond use ease-out: fast start, soft landing.
 * - Things that travel between two on-screen positions use ease-in-out.
 * - Things that leave use ease-in and run shorter than the matching entrance (about 20%).
 * - Springs for everyday UI are critically damped (damping = 2 * sqrt(stiffness)), so they
 *   settle without bouncing.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN = [0.55, 0, 1, 0.45] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Entrance and exit durations in seconds. Exits are ~20% shorter than entrances. */
export const ENTER_DURATION = 0.3;
export const EXIT_DURATION = 0.24;

/** Gap between list rows when they stagger in, in seconds. */
export const LIST_STAGGER = 0.03;

/** Scale that popovers and expanding panels start from. */
export const POPOVER_START_SCALE = 0.95;

/** Scale a pressed button shrinks to. */
export const PRESS_SCALE = 0.97;

export const POPOVER_SPRING: Transition = { type: "spring", stiffness: 300, damping: 35 };
export const SNAP_SPRING: Transition = { type: "spring", stiffness: 380, damping: 39 };
export const SCALE_SPRING: Transition = { type: "spring", stiffness: 500, damping: 45 };
