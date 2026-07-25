export function PrivacyPolicy() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory) px-4 pt-32 pb-24 text-center sm:pt-40">
      <p
        className="text-[clamp(0.75rem,1.6vw,0.95rem)] font-semibold uppercase tracking-[0.2em] text-(--color-oxblood)/60"
        style={{ fontFamily: "var(--font-body)" }}
      >
        The Legal Bits
      </p>
      <h1 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
        Privacy Policy
      </h1>

      <div
        className="mt-10 max-w-2xl space-y-8 text-left text-(--color-oxblood)/90"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <p className="text-sm text-(--color-oxblood)/60">Last updated: 25th July 2026</p>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-(--color-oxblood)">Who we are</h2>
          <p className="leading-relaxed">
            Persevere Media ("we", "us", "our") operates choosepersevere.com. This policy explains
            what information we collect when you visit the site, why, and what choices you have.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-(--color-oxblood)">Cookies we use</h2>
          <p className="leading-relaxed">
            We use three categories of cookies and similar technologies:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-relaxed">
            <li>
              <strong>Essential</strong> — required for the site to function correctly (e.g.
              remembering your cookie choice). These can't be switched off and don't require
              consent.
            </li>
            <li>
              <strong>Analytics (Google Analytics)</strong> — helps us understand how visitors use
              the site, which pages are popular, and how people navigate through it, so we can
              improve it. Only active if you accept.
            </li>
            <li>
              <strong>Advertising (Meta Pixel)</strong> — helps us measure the effectiveness of our
              advertising and understand actions people take after viewing our ads. Only active if
              you accept.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-(--color-oxblood)">Your choices</h2>
          <p className="leading-relaxed">
            When you first visit the site, you're asked to accept all cookies or reject
            non-essential ones. You can change your mind at any time by clearing your browser's
            cookies for this site, which will show the choice banner again on your next visit.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-(--color-oxblood)">Data these services collect</h2>
          <p className="leading-relaxed">
            Google Analytics and Meta Pixel are operated by Google and Meta respectively, not by us
            directly. If you accept these cookies, your browser sends data (such as pages viewed,
            general location, and device type) directly to those companies, governed by their own
            privacy policies:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Google's Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Meta's Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-(--color-oxblood)">Contact us</h2>
          <p className="leading-relaxed">
            {/* TODO: replace with your real contact details */}
            If you have questions about this policy or how we handle your data, contact us at [EMAIL
            ADDRESS].
          </p>
        </div>
      </div>
    </section>
  );
}
