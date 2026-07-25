import { useState } from "react";
import { PopupModal } from "react-calendly";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import SpecularButton from "@/components/ui/SpecularButton";
import { Highlighter } from "@/components/ui/highlighter";
import { GrainWave } from "@/components/sections/grain-wave";

// same link used in HeroSection/FloatingCta, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

// TODO: swap for the real address once it's set up
const CONTACT_EMAIL = "hello@choosepersevere.com";

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

export function Contact() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up to a real form handler. GitHub Pages is static hosting, so
    // there's no server to post to, the usual options are Formspree, Web3Forms, or
    // Getform, all of which give you an endpoint to POST this to and email you the
    // result. Until then this just shows the success state without sending anything.
    setSubmitted(true);
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
          <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-black leading-none tracking-tighter text-(--color-oxblood)">
            Let's talk.
          </h1>

          <p
            className="mt-6 max-w-md text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Fill this in and you'll hear back from{" "}
            <Highlighter
              action="highlight"
              color="rgba(237, 176, 62, 0.3)"
              isView
              animationDuration={1000}
              iterations={2}
            >
              one of us, not a bot
            </Highlighter>
            , within one working day. The more you tell us about the business and where you're
            stuck, the more useful the reply.
          </p>

          <div className="mt-12 flex flex-col gap-7">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-terracotta)/10 text-(--color-terracotta)">
                <Mail size={18} />
              </span>
              <div>
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

            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-terracotta)/10 text-(--color-terracotta)">
                <MapPin size={18} />
              </span>
              <div>
                <p className="font-bold text-(--color-oxblood)">Where we are</p>
                <p className="text-(--color-oxblood)/80" style={{ fontFamily: "var(--font-body)" }}>
                  Leith, Edinburgh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-terracotta)/10 text-(--color-terracotta)">
                <Clock size={18} />
              </span>
              <div>
                <p className="font-bold text-(--color-oxblood)">Response time</p>
                <p className="text-(--color-oxblood)/80" style={{ fontFamily: "var(--font-body)" }}>
                  Within one working day
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-terracotta)/10 text-(--color-terracotta)">
                <Phone size={18} />
              </span>
              <div>
                <p className="font-bold text-(--color-oxblood)">Rather just talk?</p>
                <button
                  type="button"
                  onClick={() => setIsCalendlyOpen(true)}
                  className="text-(--color-terracotta) underline underline-offset-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Book a call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* right: the form itself */}
        <div className="rounded-3xl border border-(--color-oxblood)/10 bg-(--color-ivory) p-6 shadow-[0_18px_50px_-12px_rgba(74,31,29,0.18)] sm:p-9">
          {submitted ? (
            <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-(--color-oxblood)">
                Message sent.
              </h2>
              <p
                className="max-w-sm text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cheers for that. One of us will get back to you within a working day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ fontFamily: "var(--font-body)" }}>
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
                  <input
                    id="website"
                    name="website"
                    type="url"
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

              <div className="mt-8">
                <SpecularButton
                  type="submit"
                  size="lg"
                  radius={18}
                  tint="var(--color-terracotta)"
                  tintOpacity={0.4}
                  blur={0}
                  textColor="#4a1f1d"
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
                  Send it over!
                </SpecularButton>
              </div>
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
