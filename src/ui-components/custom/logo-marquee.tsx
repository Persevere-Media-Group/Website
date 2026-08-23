import type { ReactNode } from "react";
import "./logo-marquee.css";
import { Marquee } from "@/ui-components/primitive/marquee";
import { DisplayHeading } from "@/ui-components/custom/display-heading";

// Client logos rendered via the CSS-mask classes in public/logos (.logo--*),
// scrolling in an infinite Marquee. Each entry's height comes from the
// brand file's own --logo-h so wordmarks and badge marks sit at a
// consistent visual weight rather than a uniform bounding box.
const LOGOS = [
  { slug: "aspire-bidding", name: "Aspire Bidding" },
  { slug: "brig-car-sales", name: "Brig Car Sales" },
  { slug: "cinegrams", name: "Cinegrams" },
  { slug: "common", name: "Common" },
  { slug: "founders", name: "Founders" },
  { slug: "ionakate", name: "Iona Kate" },
  { slug: "jacksons-arc", name: "Jackson's Arc" },
  { slug: "myexecutor", name: "MyExecutor" },
  { slug: "one-week", name: "One Week" },
  { slug: "pieute", name: "Pieute" },
  { slug: "scottish-marketing-summit", name: "Scottish Marketing Summit" },
  { slug: "talo", name: "Talo" },
] as const;

export function LogoMarquee({
  heading = "Brands we've worked with",
  subheading,
  className = "",
}: {
  heading?: ReactNode;
  subheading?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden px-4 py-4 text-center ${className}`}>
      <DisplayHeading subheading={subheading}>{heading}</DisplayHeading>

      <div className="relative mx-auto mt-14 max-w-5xl [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <Marquee pauseOnHover className="text-[3.5rem] [--duration:32s] [--gap:4.5rem]">
          {LOGOS.map((logo) => (
            <div
              key={logo.slug}
              role="img"
              aria-label={logo.name}
              title={logo.name}
              className={`logo--${logo.slug} text-(--color-oxblood)/35 transition-colors duration-300 hover:text-(--color-oxblood)/70`}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
