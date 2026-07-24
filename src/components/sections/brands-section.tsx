import { OrbitCarousel, type OrbitCarouselItem } from "@/components/ui/orbiting-carousel";

// placeholder brand names only, no real logos, swap these out once you're able to use actual client branding
const PLACEHOLDER_BRANDS: OrbitCarouselItem[] = [
  { id: 1, name: "Brand One" },
  { id: 2, name: "Brand Two" },
  { id: 3, name: "Brand Three" },
  { id: 4, name: "Brand Four" },
  { id: 5, name: "Brand Five" },
  { id: 6, name: "Brand Six" },
  { id: 7, name: "Brand Seven" },
  { id: 8, name: "Brand Eight" },
];

export function BrandsSection() {
  return (
    <section className="flex flex-col items-center gap-4 bg-(--color-ivory) px-4 py-24 text-center">
      <p
        className="text-[clamp(0.75rem,1.6vw,0.95rem)] font-semibold uppercase tracking-[0.2em] text-(--color-oxblood)/60"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Welcome to our world
      </p>
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-oxblood)">
        Brands we work with
      </h2>

      <OrbitCarousel items={PLACEHOLDER_BRANDS} className="mt-8" />
    </section>
  );
}
