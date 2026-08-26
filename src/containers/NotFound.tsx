import { useNavigate } from "react-router-dom";
import FuzzyText from "@/ui-components/primitive/fuzzy-text";
import SpecularButton from "@/ui-components/primitive/specular-button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-(--color-ivory) px-4 text-center">
      <div className="relative z-10 flex flex-col items-center gap-6 pointer-events-none">
        <FuzzyText
          className="font-fun"
          fontSize="clamp(4rem, 18vw, 12rem)"
          fontWeight={900}
          color="#d5573b"
          enableHover
          baseIntensity={0.15}
          hoverIntensity={0.4}
        >
          404
        </FuzzyText>

        <p className="font-subtitle text-[clamp(1.1rem,2.4vw,1.6rem)] font-black tracking-wide text-(--color-terracotta)">
          Looks like this page wandered off the map.
        </p>
        <p className="max-w-md text-[clamp(0.95rem,1.6vw,1.05rem)] text-(--color-terracotta)/80">
          Whatever you were looking for isn't here.
          <br />
          Let's get you back on track.
        </p>

        <div className="mt-4 pointer-events-auto">
          {/* size stays "lg" so mobile is untouched, the sm: overrides bump it up to
              match .specular-button--xl's own font-size/padding values from the sm
              breakpoint up, rather than switching the size prop itself (which has no
              responsive concept, it's just one fixed string per render) */}
          <SpecularButton
            size="lg"
            tint="var(--color-terracotta)"
            tintOpacity={0.5}
            intensity={0.8}
            autoAnimate
            className="sm:text-[1.35rem]! sm:p-[24px_52px]!"
            onClick={() => navigate("/")}
          >
            Back to Home
          </SpecularButton>
        </div>
      </div>
    </section>
  );
}
