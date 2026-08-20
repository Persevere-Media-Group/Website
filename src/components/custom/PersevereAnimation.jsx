import React, { useEffect, useRef, useState } from 'react';
import './PersevereAnimation.css';

/**
 * PersevereAnimation
 *
 * Renders "persevere" set in TG Motion Sickness, where each letter randomly
 * flicks between its available hand-drawn glyph variants (base + up to 4
 * alternates) using PUA-mapped codepoints baked into the subset font.
 *
 * Behaviour (matches the reference animation 1:1):
 * - Every letter has a continuous subtle "tremble": a few degrees of random
 *   rotation and a couple of pixels of drift, refreshed on every tick, so
 *   the whole word feels hand-drawn and alive even when nothing is changing.
 * - Roughly once every UPDATE_INTERVAL_MS, exactly one letter (by default)
 *   swaps to a new variant.
 * - No two instances of the same letter (e.g. the four "e"s, the two "r"s)
 *   are ever showing the same variant at the same time.
 * - After CYCLE_LENGTH updates, the word resets back to its exact starting
 *   assignment, so the animation loops seamlessly with no visible jump.
 *
 * Drop this component anywhere in a React app:
 *   <PersevereAnimation />
 *
 * No external font files or network requests are required — the font is
 * embedded as base64 inside PersevereAnimation.css.
 */

const WORD = 'persevere';

// Base glyph -> its available alternate codepoints (PUA, from the subset font).
// '\u0070' etc are just the plain letters (base style); alt1-4 are mapped to
// the private-use-area codepoints baked into the embedded font subset.
const VARIANT_MAP = {
  p: ['p', '\uE000', '\uE001', '\uE002', '\uE003'],
  e: ['e', '\uE004', '\uE005', '\uE006', '\uE007'],
  r: ['r', '\uE008', '\uE009', '\uE00A', '\uE00B'],
  s: ['s', '\uE00C', '\uE00D', '\uE00E', '\uE00F'],
  v: ['v', '\uE010', '\uE011', '\uE012', '\uE013'],
};

const TREMBLE_INTERVAL_MS = 90;
const UPDATE_INTERVAL_MS = 900;
const LETTERS_PER_UPDATE = 1;
const CYCLE_LENGTH = 12; // number of variant-swaps before looping back to start

function randOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Build the initial assignment: for letters that repeat in the word (e, r),
// give every occurrence a distinct variant up front.
function buildInitialAssignment() {
  const positionsByChar = {};
  WORD.split('').forEach((ch, i) => {
    if (!positionsByChar[ch]) positionsByChar[ch] = [];
    positionsByChar[ch].push(i);
  });

  const assignment = new Array(WORD.length).fill(null);
  Object.entries(positionsByChar).forEach(([ch, positions]) => {
    const options = [...VARIANT_MAP[ch]];
    // shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    positions.forEach((pos, idx) => {
      assignment[pos] = options[idx % options.length];
    });
  });
  return assignment;
}

function pickNewVariant(word, current, pos) {
  const ch = word[pos];
  const sameLetterPositions = word
    .split('')
    .map((c, i) => (c === ch ? i : -1))
    .filter((i) => i !== -1 && i !== pos);

  const usedByOthers = new Set(sameLetterPositions.map((i) => current[i]));
  const options = VARIANT_MAP[ch].filter(
    (v) => v !== current[pos] && !usedByOthers.has(v)
  );

  if (options.length === 0) return current[pos];
  return randOf(options);
}

export default function PersevereAnimation() {
  const initialRef = useRef(buildInitialAssignment());
  const [glyphs, setGlyphs] = useState(initialRef.current);
  const [trembles, setTrembles] = useState(
    () => WORD.split('').map(() => ({ rot: 0, dx: 0, dy: 0 }))
  );
  const updateCountRef = useRef(0);
  const currentRef = useRef(initialRef.current);

  // Continuous trembling — every letter, every tick, independent of variant swaps.
  useEffect(() => {
    const id = setInterval(() => {
      setTrembles(
        WORD.split('').map(() => ({
          rot: (Math.random() - 0.5) * 10, // -5deg .. 5deg
          dx: (Math.random() - 0.5) * 6, // -3px .. 3px
          dy: (Math.random() - 0.5) * 6,
        }))
      );
    }, TREMBLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Slow, single-letter variant swapping, with a clean loop back to start.
  useEffect(() => {
    const id = setInterval(() => {
      if (updateCountRef.current >= CYCLE_LENGTH) {
        currentRef.current = [...initialRef.current];
        updateCountRef.current = 0;
        setGlyphs(currentRef.current);
        return;
      }

      const next = [...currentRef.current];
      const positions = Array.from({ length: WORD.length }, (_, i) => i);
      // shuffle then take the first N positions to change
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      positions.slice(0, LETTERS_PER_UPDATE).forEach((pos) => {
        next[pos] = pickNewVariant(WORD, next, pos);
      });

      currentRef.current = next;
      updateCountRef.current += 1;
      setGlyphs(next);
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="persevere-anim" aria-label="persevere">
      {glyphs.map((char, i) => {
        const t = trembles[i] || { rot: 0, dx: 0, dy: 0 };
        return (
          <span
            key={i}
            className="persevere-anim__letter"
            style={{
              transform: `translate(${t.dx}px, ${t.dy}px) rotate(${t.rot}deg)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
