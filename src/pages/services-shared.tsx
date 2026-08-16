import type { ReactNode } from "react";
import { CalendarClock, MessagesSquare, BarChart3, type LucideIcon } from "lucide-react";

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

// The "By default, every service comes with" block appears on both services
// pages. The three headings/icons are the same guarantee regardless of
// service, so they live here once - each page only supplies its own body
// copy for each, via AlwaysIncluded's `bodies` prop.
export const ALWAYS_INCLUDED_HEADINGS: { icon: LucideIcon; title: ReactNode }[] = [
  {
    icon: CalendarClock,
    title: (
      <>
        Monthly calls,
        <br />
        weekly check-ins
      </>
    ),
  },
  { icon: MessagesSquare, title: "Direct access to us" },
  { icon: BarChart3, title: "Transparent reporting" },
];
