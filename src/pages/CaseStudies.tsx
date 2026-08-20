import { GrainWave } from "@/components/custom/grain-wave";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact and About pages).
export function CaseStudies() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 font-heading text-[clamp(2.5rem,6vw,4rem)] tracking-tighter text-(--color-ivory)">
          Case Studies
        </h1>
      </GrainWave>

      <div className="flex w-full flex-col items-center gap-4 px-4 pt-16 pb-24 text-center sm:pt-20">
        <h2 className="font-subtitle text-[clamp(2rem,5vw,3.5rem)] font-black tracking-wide text-(--color-oxblood)">
          Case Studies page placeholder
        </h2>
        <p
          className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
        >
          Real content goes here once it's ready.
        </p>
      </div>
    </section>
  );
}
