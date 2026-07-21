interface SectionWaveProps {
  // a CSS variable name (e.g. "--color-ivory") or a literal colour, both work
  fillColor?: string;
  className?: string;
  // mirrors the curve vertically, useful if you want the same shape capping the top of a section instead
  flip?: boolean;
}

export function SectionWave({
  fillColor = "--color-ivory",
  className,
  flip = false,
}: SectionWaveProps) {
  // SVG's fill attribute can't parse var() directly, but the CSS fill property can,
  // so this is applied via inline style rather than the fill prop itself
  const resolvedFill = fillColor.startsWith("--") ? `var(${fillColor})` : fillColor;

  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
      className={`absolute inset-x-0 bottom-0 w-full ${flip ? "rotate-180" : ""} ${className ?? ""}`}
    >
      <path
        d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z"
        style={{ fill: resolvedFill }}
      />
    </svg>
  );
}
