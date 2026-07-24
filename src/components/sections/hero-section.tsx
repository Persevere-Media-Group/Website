import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopupModal } from "react-calendly";
import { CylinderTextRotate } from "@/components/ui/cylinder-text-rotate";
import { ClickSpark } from "@/components/ui/click-spark";
import { Grainient } from "@/components/ui/grainient";
import { SectionWave } from "@/components/ui/section-wave";
import SpecularButton from "@/components/ui/SpecularButton";

// keeps every word in the sequence uppercase, no matter how it's typed below
const toUpperCaseWords = (words: string[]) => words.map((word) => word.toUpperCase());

// a trainspotting "choose life" style run, cycling continuously through the list
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

// the one word on the drum that gets its own colour and lingers longer, drawing the eye each time it comes round
const HIGHLIGHT_WORD = "PERSEVERE";

// shared ivory colour, matches CHOOSE and every rotating word except the highlighted one.
// floor lowered from 2.25rem to 1.6rem: "CHOOSE" plus the longest rotating word
// (CONNECTION/EXPERTISE/PERSEVERE) needs to stay on one line down to ~320px wide phones,
// and 2.25rem was too large to guarantee that without overflowing off-screen.
const TEXT_CLASSES =
  "text-[clamp(1.6rem,7.5vw,7rem)] font-black leading-none tracking-tighter text-[var(--color-ivory)]";

const ROTATING_TEXT_CLASSES = `${TEXT_CLASSES} text-left`;

const CALENDLY_URL = "https://calendly.com/your-username/your-event";

export function HeroSection() {
  const navigate = useNavigate();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <div className="relative flex min-h-[65vh] flex-col items-center justify-start overflow-hidden bg-(--color-terracotta) px-4 pt-32 pb-12 text-center sm:min-h-[80vh] sm:pt-72 md:pt-80">
      {/* animated brand gradient with grain texture, sits directly on the fallback bg colour */}
      <Grainient
        colors={["--color-deep-plum", "--color-terracotta", "--color-amber-gold"]}
        speed={7}
        scale={1}
        noiseIntensity={1.5}
        rotation={0}
        className="absolute inset-0"
      />
      {/* fills the whole hero, so clicking anywhere across it triggers a burst of ivory sparks */}
      <ClickSpark
        sparkColor="--color-ivory"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1}
        className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-32 text-center sm:pt-72 md:pt-80"
      >
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-8">
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

        <div className="mt-6 sm:mt-14 md:mt-20 max-w-2xl space-y-8 px-4">
          <h3 className="text-[clamp(1.15rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
            From content to campaign,
            <br />
            all under one roof.
          </h3>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:gap-6 md:mt-12">
          {/* navigates to the services page, same glass button used for the nav toggle */}
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

          {/* opens Calendly as an overlay on top of the current page, rather than
              navigating away to calendly.com, so the visitor never leaves the site.
              deliberately still glass, not solid, so it doesn't out-compete the brand
              name for attention. emphasis comes from: autoAnimate keeping a gentle shine
              always moving, a stronger (but still translucent) amber tint, and a soft
              amber glow around the edge, rather than from size or a dark fill.
              note: lineColor/baseColor are parsed by ogl's own Color class in JS, not
              real CSS, so var(--color-amber-gold) doesn't resolve here the way it does
              for tint (which IS a real inline CSS custom property). literal hex only. */}
          <SpecularButton
            size="lg"
            radius={18}
            tint="var(--color-amber-gold)"
            tintOpacity={0.3}
            blur={0}
            textColor="#f5f5f5"
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
            className="shadow-[0_0_28px_-6px_var(--color-amber-gold)]"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Book a Call
          </SpecularButton>
        </div>
      </ClickSpark>
      {/* solid ivory curve capping the bottom of the hero, sits above all the animated layers
          so it reads as a clean edge rather than picking up the grain or gradient underneath it */}
      <SectionWave fillColor="--color-ivory" className="z-20 h-20 sm:h-28 md:h-36" />

      {/* Calendly's own popup modal, only mounted/rendered while open, closes itself
          via onModalClose. rootElement needs a real DOM node Calendly can portal into,
          your app's root div works fine for this. */}
      <PopupModal
        url={CALENDLY_URL}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </div>
  );
}
