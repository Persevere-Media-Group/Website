import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared config/types for the two services pages (ServicesKeir / ServicesCalum).
// Kept in their own module (rather than ServicesCombined.tsx) since that file
// only exports components, which Vite's fast-refresh requires.
// ---------------------------------------------------------------------------

// same link used elsewhere on the site, keep these in sync if it ever changes
export const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

export const UNDERLINE_COLOR = "#d5573b";
export const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";

export const MARK_PROPS = {
  isView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

export type AlwaysIncludedItem = {
  icon: LucideIcon;
  title: ReactNode;
  body: string;
};
