import { useNavigate } from "react-router-dom";
import FuzzyText from "@/components/ui/FuzzyText";
import SpecularButton from "@/components/ui/SpecularButton";
import DotField from "@/components/ui/DotField";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-(--color-ivory) px-4 text-center">
      {/* sits behind everything as a subtle interactive texture.
          NOTE: colour props here are literal hex, not CSS variables, this component is
          canvas/WebGL driven like SpecularButton and Grainient, and those don't resolve
          var(--color-...) strings the way real DOM CSS properties do.
          glowColor below is a PLACEHOLDER dark oxblood-ish tone, swap for the real
          --color-oxblood hex once you confirm it. */}
      <div
        className="dot-field-container"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#d5573b"
          gradientTo="#edb03e"
          glowColor="#edb03e"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 pointer-events-none">
        <FuzzyText
          fontSize="clamp(4rem, 18vw, 12rem)"
          fontWeight={900}
          color="#d5573b"
          enableHover
          baseIntensity={0.15}
          hoverIntensity={0.4}
        >
          404
        </FuzzyText>

        <p
          className="text-[clamp(1.1rem,2.4vw,1.6rem)] font-black tracking-tight text-(--color-terracotta)"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Looks like this page wandered off the map.
        </p>
        <p
          className="max-w-md text-[clamp(0.95rem,1.6vw,1.05rem)] text-(--color-terracotta)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Whatever you were looking for isn't here.
          <br />
          Let's get you back on track.
        </p>

        <div className="mt-4 pointer-events-auto">
          <SpecularButton
            size="lg"
            radius={18}
            tint="var(--color-amber-gold)"
            tintOpacity={0.3}
            blur={0}
            textColor="#5c2018"
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
            onClick={() => navigate("/")}
          >
            Back to Home
          </SpecularButton>
        </div>
      </div>
    </section>
  );
}
