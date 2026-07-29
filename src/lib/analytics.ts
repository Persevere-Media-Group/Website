// gtag and fbq are both loaded as plain global scripts in index.html, not npm packages,
// so TypeScript has no idea they exist on `window` unless we tell it here.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
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

/**
 * Sends a PageView event to Meta Pixel for the given path, same reasoning as
 * trackPageview above: the base snippet in index.html only fires once, on the
 * very first real browser page load, client-side route changes need this called
 * explicitly or Meta never sees any navigation beyond the first page.
 */
export function trackMetaPageview() {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "PageView");
}

/**
 * Convenience wrapper: fires both Google Analytics and Meta Pixel pageview events
 * together, call this once per route change rather than the two individually.
 */
export function trackPageviewAll(path: string) {
  trackPageview(path);
  trackMetaPageview();
}
