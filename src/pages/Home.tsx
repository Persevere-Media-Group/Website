import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopupModal } from "react-calendly";
import { motion, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";
import { CylinderTextRotate } from "@/components/primitive/cylinder-text-rotate";
import { ClickSpark } from "@/components/primitive/click-spark";
import { Grainient } from "@/components/primitive/grainient";
import { SectionWave } from "@/components/primitive/section-wave";
import SpecularButton from "@/components/primitive/specular-button";
import AnimatedContent from "@/components/primitive/animated-content";
import { Highlighter } from "@/components/primitive/highlighter";
import { Backlight } from "@/components/primitive/backlight";
import StatsCount from "@/components/primitive/statscount";

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
  "text-[clamp(1.85rem,7.5vw,7rem)] font-black leading-none tracking-tighter text-[var(--color-ivory)]";

const ROTATING_TEXT_CLASSES = `${TEXT_CLASSES} text-left`;

const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

function useAutoFitScale(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      const parent = el.parentElement;
      if (!parent) return;
      const naturalWidth = el.scrollWidth;
      const availableWidth = parent.clientWidth;
      const nextScale =
        availableWidth > 0 && naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
      setScale(nextScale);
    };

    fit();

    document.fonts.ready.then(fit);
    const settleTimeout1 = setTimeout(fit, 150);
    const settleTimeout2 = setTimeout(fit, 500);

    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      clearTimeout(settleTimeout1);
      clearTimeout(settleTimeout2);
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref]);

  return scale;
}

function HeroSection() {
  const navigate = useNavigate();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const wordRowRef = useRef<HTMLDivElement>(null);
  const wordRowScale = useAutoFitScale(wordRowRef);

  return (
    <div className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden bg-(--color-terracotta) px-4 pt-28 pb-32 text-center sm:min-h-[80vh] sm:pt-32 sm:pb-40 md:pb-48">
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
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 pt-28 pb-32 text-center sm:pt-32 sm:pb-40 md:pb-48"
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

        <p className="mt-16 text-center text-[clamp(1.25rem,6vw,1.75rem)] font-black leading-none tracking-tighter text-(--color-oxblood) sm:text-[clamp(1.5rem,8vw,3rem)]">
          Content and ads, done properly.
          <br />
          Nae faff.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
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
            onClick={() => navigate("/services")}
          >
            Our Services
          </SpecularButton>

          <SpecularButton
            size="lg"
            radius={18}
            tint="var(--color-amber-gold)"
            tintOpacity={0.3}
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
            className="shadow-[0_0_28px_-6px_var(--color-amber-gold)]"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Book a Call
          </SpecularButton>
        </div>
      </ClickSpark>

      {/* nudges the visitor to keep scrolling, soft bounce rather than a sharp one
          so it reads as a gentle hint, not an alert. absolutely positioned off the
          hero's own bottom edge (not normal flow) so it can sit right above the
          wave without adding to the section's height */}
      <ChevronDown
        aria-hidden
        className="absolute bottom-40 left-1/2 z-20 h-7 w-7 -translate-x-1/2 animate-bounce text-(--color-oxblood) sm:bottom-57.5 md:bottom-75"
      />

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
        , thousands of hours in the edit. This attitude{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          comes with a track record
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
        . The two{" "}
        <Highlighter
          action="underline"
          color="#d5573b"
          triggerOnView
          animationDuration={1000}
          iterations={2}
        >
          actually doing the work
        </Highlighter>
        . No account managers, no shareholders skimming the top.
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
            <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
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
    </section>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

// a thin decorative pen-stroke break between two ivory sections. deliberately NOT
// built from SectionWave, that component is a solid FILLED shape meant to cap a full
// section, squeezing it into a short container just clips most of the fill away and
// leaves a thick flat-bottomed band rather than a line. this is a genuine stroked path,
// no fill, so it reads as a single wavy line rather than a solid block. reused twice
// on this page, once above the Stats section and once below it, for symmetry.
// the same wave unit (C120,5 240,75 360,40, a 360-wide period) repeated twice
// back to back, so the two halves of this 2880-wide path tile seamlessly.
// paired with the "section-wave-roll" keyframes (0% -> -50% translateX, the
// same trick SectionWave uses for the ivory wave up top), that lets the line
// scroll sideways forever without ever showing a seam, rather than morphing
// or inverting in place
const DIVIDER_PATH =
  "M0,40 C120,5 240,75 360,40 C480,5 600,75 720,40 C840,5 960,75 1080,40 C1200,5 1320,75 1440,40 C1560,5 1680,75 1800,40 C1920,5 2040,75 2160,40 C2280,5 2400,75 2520,40 C2640,5 2760,75 2880,40";

// the exact same curve, traced from the opposite end (each segment's control
// points swapped, points visited high-x to low-x). the roll animation only
// ever transforms the whole <svg>, so it doesn't care which way the path is
// wound, but the pathLength draw-in always grows from this string's first
// point toward its last, so this is what lets the draw start on whichever
// side the wave is about to scroll away from
const DIVIDER_PATH_REVERSED =
  "M2880,40 C2760,75 2640,5 2520,40 C2400,75 2280,5 2160,40 C2040,75 1920,5 1800,40 C1680,75 1560,5 1440,40 C1320,75 1200,5 1080,40 C960,75 840,5 720,40 C600,75 480,5 360,40 C240,75 120,5 0,40";

function SectionDivider({ reverse = false }: { reverse?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  // same trigger pattern as Highlighter: animate once, slightly before it's
  // fully on screen, rather than replaying every time it scrolls into view
  const isInView = useInView(svgRef, { once: true, margin: "-10%" });
  const [hasDrawn, setHasDrawn] = useState(false);

  return (
    <div className="flex w-full items-center justify-center bg-(--color-ivory) py-4">
      <div className="h-14 w-full max-w-5xl overflow-hidden px-4">
        <svg
          ref={svgRef}
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
          className="block h-full"
          style={{
            width: "200%",
            animation: hasDrawn
              ? `section-wave-roll 16s linear infinite${reverse ? " reverse" : ""}`
              : undefined,
          }}
          aria-hidden
        >
          <motion.path
            // section-wave-roll (no reverse) shifts the SVG left over time, so
            // features travel right-to-left, meaning the draw-in should start
            // from the right too, hence the reversed-order path; "reverse" plays
            // that same animation backward (features travel left-to-right), so
            // it draws in from the ordinary left-to-right path instead
            d={reverse ? DIVIDER_PATH : DIVIDER_PATH_REVERSED}
            fill="none"
            stroke="var(--color-terracotta)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            onAnimationComplete={() => setHasDrawn(true)}
          />
        </svg>
      </div>
    </div>
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
        title=" " // Blank on purpose
        showDividers
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
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-oxblood)">
            What we're all about
          </h2>

          <div className="mt-8 mb-14 w-full max-w-350">
            <Backlight blur={40} className="w-full">
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
// Page
// ---------------------------------------------------------------------------

export function Home() {
  return (
    <>
      <HeroSection />
      <FactsSection />
      <SectionDivider />
      <StatsCountSection />
      <SectionDivider reverse />
      <VideoSection />
    </>
  );
}
