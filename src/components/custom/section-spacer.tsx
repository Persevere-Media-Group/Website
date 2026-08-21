// a plain vertical gap to drop between homepage sections, alongside SectionDivider,
// so inter-section spacing is set explicitly here rather than baked into each
// section's own padding (which made gaps compound unpredictably wherever two
// padded sections met, or a divider sat between two already-padded sections)
const SPACER_SIZES = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
} as const;

export function SectionSpacer({ size = "md" }: { size?: keyof typeof SPACER_SIZES }) {
  return <div className={`${SPACER_SIZES[size]} bg-(--color-ivory)`} aria-hidden />;
}
