import { PageHero, Placeholder } from "@/components/custom/common-page-elements";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact, About, Blog, and Case Studies pages).
export function Services() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <PageHero size="md">Our Services</PageHero>

      <Placeholder />
    </section>
  );
}
