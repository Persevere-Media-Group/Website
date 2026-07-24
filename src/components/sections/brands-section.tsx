import { OrbitCarousel, type OrbitCarouselItem } from "@/components/ui/orbiting-carousel";
import { Camera, Megaphone, Rocket, Sparkles, TrendingUp, Target, Zap, Star } from "lucide-react";

// placeholder brand names only, no real logos, swap these out once you're able to use actual client branding.
// icons here are just a nicer-looking stand-in than plain initials, delete the `icon` field once real
// images are ready and it'll fall back to the image, then initials automatically
const PLACEHOLDER_BRANDS: OrbitCarouselItem[] = [
  {
    id: 1,
    name: "Brand One",
    subtitle: "Optional subtitle",
    icon: Camera,
    // image: XXX,
  },
  {
    id: 2,
    name: "Brand Two",
    subtitle: "Optional subtitle",
    icon: Megaphone,
    // image: ,
  },
  {
    id: 3,
    name: "Brand Three",
    subtitle: "Optional subtitle",
    icon: Rocket,
    // image: XXX,
  },
  {
    id: 4,
    name: "Brand Four",
    subtitle: "Optional subtitle",
    icon: Sparkles,
    // image: XXX,
  },
  {
    id: 5,
    name: "Brand Five",
    subtitle: "Optional subtitle",
    icon: TrendingUp,
    // image: XXX,
  },
  {
    id: 6,
    name: "Brand Six",
    subtitle: "Optional subtitle",
    icon: Target,
    // image: XXX,
  },
  {
    id: 7,
    name: "Brand Seven",
    subtitle: "Optional subtitle",
    icon: Zap,
    // image: XXX ,
  },
  {
    id: 8,
    name: "Brand Eight",
    subtitle: "Optional subtitle",
    icon: Star,
    // image: XXX,
  },
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
