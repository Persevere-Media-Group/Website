import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";

export function Layout() {
  const location = useLocation();

  // without this, navigating to a new page keeps whatever scroll position you were
  // at on the previous page, which reads as broken alongside a polished transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      {/* useHeaderContrast (used inside Navbar) queries document.querySelector("main")
          and reads its direct children's background colours to decide the menu button's
          text colour. without this wrapper, that query returns null on every page and the
          button never updates from its initial colour. */}
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
    </>
  );
}
