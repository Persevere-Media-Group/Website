import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Navbar } from "@/components/custom/navbar";
import { ScrollProgress } from "@/components/primitive/scroll-progress";
import { FloatingCta } from "@/components/custom/floating-cta";
import { CookieConsentBanner } from "@/components/primitive/cookie-consent-banner";
import { Footer } from "@/components/custom/footer";
import { trackPageviewAll } from "@/lib/analytics";

export function Layout() {
  const location = useLocation();

  // Reset scroll during render, not in an effect: effects fire child-before-parent,
  // so a useEffect/useLayoutEffect here would still run AFTER the incoming page's own
  // layout effects (e.g. ScrollStack measuring window.scrollY on mount). Landing on a
  // page while window.scrollY still holds the previous page's scroll position makes
  // window-scroll-driven components compute their initial layout against the wrong
  // scroll offset. Doing it inline during render guarantees it happens before any
  // child of Outlet mounts.
  const prevPathname = useRef(location.pathname);
  if (prevPathname.current !== location.pathname) {
    prevPathname.current = location.pathname;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    trackPageviewAll(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {/* fixed to the very top of the viewport, fills as the page scrolls,
          sits above everything (including the nav) so it's always visible.
          !bg-none strips the component's own default rainbow gradient
          (a background-image, which always paints over a background-color,
          so that has to be removed explicitly, not just covered with a solid class),
          !bg-(--color-oxblood) then sets the actual solid fill colour */}
      <ScrollProgress className="bg-none! bg-(--color-oxblood)! fixed top-0 z-50 h-1.5" />

      <Navbar />
      <main>
        {/* popLayout (not the default "wait") lets the incoming page start fading
            in immediately instead of waiting for the outgoing one to fully finish
            first — that gap was what read as a "flash": the old page's background
            (e.g. Home's terracotta hero) disappears and the plain ivory body shows
            through for a beat before the next page appears. popLayout also pulls
            the exiting page out of layout flow as soon as it starts leaving, so
            having both pages mounted briefly doesn't stack their heights and jump
            the page underneath (the footer, this component's own scroll-to-top) */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* outside the animated page content deliberately, so it stays fixed in place
          while pages transition above it rather than fading in and out with them */}
      <Footer />

      {/* fixed bottom-right, renders once here so it stays visible across every page,
          rather than needing to be added to each individual page */}
      <FloatingCta />

      {/* shows once until the person makes a choice, then persists via localStorage.
          gates whether gtag/fbq actually send data, not just a decorative banner */}
      <CookieConsentBanner />
    </>
  );
}
