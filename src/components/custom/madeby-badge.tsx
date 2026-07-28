/**
 * A small "sticker" badge linking out to the maker's own site, sits next to the
 * Instagram handles in the nav panel. Renders Iona's own "ik" wordmark (the
 * font-face and .ik-logo/.letter-i/.letter-k rules come from
 * public/logos/ionakate.css, linked in index.html) rather than site type, sized
 * down from that file's 3rem default via an inline style so it fits the slot.
 * Becomes a click cursor on hover via the outer <a>, entirely separate from
 * whatever pointer/cursor behaviour the socials list itself has.
 */
export function MadeByBadge() {
  return (
    <a
      href="https://ionakate.uk"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Opens ionakate.uk in a new tab"
      className="group inline-flex shrink-0 cursor-pointer items-center text-(--color-ivory)/30 transition-colors duration-200 hover:text-(--color-amber-gold)"
    >
      <span className="ik-logo" style={{ fontSize: "5rem" }}>
        <span className="letter-i">i</span>
        <span className="letter-k">k</span>
      </span>
    </a>
  );
}
