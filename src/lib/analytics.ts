// gtag is loaded as a plain global script in index.html, not an npm package, so
// TypeScript has no idea it exists on `window` unless we tell it here.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-4TYGQEZE43";

/**
 * Sends a page_view event to Google Analytics for the given path, this is what makes
 * client-side route changes (react-router navigation) show up as separate pageviews.
 * Without this, GA only ever logs the single initial pageview from index.html's script
 * tag, since navigating between routes in a single-page app never triggers a real
 * browser page load, GA has no way to know a "new page" happened unless told explicitly.
 */
export function trackPageview(path: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
