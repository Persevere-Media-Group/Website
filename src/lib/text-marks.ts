// Shared `Highlighter` config used wherever body copy gets a hand-drawn
// highlight/underline mark (Home, About, the two Services pages).

// sketchy hand-drawn feel that draws itself as it scrolls into view
export const MARK_PROPS = {
  triggerOnView: true,
  animationDuration: 1000,
  iterations: 2,
} as const;

// terracotta underline, reads like a red pen marking up what's wrong
export const UNDERLINE_COLOR = "#d5573b";
// soft amber highlight, warm and positive rather than critical
export const HIGHLIGHT_COLOR = "rgba(237, 176, 62, 0.3)";
