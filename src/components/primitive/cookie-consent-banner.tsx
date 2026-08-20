import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStoredConsent,
  setConsent,
  applyConsent,
  type ConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => !getStoredConsent());

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      // returning visitor who already chose, sync that choice to gtag/fbq again
      // since both default back to denied/revoked on every fresh page load
      applyConsent(stored);
    }
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    setConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-60 flex justify-start px-4 pb-4 sm:pb-6"
    >
      <div className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-(--color-oxblood)/10 bg-(--color-ivory) p-5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <p
          className="flex-1 text-sm leading-relaxed text-(--color-oxblood)"
        >
          We use cookies for essential site function, and, with your permission, to understand how
          the site is used (Google Analytics) and to measure our ads (Meta Pixel). Read our{" "}
          <Link to="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="whitespace-nowrap rounded-full border border-(--color-oxblood)/30 px-5 py-2.5 text-sm font-semibold text-(--color-oxblood) transition-colors hover:bg-(--color-oxblood)/5"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="whitespace-nowrap rounded-full bg-(--color-oxblood) px-5 py-2.5 text-sm font-semibold text-(--color-ivory) transition-opacity hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
