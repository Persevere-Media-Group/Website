declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type ConsentChoice = "accepted" | "rejected";

const STORAGE_KEY = "cookie-consent";

/**
 * Reads the stored consent choice, if any. Returns null if the person hasn't
 * made a choice yet, that's the signal the banner should still be shown.
 */
export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

/**
 * Persists the choice and immediately applies it to both GA (via Consent Mode)
 * and Meta Pixel (via its own consent API). Both scripts already default to
 * denied/revoked in index.html, this is what actually turns tracking on.
 */
export function setConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, choice);
  applyConsent(choice);
}

/**
 * Applies a stored/chosen consent state to gtag and fbq, called both when the
 * person makes a fresh choice, and on every page load if they've already
 * chosen before (since gtag/fbq default to denied on every fresh script load).
 */
export function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  const granted = choice === "accepted";

  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
    });
  }

  if (window.fbq) {
    window.fbq("consent", granted ? "grant" : "revoke");
  }
}
