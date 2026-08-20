import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PopupModal } from "react-calendly";
import { useAutoFitScale } from "@/hooks/use-auto-fit-scale";
import { CylinderTextRotate } from "@/components/primitive/cylinder-text-rotate";
import { getCylinderSizeCompensation } from "@/lib/cylinder-size-compensation";
import { ClickSpark } from "@/components/primitive/click-spark";
import { Grainient } from "@/components/primitive/grainient";
import { SectionWave } from "@/components/primitive/section-wave";
import SpecularButton from "@/components/primitive/specular-button";
import { YellowPulsatingButton } from "@/components/custom/yellow-pulsating-button";
import SquigglyArrow from "@/components/primitive/squiggly-arrow";
import AnimatedContent from "@/components/primitive/animated-content";
import { Highlighter } from "@/components/primitive/highlighter";
import { Backlight } from "@/components/primitive/backlight";
import StatsCount from "@/components/primitive/statscount";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import { GrainWave } from "@/components/custom/grain-wave";
import { ClosingCta } from "@/pages/ServicesCombined";
import { Testimonials, type Testimonial } from "@/components/primitive/testimonial";

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const toUpperCaseWords = (words: string[]) => words.map((word) => word.toUpperCase());

const WORD_SEQUENCE = toUpperCaseWords([
  "Expertise",
  "People",
  "Ambition",
  "Trust",
  "Connection",
  "Growth",
  "Results",
  "Persevere",
]);

const HIGHLIGHT_WORD = "PERSEVERE";

const TEXT_CLASSES =
  "font-pomelo text-[clamp(1.85rem,7.5vw,7rem)] leading-none tracking-wide text-[var(--color-ivory)]";

const ROTATING_TEXT_CLASSES = `${TEXT_CLASSES} text-left`;

const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

const OUR_SERVICES_ID = "our-services";

function HeroSection() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const navigate = useNavigate();
  const wordRowRef = useRef<HTMLDivElement>(null);
  const wordRowScale = useAutoFitScale(wordRowRef, getCylinderSizeCompensation());

  return (
    <div className="relative flex min-h-[58vh] flex-col items-center justify-center overflow-hidden bg-(--color-terracotta) px-4 pt-10 pb-8 text-center sm:min-h-[60vh] sm:pt-14 sm:pb-10 md:pb-12">
      {/* <Link
        to="/"
        aria-label="Go to home page"
        className="absolute top-4 left-4 z-[60] lg:top-10 lg:left-14"
      >
        <img
          src="/logos/persevere-logo.png"
          alt="Persevere Media"
          className="h-10 w-auto sm:h-12 md:h-24 lg:h-40"
          draggable={false}
        />
      </Link> */}

      <Grainient
        colors={["--color-deep-plum", "--color-terracotta", "--color-amber-gold"]}
        speed={7}
        scale={1}
        noiseIntensity={1.5}
        rotation={0}
        className="absolute inset-0"
      />

      <ClickSpark
        sparkColor="--color-ivory"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1}
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 pt-12 pb-10 text-center sm:pt-16 sm:pb-14 md:pb-16"
      >
        <div
          ref={wordRowRef}
          className="flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-8"
          style={{ transform: `scale(${wordRowScale})`, transformOrigin: "center" }}
        >
          <h1 className={TEXT_CLASSES}>CHOOSE</h1>

          <div className="grid">
            {WORD_SEQUENCE.map((word) => (
              <span
                key={word}
                aria-hidden
                className={`${ROTATING_TEXT_CLASSES} invisible whitespace-nowrap [grid-area:1/1]`}
              >
                {word}
              </span>
            ))}

            <div className="w-full [grid-area:1/1]">
              <CylinderTextRotate
                words={WORD_SEQUENCE}
                duration={1300}
                loop={true}
                className={ROTATING_TEXT_CLASSES}
                highlightWord={HIGHLIGHT_WORD}
                highlightClassName="text-[var(--color-oxblood)]"
                highlightDuration={2800}
              />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[clamp(1.25rem,6vw,1.75rem)] font-pomelo-mono font-black leading-none tracking-wide text-(--color-oxblood) sm:text-[clamp(1.5rem,6vw,2.25rem)]">
          Content & Ads. Done properly. Nae faff.
        </p>

        <div className="mt-4 flex flex-col items-center gap-4 sm:mt-6 sm:flex-row sm:gap-6">
          <SpecularButton
            size="lg"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() => navigate("/about")}
            className="sm:w-50"
          >
            About Us
          </SpecularButton>

          <SpecularButton
            size="lg"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() =>
              document.getElementById(OUR_SERVICES_ID)?.scrollIntoView({ behavior: "smooth" })
            }
            className="sm:w-50"
          >
            Our Services
          </SpecularButton>
        </div>

        <div className="mt-6">
          <YellowPulsatingButton onClick={() => setIsCalendlyOpen(true)}>
            Book a Call
          </YellowPulsatingButton>
        </div>
      </ClickSpark>

      <SectionWave fillColor="--color-ivory" className="z-20 h-20 sm:h-28 md:h-36" />

      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Facts
// ---------------------------------------------------------------------------

const FACTS_BLOCKS = [
  {
    heading: "Proven industry experience.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          £20m+ in ad spend, 50+ brands
        </Highlighter>
        , thousands of hours of experience. We've been there and done it time and again, and{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          have the results to show for it
        </Highlighter>
        .
      </>
    ),
  },
  {
    heading: "The best of both worlds.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          Content and paid ads
        </Highlighter>
        , under one roof. No more choosing between a{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          creative team or an ads agency
        </Highlighter>
        .
      </>
    ),
  },
  {
    heading: "Just two of us to deal with.",
    body: (
      <>
        You get{" "}
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          Keir and Calum
        </Highlighter>
        . The two who are{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          actually doing the work
        </Highlighter>
        . No account managers, no profit-skimming by shareholders, and 100% of your budget going
        exactly where it should be.
      </>
    ),
  },
];

function FactsSection() {
  return (
    <section className="flex flex-col items-center gap-16 bg-(--color-ivory) px-4 pt-24 pb-16 text-center">
      {FACTS_BLOCKS.map((block, i) => (
        <AnimatedContent
          key={block.heading}
          direction="vertical"
          distance={50}
          duration={0.8}
          ease="power3.out"
          threshold={0.2}
          delay={i * 0.15}
        >
          <div className="max-w-xl">
            <h3 className="font-pomelo-mono text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-oxblood)">
              {block.heading}
            </h3>
            <p
              className="mt-3 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {block.body}
            </p>
          </div>
        </AnimatedContent>
      ))}

      <div className="flex aspect-video w-full max-w-3xl items-center justify-center rounded-2xl border-2 border-dashed border-(--color-oxblood)/20 bg-(--color-oxblood)/5 text-(--color-oxblood)/40">
        Placeholder image
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

const STATS = [
  { value: 20, prefix: "£", suffix: "M+", label: "in ad spend managed" },
  { value: 12, suffix: "+", label: "years combined experience" },
  { value: 100, suffix: "%", label: "of your budget going where it should" },
];

function StatsCountSection() {
  return (
    <section className="bg-(--color-ivory) px-4 py-8 text-center">
      {/* text-(--color-oxblood) is set once here and inherits down to the big numbers,
          which have NO colour class of their own in the real component source, that's
          exactly why they were rendering plain black before, nothing was overriding
          the browser default. the title is a real <h2> with its own explicit
          text-sm/font-medium/tracking-wide classes, so matching it to the Facts
          headings needs !important overrides to actually beat those, inheritance alone
          isn't enough when the element already has its own conflicting utility classes */}
      <StatsCount
        stats={STATS}
        title="" // Blank on purpose
        showDividers={false}
        className="mt-10 text-(--color-oxblood) [&_h2]:text-[clamp(1.5rem,3vw,2rem)]! [&_h2]:font-black! [&_h2]:tracking-tight!"
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

const PLACEHOLDER_VIDEO_SRC = "https://www.youtube.com/embed/dQw4w9WgXcQ";

function VideoSection() {
  return (
    <section className="flex flex-col items-center gap-6 bg-(--color-ivory) px-4 py-24 text-center">
      <AnimatedContent
        direction="vertical"
        distance={50}
        duration={0.8}
        ease="power3.out"
        threshold={0.2}
        className="w-full"
      >
        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-oxblood)">
            What we're all about
          </h2>

          <div className="mx-auto mt-8 mb-14 w-full max-w-3xl">
            <Backlight blur={40} className="block w-full">
              <iframe
                className="aspect-video w-full rounded-2xl border-2 border-white"
                src={PLACEHOLDER_VIDEO_SRC}
                title="What we're all about"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </Backlight>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

// PLACEHOLDER content - swap these for real client quotes once we have some
// to show. Left obviously fake rather than invented-but-plausible so nobody
// mistakes this for a genuine review before it's replaced.
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Placeholder for a real client quote.",
    name: "Client Name",
    role: "Role, Company",
  },
];

function TestimonialsSection() {
  return (
    <Testimonials
      testimonials={TESTIMONIALS}
      heading={
        <>
          We could tell you we're great.
          <br />
          Or you could just ask them.
        </>
      }
      subheading="The proof is in the pudding…"
      className="bg-(--color-ivory)"
    />
  );
}

// ---------------------------------------------------------------------------
// Our Services
// ---------------------------------------------------------------------------

const SERVICES_BLOCKS = [
  {
    eyebrow: "ADS",
    heading: "Paid social and PPC, built and run properly.",
    body: (
      <>
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          £20m+ in ad spend
        </Highlighter>{" "}
        managed across budgets from £1,000 a month to £500,000 a month. We design a bespoke
        strategy, test constantly, and evolve with the data. We're not leaving you with{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          an AI agent left on autopilot
        </Highlighter>
        .
      </>
    ),
    to: "/services/keir",
    linkLabel: "Learn more about our ads services",
  },
  {
    eyebrow: "CREATIVE",
    heading: "Thumb-stopping creative, that converts, made by us.",
    body: (
      <>
        We build out your customer avatars, script the copy, and shoot and edit creative to make{" "}
        <Highlighter
          action="highlight"
          color="rgba(237, 176, 62, 0.3)"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          thumb stopping content
        </Highlighter>{" "}
        for your organic pages or your paid campaigns. Crafted by{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          the same team running your campaigns
        </Highlighter>
        , closing the feedback loop, learning and implementing change faster.
      </>
    ),
    to: "/services/calum",
    linkLabel: "Learn more about our creative services",
  },
];

function OurServicesSection() {
  return (
    <section id={OUR_SERVICES_ID} className="bg-(--color-ivory) px-4 py-24 text-center">
      <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-oxblood)">
        The best of both worlds
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Most agencies offer you one service and leave you to find the other. We do both, under one
        roof. We keep it simple, accessible and affordable.
      </p>

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 text-left sm:grid-cols-2">
        {SERVICES_BLOCKS.map((block, i) => (
          <AnimatedContent
            key={block.eyebrow}
            direction="vertical"
            distance={40}
            duration={0.7}
            ease="power3.out"
            threshold={0.2}
            delay={i * 0.1}
            className="h-full"
          >
            <div className="flex h-full flex-col gap-3 rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-8 shadow-[0_12px_44px_-18px_rgba(74,31,29,0.25)]">
              <Link to={block.to} className="group/header w-fit">
                <p
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-(--color-terracotta)"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {block.eyebrow}
                </p>
                <h3 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-black tracking-tight text-(--color-oxblood) transition-colors duration-300 group-hover/header:text-(--color-terracotta)">
                  {block.heading}
                </h3>
              </Link>
              <p
                className="text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-(--color-oxblood)/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {block.body}
              </p>
              <Link
                to={block.to}
                className="group mt-auto inline-flex w-fit items-center gap-1 font-bold text-(--color-terracotta) underline underline-offset-2"
              >
                <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  Learn more
                </span>
                <SquigglyArrow
                  width={120}
                  height={60}
                  strokeWidth={4}
                  variant="bouncy"
                  className="text-current"
                />
              </Link>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why Choose Us
// ---------------------------------------------------------------------------

function WhyChooseSection() {
  const navigate = useNavigate();

  return (
    <GrainWave height="22rem" waveClassName="h-16 sm:h-24 md:h-28" waveTop waveBottom={false}>
      <AnimatedContent
        direction="vertical"
        distance={40}
        duration={0.7}
        ease="power3.out"
        threshold={0.2}
      >
        <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-ivory)">
          Why work with us?
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-ivory)/85"
          style={{ fontFamily: "var(--font-body)" }}
        >
          We're a straight-talking team who'll tell you what you need to hear, not what you want to
          hear. Your wins are our wins.
          <br />
          Ready to come aboard?
        </p>

        <div className="mt-8 flex justify-center">
          <YellowPulsatingButton onClick={() => navigate("/contact")}>
            Get Started
          </YellowPulsatingButton>
        </div>
      </AnimatedContent>
    </GrainWave>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <>
      <HeroSection />
      <FactsSection />
      <SectionDivider />
      <StatsCountSection />
      <SectionDivider reverse />
      <VideoSection />
      <TestimonialsSection />
      <OurServicesSection />
      <div className="flex w-full flex-col items-center bg-(--color-ivory) px-4 py-24">
        <ClosingCta onBookCall={() => setIsCalendlyOpen(true)} />
      </div>
      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
      <WhyChooseSection />
    </>
  );
}
