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

// shared ivory colour, matches CHOOSE and every rotating word except the highlighted one
const TEXT_CLASSES =
  "text-[clamp(2.25rem,8vw,7rem)] font-black leading-none tracking-tighter text-[var(--color-ivory)]";

const ROTATING_TEXT_CLASSES = `${TEXT_CLASSES} text-left`;

export function HeroSection() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-start overflow-hidden bg-(--color-terracotta) px-4 pt-48 pb-12 text-center sm:pt-56 md:pt-64">
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
        className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-32 text-center sm:pt-40 md:pt-48"
      >
        <div className="flex flex-nowrap items-center justify-center" style={{ gap: "2em" }}>
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

        <div className="mt-10 sm:mt-14 md:mt-20 max-w-2xl space-y-8 px-4">
          <p
            className="text-[clamp(1.05rem,2.2vw,1.4rem)] font-normal leading-relaxed tracking-normal text-(--color-oxblood)"
            style={{ fontFamily: "var(--font-metamorphous)" }}
          >
            Camera to campaign, all under one roof.
            <br />
          </p>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12">
          {/* placeholder glass button, same component now used for the nav toggle, swap copy/props once real CTA is decided */}
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
            onClick={() => console.log("clicked")}
          >
            Get Started
          </SpecularButton>
        </div>
      </ClickSpark>
      {/* solid ivory curve capping the bottom of the hero, sits above all the animated layers
          so it reads as a clean edge rather than picking up the grain or gradient underneath it */}
      <SectionWave fillColor="--color-ivory" className="z-20 h-20 sm:h-28 md:h-36" />
    </div>
  );
}
