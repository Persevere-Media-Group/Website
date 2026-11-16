import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import "./index.css";

// Remove index.html's static SEO tags (title/description/canonical/OG/
// Twitter) now that JS is running - src/seo/Seo.tsx renders the real
// per-route versions below. Without this, React 19's head-hoisting only adds
// its tags alongside the static ones (it doesn't know to replace markup it
// didn't render), leaving duplicates. Non-JS crawlers never run this, so the
// static tags still serve their fallback purpose for them.
document.querySelectorAll("[data-default]").forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
