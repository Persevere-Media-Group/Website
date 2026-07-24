import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";

export function Layout() {
  return (
    <>
      <Navbar />
      {/* useHeaderContrast (used inside Navbar) queries document.querySelector("main")
          and reads its direct children's background colours to decide the menu button's
          text colour. without this wrapper, that query returns null on every page and the
          button never updates from its initial colour. */}
      <main>
        <Outlet />
      </main>
    </>
  );
}
