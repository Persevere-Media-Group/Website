import { useNavigate } from "react-router-dom";
import FuzzyText from "@/components/ui/FuzzyText";
import SpecularButton from "@/components/ui/SpecularButton";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-(--color-terracotta) px-4 text-center">
      <FuzzyText
        fontSize="clamp(4rem, 18vw, 12rem)"
        fontWeight={900}
        color="#f7f3e3"
        enableHover
        baseIntensity={0.15}
        hoverIntensity={0.4}
      >
        404
      </FuzzyText>

      <p
        className="text-[clamp(1.1rem,2.4vw,1.6rem)] font-black tracking-tight text-(--color-oxblood)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Looks like this page wandered off the map.
      </p>
      <p
        className="max-w-md text-[clamp(0.95rem,1.6vw,1.05rem)] text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Whatever you were looking for isn't here.
        <br />
        Let's get you back on track.
      </p>

      <div className="mt-4">
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
          onClick={() => navigate("/")}
        >
          Back to Home
        </SpecularButton>
      </div>
    </section>
  );
}
