// Deliberately small and blunt: this exists to catch obvious trolling/harassment in the
// contact form's free-text fields, not to be a comprehensive moderation system.

// Distinctive enough as bare substrings that no legitimate English word contains them,
// so matching anywhere in the text (not just whole-word) still catches common inflections
// like "fucking" or "bitches" without the classic false positives.
const SUBSTRING_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "bastard",
  "wanker",
  "twat",
  "slut",
  "whore",
  "faggot",
  "retard",
  "nigger",
  "nigga",
  "spastic",
  "tranny",
  "piss",
  "dick",
];

// Short enough that matching as a substring would also catch real words (ass -> "class",
// "assume"; cock -> "cockpit", "peacock"), so these only match as a whole word.
const WHOLE_WORD_ONLY = ["ass", "cock"];

function normalize(text: string): string {
  // common leetspeak substitutions, so simple evasion ("a55hole") doesn't slip through
  return text
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

const BLOCKED_PATTERN = new RegExp(
  `(${SUBSTRING_WORDS.join("|")})|\\b(${WHOLE_WORD_ONLY.join("|")})\\b`,
  "i"
);

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  return BLOCKED_PATTERN.test(normalize(text));
}
