import { useEffect, useRef, useState } from "react";
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

// this is the IDEAL/preferred size, clamp() alone can't guarantee "CHOOSE" plus every
// possible rotating word actually fits at this size on every screen width, since it has
// no idea how wide any given word renders, it's a blind guess based purely on viewport
// width. the useAutoFitScale hook below measures the real rendered width and shrinks
// this down live (via a CSS transform: scale) whenever it would otherwise overflow,
// which is what actually guarantees no overflow, on any screen, for any word.
const TEXT_CLASSES =
  "text-[clamp(1.6rem,7.5vw,7rem)] font-black leading-none tracking-tighter text-[var(--color-ivory)]";

const ROTATING_TEXT_CLASSES = `${TEXT_CLASSES} text-left`;

const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

/**
 * Measures the natural (unscaled) width of `ref`'s element against its parent's
 * available width, and returns a scale factor (never above 1) to shrink it down by if
 * it would otherwise overflow. Re-measures on mount, on resize, and when the parent's
 * own size changes (e.g. from a layout shift elsewhere on the page).
 *
 * transform: scale() doesn't affect scrollWidth/clientWidth, so this can safely read
 * the element's true natural size on every check without needing to reset anything first.
 */
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

    // the very first fit() above can run before the real webfont has finished loading,
    // measuring against a fallback system font with different character widths gives an
    // inaccurate scale that nothing else would otherwise correct. re-check once the real
    // font is confirmed loaded, plus a couple of short delayed re-checks as a safety net
    // for any other late layout settling (images, animations, etc).
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

export function HeroSection() {
  const navigate = useNavigate();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const wordRowRef = useRef<HTMLDivElement>(null);
  const wordRowScale = useAutoFitScale(wordRowRef);

  return (
    <div className="relative flex min-h-[78vh] flex-col items-center justify-start overflow-hidden bg-(--color-terracotta) px-4 pt-32 pb-20 text-center sm:min-h-[80vh] sm:pb-12 sm:pt-72 md:pt-80">
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

        <div className="mt-6 sm:mt-14 md:mt-20 max-w-2xl space-y-8 px-4">
          <h3 className="text-[clamp(1.15rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
            Creative and paid media,
            <br />
            under one roof.
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
