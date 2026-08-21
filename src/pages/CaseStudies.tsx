import { PageHero, Placeholder } from "@/components/custom/common-page-elements";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact and About pages).
export function CaseStudies() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <PageHero>Case Studies</PageHero>

      <Placeholder />
    </section>
  );
}
