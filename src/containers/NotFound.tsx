import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
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
          <SpecularButton
            size="lg"
            radius={20}
            textColor="var(--color-oxblood)"
            proximity={260}
            autoAnimate
            aria-label="Go to home page"
            className="p-0! size-20 sm:size-24"
            onClick={() => navigate("/")}
          >
            <Home size={40} strokeWidth={2} aria-hidden="true" />
          </SpecularButton>
        </div>
      </div>
    </section>
  );
}
