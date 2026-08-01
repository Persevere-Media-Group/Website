import { useEffect, useRef, useState } from "react";
import { PopupModal } from "react-calendly";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import SpecularButton from "@/components/primitive/specular-button";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import AnimatedContent from "@/components/primitive/animated-content";
import confetti from "canvas-confetti";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// same link used in HeroSection/FloatingCta, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

const CONTACT_EMAIL = "hello@choosepersevere.com";

// The contact form's send endpoint lives in its own small Vercel project
// (see email-api/), separate from this GitHub Pages site.
const CONTACT_API_URL = "https://persevere-email-api.vercel.app/api/send-email";

// reCAPTCHA v3 site key. Public by design, safe to hardcode, it identifies the
// site to Google, it isn't a secret. Get this from
// https://www.google.com/recaptcha/admin after registering the domain.
// The matching secret key lives server-side in email-api, not here.
const RECAPTCHA_SITE_KEY = "6LfCS3AtAAAAADpEdfO4MoIBV5YS_dLxzHD3DHoN";

const SERVICE_OPTIONS = [
  "Creative strategy & content creation",
  "Paid media & performance marketing",
  "The full shabang (all of the above)",
  "Nae clue, help me figure it out",
];

const BUDGET_OPTIONS = [
  "Under £1,000/mo",
  "£1,000 - £5,000 per month",
  "£5,000 - £15,000 per month",
  "£15,000 - £50,000 per month",
  "£50,000+ per month",
  "Not sure yet",
];

const TIMEFRAME_OPTIONS = [
  "Right away!",
  "Within the next month",
  "In 1 - 3 months",
  "In 3 - 6 months",
  "Just window shopping!",
];

const INPUT_CLASSES =
  "w-full rounded-xl border border-(--color-oxblood)/20 bg-(--color-ivory) px-4 py-3 text-(--color-oxblood) outline-none transition-colors placeholder:text-(--color-oxblood)/35 focus:border-(--color-terracotta)";

const LABEL_CLASSES = "mb-2 block text-sm font-semibold text-(--color-oxblood)";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function Contact() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  // measures the card's real rendered height WHILE THE FORM IS SHOWING, and locks that
  // exact pixel value in via inline style. this is the only way to guarantee the card
  // doesn't resize once the shorter success content replaces the form, guessing a rem
  // value doesn't account for how tall the real form actually renders at a given
  // viewport width. re-measures on resize too, but only while the form is visible, so
  // switching to the success view never re-measures against its own (shorter) content.
  useEffect(() => {
    const measure = () => {
      if (!submitted && cardRef.current) {
        setCardHeight(cardRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [submitted]);

  // loaded lazily here rather than in index.html, since reCAPTCHA is only needed
  // on this page. skips re-adding the script if it's already on the page, which
  // matters in dev under React StrictMode where effects run twice. removed again
  // on unmount, since this is a single-page app, navigating away from Contact
  // doesn't reload the page, and the script otherwise stays loaded (and its
  // badge in the DOM) on every other route too.
  useEffect(() => {
    const existing = document.querySelector('script[data-recaptcha="true"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.dataset.recaptcha = "true";
      document.head.appendChild(script);
    }

    return () => {
      document.querySelector('script[data-recaptcha="true"]')?.remove();
      document.querySelector(".grecaptcha-badge")?.remove();
    };
  }, []);

  const getRecaptchaToken = () =>
    new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA has not loaded"));
        return;
      }
      window.grecaptcha.ready(() => {
        window
          .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact_form" })
          .then(resolve, reject);
      });
    });

  const fireConfetti = () => {
    // confetti's origin is normalised 0-1 coordinates of the whole VIEWPORT, not the
    // button, so it has to be computed from the button's actual on-screen position at
    // the moment of click, same approach your own ConfettiButton variant uses
    const rect = submitButtonRef.current?.getBoundingClientRect();
    const origin = rect
      ? {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
      : { x: 0.5, y: 0.6 };

    confetti({
      particleCount: 120,
      spread: 90,
      origin,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendError(null);
    setIsSending(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;

      if (!response.ok || !result?.ok) {
        setSendError("Something went wrong sending that. Please try again or email us directly.");
        return;
      }

      setSubmitted(true);
      fireConfetti();
    } catch {
      setSendError("Something went wrong sending that. Please try again or email us directly.");
    } finally {
      setIsSending(false);
    }
  };

  // NOTE: the <section> deliberately has no padding of its own. Any padding here would
  // push GrainWave down from the top of the page and stop it reaching the screen edges,
  // so the padding lives on the content wrapper below the band instead.
  return (
    <section className="min-h-screen bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter text-(--color-ivory)">
          Contact Us
        </h1>
      </GrainWave>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 pb-32 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* left: context, so the form doesn't arrive cold */}
        <div className="flex flex-col">
          <AnimatedContent
            direction="vertical"
            distance={40}
            duration={0.7}
            ease="power3.out"
            threshold={0.2}
          >
            <div>
              <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black leading-none tracking-tighter text-(--color-oxblood)">
                Let's talk.
              </h1>

              <p
                className="mt-6 max-w-md text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Drop us a message and you'll hear back from
                <Highlighter
                  action="highlight"
                  color="rgba(237, 176, 62, 0.3)"
                  triggerOnView
                  animationDuration={1000}
                  iterations={2}
                >
                  one of us, not a bot
                </Highlighter>
                , within one working day.
              </p>
            </div>
          </AnimatedContent>

          {/* a vertical timeline instead of the usual icon-row list, a connecting line
              down the left with each item as a stop along it, staggered in one at a
              time on scroll rather than all appearing at once */}
          <div className="relative mt-12 flex flex-col gap-9">
            <div
              className="absolute bottom-2 left-5 top-2 w-px bg-(--color-terracotta)/25"
              aria-hidden
            />

            <AnimatedContent
              direction="horizontal"
              distance={30}
              duration={0.6}
              ease="power3.out"
              threshold={0.3}
              delay={0}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <Mail size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-(--color-terracotta) underline underline-offset-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              direction="horizontal"
              distance={30}
              duration={0.6}
              ease="power3.out"
              threshold={0.3}
              delay={0.12}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <MapPin size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Where we are</p>
                  <p
                    className="text-(--color-oxblood)/80"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Leith & Dunfermline
                  </p>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              direction="horizontal"
              distance={30}
              duration={0.6}
              ease="power3.out"
              threshold={0.3}
              delay={0.24}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <Clock size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Response time</p>
                  <p
                    className="text-(--color-oxblood)/80"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Within one working day
                  </p>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              direction="horizontal"
              distance={30}
              duration={0.6}
              ease="power3.out"
              threshold={0.3}
              delay={0.36}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <Phone size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Rather just talk?</p>
                  <button
                    type="button"
                    onClick={() => setIsCalendlyOpen(true)}
                    className="cursor-pointer text-(--color-terracotta) underline underline-offset-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Book a call
                  </button>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>

        {/* right: the form itself. height is locked via JS measurement (see cardHeight
            above) rather than a guessed CSS min-height, so the card is guaranteed not
            to resize when swapping between the form and the success message below */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl border border-(--color-oxblood)/10 bg-(--color-ivory) p-6 shadow-[0_18px_50px_-12px_rgba(74,31,29,0.18)] sm:p-9"
          style={{ minHeight: cardHeight ? `${cardHeight}px` : undefined }}
        >
          {submitted ? (
            <div className="flex h-full flex-col" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
                  Cheers!
                </h2>
                <p className="max-w-sm text-(--color-oxblood)/80">
                  Message received.
                  <br />
                  We will get back to you within one working day.
                </p>
              </div>

              <div className="mt-8">
                <SpecularButton
                  type="button"
                  size="lg"
                  radius={18}
                  tint="var(--color-deep-plum)"
                  tintOpacity={1}
                  blur={0}
                  textColor="var(--color-ivory)"
                  lineColor="#ffffff"
                  baseColor="#525252"
                  intensity={0.8}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate
                  className="w-full"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another form
                </SpecularButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ fontFamily: "var(--font-body)" }}>
              {/* Honeypot: real visitors never see or reach this field, so it should
                  always submit empty. If it's filled in, the submission came from a bot
                  and the API silently drops it. Positioned off-screen rather than
                  display:none or visibility:hidden, since some bots skip filling in
                  fields hidden that way, but still fill in anything technically visible
                  to the layout. aria-hidden and tabIndex={-1} keep it out of the
                  accessibility tree and tab order so screen reader and keyboard users
                  never land on it. */}
              <div className="absolute left-[-9999px] top-0" aria-hidden="true">
                <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={LABEL_CLASSES}>
                    Your name <span className="text-(--color-terracotta)">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className={INPUT_CLASSES}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={LABEL_CLASSES}>
                    Email <span className="text-(--color-terracotta)">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="yourbusiness@email.com"
                    className={INPUT_CLASSES}
                  />
                </div>

                <div>
                  <label htmlFor="business" className={LABEL_CLASSES}>
                    Business name
                  </label>
                  <input
                    id="business"
                    name="business"
                    type="text"
                    placeholder="Your Business Ltd"
                    className={INPUT_CLASSES}
                  />
                </div>

                <div>
                  <label htmlFor="website" className={LABEL_CLASSES}>
                    Website
                  </label>
                  {/* deliberately type="text", not type="url", type="url" rejects
                      anything without an https:// prefix, which most people won't type.
                      the pattern accepts bare domains, www prefixes, subdomains, paths,
                      and an optional protocol if they do include one. */}
                  <input
                    id="website"
                    name="website"
                    type="text"
                    inputMode="url"
                    pattern="(https?://)?([\w-]+\.)+[a-zA-Z]{2,}(/.*)?"
                    title="Enter a website like example.com"
                    placeholder="example.com"
                    className={INPUT_CLASSES}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="service" className={LABEL_CLASSES}>
                  What are you after?
                </label>
                <select id="service" name="service" defaultValue="" className={INPUT_CLASSES}>
                  <option value="" disabled>
                    Pick one
                  </option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label htmlFor="budget" className={LABEL_CLASSES}>
                  Monthly ad spend <span className="font-normal opacity-60">(optional)</span>
                </label>
                <select id="budget" name="budget" defaultValue="" className={INPUT_CLASSES}>
                  <option value="" disabled>
                    Select a range
                  </option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className={LABEL_CLASSES}>
                  Tell us what's going on <span className="text-(--color-terracotta)">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What you're working on, what's not landing, and what you'd like it to look like instead."
                  className={`${INPUT_CLASSES} resize-none`}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="timeframe" className={LABEL_CLASSES}>
                  When are you looking to start?
                </label>
                <select id="timeframe" name="timeframe" defaultValue="" className={INPUT_CLASSES}>
                  <option value="" disabled>
                    Select a timeframe
                  </option>
                  {TIMEFRAME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {sendError && (
                <p
                  className="mt-5 text-sm font-semibold text-(--color-terracotta)"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {sendError}
                </p>
              )}

              <div className="mt-8">
                <SpecularButton
                  ref={submitButtonRef}
                  type="submit"
                  disabled={isSending}
                  size="lg"
                  radius={18}
                  tint="var(--color-deep-plum)"
                  tintOpacity={1}
                  blur={0}
                  textColor="var(--color-ivory)"
                  lineColor="#ffffff"
                  baseColor="#525252"
                  intensity={0.8}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate
                  className="w-full"
                >
                  {isSending ? "Sending..." : "Send it over!"}
                </SpecularButton>
              </div>

              {/* required by Google's reCAPTCHA terms whenever the badge itself is
                  hidden (see .grecaptcha-badge in index.css) */}
              <p
                className="mt-4 text-center text-xs text-(--color-oxblood)/50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </form>
          )}
        </div>
      </div>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </section>
  );
}
