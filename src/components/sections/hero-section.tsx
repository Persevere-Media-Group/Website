import { CylinderTextRotate } from "@/components/ui/cylinder-text-rotate";
import { ClickSpark } from "@/components/ui/click-spark";

// keeps every word in the sequence uppercase, no matter how it's typed below
const toUpperCaseWords = (words: string[]) => words.map((word) => word.toUpperCase());

// a trainspotting "choose life" style run, cycling through before it lands on the final word
const WORD_SEQUENCE = toUpperCaseWords(["Expertise", "People", "Growth", "Results", "Persevere"]);

const ROTATING_TEXT_CLASSES =
  "text-[clamp(2rem,7vw,6rem)] font-black leading-none tracking-tighter text-white text-left";

export function HeroSection() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#d5573b] px-4 py-12 text-center">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* fills the whole hero, so clicking anywhere across it triggers a burst of white sparks */}
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1}
        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex flex-nowrap items-center justify-center gap-x-4">
          <h1 className="text-[clamp(2rem,7vw,6rem)] font-black leading-none tracking-tighter text-white">
            CHOOSE
          </h1>

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
                duration={700}
                loop={false}
                className={ROTATING_TEXT_CLASSES}
              />
            </div>
          </div>
        </div>
      </ClickSpark>
    </div>
  );
}
