import { SpinningText } from "@/components/ui/spinning-text";

/**
 * A small circular "sticker" badge linking out to the maker's own site, sits next to
 * the Instagram handles in the nav panel. Becomes a click cursor on hover via the
 * outer <a>, entirely separate from whatever pointer/cursor behaviour the socials
 * list itself has.
 */
export function MadeByBadge() {
  return (
    <a
      href="https://ionakate.uk"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Made with love by Iona, opens ionakate.uk in a new tab"
      className="group relative inline-flex size-16 shrink-0 cursor-pointer items-center justify-center"
    >
      <SpinningText
        duration={10}
        radius={7}
        className="text-[9px] -translate-x-12 -translate-y-6 font-semibold uppercase tracking-widest text-(--color-ivory)/70 transition-colors duration-200 group-hover:text-(--color-amber-gold)"
      >
        Made with love by Iona ♥
      </SpinningText>
    </a>
  );
}
