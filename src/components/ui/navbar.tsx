import { useState } from "react";

interface NavTab {
  label: string;
  href: string;
}

// placeholder tabs, structured after the reference image, swap these for your real site sections
const NAV_TABS: NavTab[] = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Services", href: "#" },
  { label: "Case Studies", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

export function Navbar() {
  // tracks which tab is currently highlighted, defaults to the first one
  const [activeLabel, setActiveLabel] = useState(NAV_TABS[0].label);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 bg-(--color-deep-plum)/90 px-6 py-4 backdrop-blur-md">
      <nav className="flex flex-wrap items-center gap-6">
        {NAV_TABS.map((tab) => {
          const isActive = tab.label === activeLabel;

          return (
            <a
              key={tab.label}
              href={tab.href}
              onClick={() => setActiveLabel(tab.label)}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-(--color-amber-gold)"
                  : "text-(--color-ivory) hover:text-(--color-amber-gold)"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      <a
        href="#"
        className="rounded-full bg-(--color-amber-gold) px-5 py-2 text-sm font-semibold text-(--color-deep-plum) transition-opacity hover:opacity-90"
      >
        Book a Call
      </a>
    </header>
  );
}
