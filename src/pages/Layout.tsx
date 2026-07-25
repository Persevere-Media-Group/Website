import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingCta } from "@/components/sections/floating-cta";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";
import { Footer } from "@/components/sections/footer";
import { trackPageviewAll } from "@/lib/analytics";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
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
