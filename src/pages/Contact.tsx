import { useEffect, useRef, useState } from "react";
import { PopupModal } from "react-calendly";
import { ArrowLeft, ArrowRight, HelpCircle, Phone, TriangleAlert, Users } from "lucide-react";
import SpecularButton from "@/components/primitive/specular-button";
import { Highlighter } from "@/components/primitive/highlighter";
import { GrainWave } from "@/components/custom/grain-wave";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import AnimatedContent from "@/components/primitive/animated-content";
import { Instagram, Linkedin } from "@/components/primitive/svgs";
import { FaqSection, type Faq } from "@/components/custom/faq";
import { containsProfanity } from "@/lib/profanity";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/primitive/stepper";
import confetti from "canvas-confetti";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// same link used in HeroSection/FloatingCta, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

const CONTACT_EMAIL = "keir@choosepersevere.com";

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

const REFERRAL_OPTIONS = [
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Google search",
  "Referred by a friend/colleague",
  "Existing client",
  "Other",
];

const TEAM_SOCIALS = [
  {
    name: "Keir",
    linkedin: "https://www.linkedin.com/in/keir-watson-472a01208/",
    instagram: "https://www.instagram.com/keirdoesads/",
  },
  {
    name: "Calum",
    linkedin: "https://www.linkedin.com/in/calum-keelan-005a09173/",
    instagram: "https://www.instagram.com/calummakesvideos/",
  },
];

const CONTACT_FAQS: Faq[] = [
  {
    q: "What happens after I submit the form?",
    a: "You'll hear back from a real person on the team, not a bot, within one working day.",
  },
  {
    q: "I'm not sure which service I need, can I still get in touch?",
    a: 'Of course. Pick "Nae clue, help me figure it out" from the service dropdown, or book a call instead, and we\'ll help you figure out where to start.',
  },
  {
    q: "Is there a minimum budget to work with you?",
    a: "There's no fixed minimum. We've managed budgets from £1,000 a month right up to £500,000 a month, so tell us what you've got and we'll be straight with you about what's realistic.",
  },
  {
    q: "Do I need to prepare anything before I get in touch?",
    a: 'Nope, just come as you are. If you\'d rather talk it through than type it out, use the "Book a call" link instead of the form.',
  },
];

// the form is split into categorised steps (via the Stepper primitive) rather than
// one long scroll, each step's fields stay mounted at all times (StepperContent
// forceMount) so values survive moving back and forth, and native required-field
// validation still works per step since hidden steps are excluded from constraint
// validation by the browser
const FORM_STEPS = [
  "What's your name, friend?",
  "Tell us about your business",
  "What are you after?",
  "Anything else you want to tell us?",
] as const;

// only the genuinely free-text fields are profanity-checked, not the dropdowns/email/
// website, which are either constrained to preset options or structurally validated
// already. Checked both per-step (so a rude name gets caught on step 1, not just at
// the very end) and again in full on submit, since the step indicators let people
// jump around and skip the per-step check entirely.
const FREE_TEXT_FIELDS: { key: "name" | "business" | "message"; step: number }[] = [
  { key: "name", step: 1 },
  { key: "business", step: 2 },
  { key: "message", step: FORM_STEPS.length },
];

const INPUT_CLASSES =
  "w-full rounded-xl border border-(--color-oxblood)/20 bg-(--color-ivory-raised) px-4 py-3 text-(--color-oxblood) outline-none transition-colors placeholder:text-(--color-oxblood)/35 focus:border-(--color-terracotta)";

const LABEL_CLASSES = "mb-2 block text-sm font-semibold text-(--color-oxblood)";

// used for the 2x2 select grid: labels there vary in length ("What service?" vs
// "How did you hear about us?"), and a wrapped 2-line label pushes just its own
// select down, throwing the row out of alignment with its neighbour. A shared
// min-height (flex + items-end to bottom-align the text against it) reserves the
// same vertical space whether a label wraps or not, so every select in the grid
// lines up both across its row and down its column.
const SELECT_LABEL_CLASSES =
  "mb-2 flex min-h-11 items-end gap-x-1 text-sm font-semibold text-(--color-oxblood)";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function Contact() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [step, setStep] = useState(1);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  const isLastStep = step === FORM_STEPS.length;

  // reportValidity() only surfaces required fields belonging to the CURRENT step:
  // the other steps' inputs sit under an ancestor with the `hidden` attribute, and
  // the browser excludes anything not rendered from constraint validation, so this
  // never blocks on a field the person hasn't reached yet
  const goNext = () => {
    if (!formRef.current?.reportValidity()) return;

    // catch a rude name/business as soon as someone tries to leave that step,
    // rather than waiting until they've filled out the whole rest of the form
    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    const offendingField = FREE_TEXT_FIELDS.find(
      (field) => field.step === step && containsProfanity(payload[field.key])
    );
    if (offendingField) {
      setShowProfanityWarning(true);
      return;
    }

    setStep((s) => Math.min(s + 1, FORM_STEPS.length));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // measures the card's real rendered height WHILE THE FORM IS SHOWING (step 1, since
  // the step-content area's own min-height already reserves enough room for whichever
  // step ends up tallest — see the min-h-[...] wrapper below), and locks that exact
  // pixel value in via inline style. This is the only way to guarantee the card doesn't
  // resize once the shorter success content replaces the form; guessing a rem value
  // doesn't account for how tall the real form actually renders at a given viewport
  // width. Deliberately NOT re-measuring on step change: since every step already fits
  // within that reserved min-height, remeasuring per step would just ratchet the card
  // taller the first time it saw a step whose OTHER chrome (nav + title) plus content
  // happened to exceed the previous measurement, which is exactly the "buttons keep
  // moving" behaviour this is meant to prevent.
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

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

    // belt-and-braces check for the required fields living on earlier steps: the
    // stepper indicators let people jump straight to the last step, and a hidden
    // step's `required` inputs are exempt from the browser's own constraint
    // validation, so an empty name/email could otherwise slip through on submit
    if (!payload.name?.trim() || !payload.email?.trim()) {
      setStep(1);
      return;
    }
    if (!payload.message?.trim()) {
      setStep(FORM_STEPS.length);
      return;
    }

    // belt-and-braces re-check of every free-text field (not just the current step's):
    // the per-step check in goNext() catches most cases as people move through the
    // form, but the step indicators let them jump around and land on submit without
    // ever triggering it, e.g. editing a clean name into something rude after already
    // passing step 1
    const offendingField = FREE_TEXT_FIELDS.find((field) => containsProfanity(payload[field.key]));
    if (offendingField) {
      setStep(offendingField.step);
      setShowProfanityWarning(true);
      return;
    }

    setIsSending(true);

    try {
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;

      if (!response.ok || !result?.ok) {
        setSendError(
          `Something went wrong sending that. Please try again or email us at ${CONTACT_EMAIL}.`
        );
        return;
      }

      setSubmitted(true);
      fireConfetti();
    } catch {
      setSendError(
        `Something went wrong sending that. Please try again or email us at ${CONTACT_EMAIL}.`
      );
    } finally {
      setIsSending(false);
    }
  };

  // NOTE: the <section> deliberately has no padding of its own. Any padding here would
  // push GrainWave down from the top of the page and stop it reaching the screen edges,
  // so the padding lives on the content wrapper below the band instead.
  return (
    <section className="min-h-screen bg-(--color-ivory)">
      <GrainWave height="24rem" logo>
        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter text-(--color-ivory)">
          Contact Us
        </h1>
      </GrainWave>

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 pt-16 pb-16 sm:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
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
              delay={0.24}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <HelpCircle size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Got a quick question?</p>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("contact-faqs")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="cursor-pointer text-(--color-terracotta) underline underline-offset-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Check out the FAQs below
                  </button>
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

            <AnimatedContent
              direction="horizontal"
              distance={30}
              duration={0.6}
              ease="power3.out"
              threshold={0.3}
              delay={0.48}
            >
              <div className="relative flex items-start gap-4">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-(--color-terracotta)">
                  <Users size={18} />
                </span>
                <div className="pt-1.5">
                  <p className="font-bold text-(--color-oxblood)">Connect with us</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {TEAM_SOCIALS.map((person) => (
                      <div key={person.name} className="flex items-center gap-3">
                        <span
                          className="w-12 text-(--color-oxblood)/80"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {person.name}
                        </span>
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${person.name} on LinkedIn`}
                          className="text-(--color-terracotta) transition-colors hover:text-(--color-oxblood)"
                        >
                          <Linkedin />
                        </a>
                        <a
                          href={person.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${person.name} on Instagram`}
                          className="text-(--color-terracotta) transition-colors hover:text-(--color-oxblood)"
                        >
                          <Instagram />
                        </a>
                      </div>
                    ))}
                  </div>
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
          className="relative flex flex-col overflow-hidden rounded-3xl border border-(--color-oxblood)/10 bg-(--color-ivory-raised) p-6 shadow-[0_18px_50px_-12px_rgba(74,31,29,0.18)] sm:p-9"
          style={{ minHeight: cardHeight ? `${cardHeight}px` : undefined }}
        >
          {submitted ? (
            <div className="flex flex-1 flex-col" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
                  Cheers!
                </h2>
                <p className="max-w-sm text-(--color-oxblood)/80">
                  Your message has been sent.
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
                  // matches `tint` rather than the usual neutral grey: with tintOpacity
                  // at 1 the button is a solid fill, not real glass, so the WebGL base
                  // coat needs to be the same colour as that fill or it shows through
                  // as a mismatched grey patch instead of blending in
                  baseColor="#594157"
                  intensity={0.8}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate
                  className="w-full"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                  }}
                >
                  Submit another form
                </SpecularButton>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col"
              style={{ fontFamily: "var(--font-body)" }}
            >
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

              {/* flex-1 so this block (not the button row below) absorbs the height
                  difference between steps — the Back/Next/Send buttons and the
                  reCAPTCHA note then always land in the same spot at the card's
                  bottom edge instead of drifting up or down with each step's content.
                  The min-height covers this whole block (nav + title + panel), sized
                  to its tallest combination (step 3's four selects, measured at each
                  breakpoint) so that height is reserved from the very first render,
                  rather than the card growing the first time someone reaches that step. */}
              <div className="flex-1 min-h-[570px] sm:min-h-[330px]">
                <Stepper value={step} onValueChange={setStep}>
                <StepperNav className="mb-6">
                  {FORM_STEPS.map((title, i) => {
                    const stepNumber = i + 1;
                    return (
                      <StepperItem key={title} step={stepNumber}>
                        <StepperTrigger>
                          <StepperIndicator className="size-8 border-2 border-(--color-terracotta) bg-(--color-ivory) text-xs font-bold text-(--color-terracotta) data-[state=active]:bg-(--color-terracotta) data-[state=active]:text-(--color-ivory) data-[state=completed]:bg-(--color-terracotta) data-[state=completed]:text-(--color-ivory)">
                            {stepNumber}
                          </StepperIndicator>
                        </StepperTrigger>
                        {stepNumber < FORM_STEPS.length && (
                          <StepperSeparator className="bg-(--color-terracotta)/20 data-[state=completed]:bg-(--color-terracotta)" />
                        )}
                      </StepperItem>
                    );
                  })}
                </StepperNav>

                <h3 className="mb-5 text-[clamp(1.15rem,2.4vw,1.4rem)] font-black tracking-tight text-(--color-oxblood)">
                  {FORM_STEPS[step - 1]}
                </h3>

                <StepperPanel>
                  <StepperContent value={1} forceMount>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={LABEL_CLASSES}>
                          Your name <span className="text-(--color-terracotta)">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={step === 1}
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
                          required={step === 1}
                          placeholder="yourbusiness@email.com"
                          className={INPUT_CLASSES}
                        />
                      </div>
                    </div>
                  </StepperContent>

                  <StepperContent value={2} forceMount>
                    <div className="grid gap-5 sm:grid-cols-2">
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
                  </StepperContent>

                  <StepperContent value={3} forceMount>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="service" className={SELECT_LABEL_CLASSES}>
                          What service?
                        </label>
                        <select
                          id="service"
                          name="service"
                          defaultValue=""
                          className={INPUT_CLASSES}
                        >
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

                      <div>
                        <label htmlFor="budget" className={SELECT_LABEL_CLASSES}>
                          Monthly ad spend
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

                      <div>
                        <label htmlFor="timeframe" className={SELECT_LABEL_CLASSES}>
                          Start timeframe
                        </label>
                        <select
                          id="timeframe"
                          name="timeframe"
                          defaultValue=""
                          className={INPUT_CLASSES}
                        >
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

                      <div>
                        <label htmlFor="referral" className={SELECT_LABEL_CLASSES}>
                          How did you hear about us?
                        </label>
                        <select
                          id="referral"
                          name="referral"
                          defaultValue=""
                          className={INPUT_CLASSES}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {REFERRAL_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </StepperContent>

                  <StepperContent value={4} forceMount>
                    <label htmlFor="message" className={LABEL_CLASSES}>
                      Tell us what's going on <span className="text-(--color-terracotta)">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required={step === 4}
                      rows={6}
                      placeholder="What you're working on, what's not landing, and what you'd like it to look like instead."
                      className={`${INPUT_CLASSES} resize-none`}
                    />
                  </StepperContent>
                </StepperPanel>
                </Stepper>
              </div>

              {sendError && (
                <p
                  className="mt-5 text-sm font-semibold text-(--color-terracotta)"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {sendError}
                </p>
              )}

              <div className="mt-8 flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-(--color-oxblood)/20 px-5 py-3 text-sm font-bold text-(--color-oxblood) transition-colors hover:bg-(--color-oxblood)/5"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}

                {isLastStep ? (
                  <SpecularButton
                    // deliberately a different key from the "Next" button below: without
                    // one, React sees the same component at the same tree position on the
                    // step-3→4 transition and reuses that DOM node, mutating its type from
                    // "button" to "submit" in place. That mutation can land before the
                    // browser evaluates the click's default action, so the very click that
                    // was meant to just advance the step ends up submitting the form. A
                    // distinct key forces a real unmount/mount instead of an in-place update.
                    key="submit-button"
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
                    // matches `tint`: with tintOpacity at 1 the button is a solid fill,
                    // not real glass, so the WebGL base coat needs to be the same
                    // colour as that fill or it shows through as a mismatched patch
                    baseColor="#594157"
                    intensity={0.8}
                    shineSize={10}
                    shineFade={40}
                    thickness={1}
                    speed={0.35}
                    followMouse
                    proximity={250}
                    autoAnimate
                    className="flex-1"
                  >
                    {isSending ? "Sending..." : "Send it over!"}
                  </SpecularButton>
                ) : (
                  <SpecularButton
                    key="next-button"
                    type="button"
                    onClick={goNext}
                    size="lg"
                    radius={18}
                    tint="var(--color-deep-plum)"
                    tintOpacity={1}
                    blur={0}
                    textColor="var(--color-ivory)"
                    lineColor="#ffffff"
                    // matches `tint`: with tintOpacity at 1 the button is a solid fill,
                    // not real glass, so the WebGL base coat needs to be the same
                    // colour as that fill or it shows through as a mismatched patch
                    baseColor="#594157"
                    intensity={0.8}
                    shineSize={10}
                    shineFade={40}
                    thickness={1}
                    speed={0.35}
                    followMouse
                    proximity={250}
                    autoAnimate
                    className="flex-1"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      Next
                      <ArrowRight size={16} />
                    </span>
                  </SpecularButton>
                )}
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

      <SectionDivider reverse />

      <div
        id="contact-faqs"
        className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col items-center px-4 pb-32 pt-16"
      >
        <FaqSection faqs={CONTACT_FAQS} />
      </div>

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />

      {showProfanityWarning && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-(--color-oxblood)/50 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="profanity-warning-title"
          onClick={() => setShowProfanityWarning(false)}
        >
          <div
            className="max-w-sm rounded-3xl bg-(--color-ivory-raised) p-8 text-center shadow-[0_18px_50px_-12px_rgba(74,31,29,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-(--color-terracotta)/15 text-(--color-terracotta)">
              <TriangleAlert size={22} />
            </span>
            <h2 id="profanity-warning-title" className="text-xl font-black tracking-tight text-(--color-oxblood)">
              Let's keep it civil
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              That message contains language we don't accept here. We're all for
              directness, just not harassment, so please edit it and try again.
            </p>
            <button
              type="button"
              onClick={() => setShowProfanityWarning(false)}
              className="mt-6 w-full cursor-pointer rounded-full bg-(--color-deep-plum) px-5 py-3 text-sm font-bold text-(--color-ivory) transition-opacity hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
