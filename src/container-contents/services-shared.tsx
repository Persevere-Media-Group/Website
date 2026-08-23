import type { ReactNode } from "react";
import { CalendarClock, MessagesSquare, BarChart3, type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared config/types for the two services pages (rendered by ServicePersonPage).
// Kept in their own module (rather than ServicesCombined.tsx) since that file
// only exports components, which Vite's fast-refresh requires.
// ---------------------------------------------------------------------------

// the one Calendly link used across the whole site
export const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

// The "By default, every service comes with" block appears on both services
// pages. The three headings/icons are the same guarantee regardless of
// service, so they live here once - each page only supplies its own body
// copy for each, via AlwaysIncluded's `bodies` prop.
export const ALWAYS_INCLUDED_HEADINGS: { icon: LucideIcon; title: ReactNode }[] = [
  {
    icon: CalendarClock,
    title: <>Regular contact</>,
  },
  { icon: MessagesSquare, title: "Direct access to us" },
  { icon: BarChart3, title: "Transparent reporting" },
];
