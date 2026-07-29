interface SectionWaveProps {
  // a CSS variable name (e.g. "--color-ivory") or a literal colour, both work
  fillColor?: string;
  className?: string;
  // mirrors the curve vertically, useful if you want the same shape capping the top of a section instead
  flip?: boolean;
  // turns the rolling animation on/off; false falls back to a static wave
  animated?: boolean;
  // seconds per loop, lower is faster, higher feels slower and more like a calm ocean
  speed?: number;
}

export function SectionWave({
  fillColor = "--color-ivory",
  className,
  flip = false,
  animated = true,
  speed = 18,
}: SectionWaveProps) {
  // SVG's fill attribute can't parse var() directly, but the CSS fill property can,
  // so this is applied via inline style rather than the fill prop itself
  const resolvedFill = fillColor.startsWith("--") ? `var(${fillColor})` : fillColor;

  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 bottom-0 w-full overflow-hidden ${flip ? "rotate-180" : ""} ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        className="block h-full"
        style={{
          width: animated ? "200%" : "100%",
          animation: animated ? `section-wave-roll ${speed}s linear infinite` : undefined,
        }}
      >
        <path
          d="M0,64 C180,20 540,20 720,64 C900,108 1260,108 1440,64 C1620,20 1980,20 2160,64 C2340,108 2700,108 2880,64 L2880,120 L0,120 Z"
          style={{ fill: resolvedFill }}
        />
      </svg>
      {/* a static, non-animated strip pinned to the very bottom edge, covers any subpixel
          rendering gap the rolling animation can leave along the seam on some mobile browsers */}
      <div
        className="absolute inset-x-0 bottom-0 h-0.5"
        style={{ backgroundColor: resolvedFill }}
      />
    </div>
  );
}
