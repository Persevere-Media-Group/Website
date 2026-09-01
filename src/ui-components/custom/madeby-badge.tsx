/**
 * A small "sticker" badge linking out to the maker's own site, sits next to the
 * Instagram handles in the nav panel. Renders Iona's own "ik" wordmark (the
 * font-face and .ik-logo/.letter-i/.letter-k rules come from
 * public/logos/ionakate.css, linked in index.html) rather than site type, sized
 * down from that file's 3rem default via an inline style so it fits the slot.
 * Becomes a click cursor on hover via the outer <a>, entirely separate from
 * whatever pointer/cursor behaviour the socials list itself has.
 *
 * On hover, a "made by" label slides out to the left of the wordmark. It's
 * absolutely positioned (docked to the logo's left edge via right-full)
 * rather than laid out inline, so it never changes the <a>'s own box size -
 * the SparkleHover wrapper sizes itself to that box, and the footer row
 * around it, so an inline reveal would otherwise stretch the sparkle
 * positions and shove the Privacy Policy link over. At rest it's translated
 * a full label-width to the right (tucked behind the logo) and transparent;
 * on hover it slides further left than its docked position (past right-full,
 * clearing the sparkle constellation around the logo) and fades in, so it
 * reads as emerging from the logo and retracting back into it, not just
 * fading in place.
 */
export function MadeByBadge() {
  return (
    <a
      href="https://ionakate.uk"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Opens ionakate.uk in a new tab"
      className="group relative inline-flex shrink-0 cursor-pointer items-center text-(--color-ivory)/30 transition-colors duration-200 hover:text-(--color-ivory)/70"
    >
      <span className="pointer-events-none absolute top-1/2 right-full flex -translate-y-1/2 translate-x-full items-center whitespace-nowrap text-sm text-(--color-ivory)/50 opacity-0 transition-all duration-300 ease-out group-hover:-translate-x-3 group-hover:opacity-100">
        built by&nbsp;
      </span>
      <span className="ik-logo" style={{ fontSize: "3rem" }}>
        <span className="letter-i">i</span>
        <span className="letter-k">k</span>
      </span>
    </a>
  );
}
