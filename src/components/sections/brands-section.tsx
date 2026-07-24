import { IconCloud } from "@/components/ui/icon-cloud";

// placeholder brand names only, no real logos, swap these out once you're able to use actual client branding
const PLACEHOLDER_BRANDS = [
  "Brand One",
  "Brand Two",
  "Brand Three",
  "Brand Four",
  "Brand Five",
  "Brand Six",
  "Brand Seven",
  "Brand Eight",
  "Brand Nine",
  "Brand Ten",
];

// turns "Brand One" into "BO", or the first two letters of a single word if there's no space
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// NOTE: these two hex values are placeholders, --color-ivory is confirmed as #f7f3e3
// from index.css, but --color-oxblood is still unconfirmed, swap it for the real value.
// this MUST stay hardcoded hex, not var(--color-oxblood), since this SVG is serialised
// with renderToString and rendered as an isolated data:image/svg+xml source with no
// access to the page's stylesheet, CSS custom properties cannot resolve inside it.
const BADGE_FILL = "#f7f3e3"; // --color-ivory, confirmed
const BADGE_STROKE = "#5c2018"; // --color-oxblood, UNCONFIRMED, replace with real hex

function BrandBadge({ name }: { name: string }) {
  const initials = getInitials(name);
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <circle cx="45" cy="45" r="43" fill={BADGE_FILL} stroke={BADGE_STROKE} strokeWidth="2" />
      <text
        x="45"
        y="45"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="28"
        fill={BADGE_STROKE}
      >
        {initials}
      </text>
    </svg>
  );
}

export function BrandCloudSection() {
  const icons = PLACEHOLDER_BRANDS.map((name) => <BrandBadge key={name} name={name} />);

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

      <div className="relative mt-8 flex items-center justify-center">
        <IconCloud icons={icons} />
      </div>
    </section>
  );
}
