import { PageHero } from "@/components/custom/common-page-elements";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact, About, Blog, and Case Studies pages).
export function Services() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <PageHero size="md">Our Services</PageHero>

      <div className="flex w-full flex-col items-center gap-4 px-4 pt-16 pb-24 text-center sm:pt-20">
        <h2 className="font-subtitle text-[clamp(2rem,5vw,3.5rem)] font-black tracking-wide text-(--color-oxblood)">
          Services page placeholder
        </h2>
        <p className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
          Real content goes here once it's ready.
        </p>
      </div>
    </section>
  );
}
