/**
 * Extrahiert den ersten Hashtag aus einer Caption und leitet rating_tag sowie rating_rank ab.
 * Verwendung beim Speichern von Videos, damit rating_tag und rating_rank aus der Caption gesetzt werden.
 * Unterstützt Einzelbuchstaben (#A, #B) und Susi-Tags (#stark, #gut, #mittel, …).
 */

const RATING_UNKNOWN_RANK = 999;

/** Bekannte Multi-Wort-Hashtags (längste zuerst), mit Sortierrang (kleiner = besser). */
const SUSI_TAG_RANKS: [string, number][] = [
  ["#langweilig aber nicht schlecht", 4],
  ["#inhaltlich schwach", 5],
  ["#gut aber zu schneiden", 7],
  ["#stark", 1],
  ["#gut", 2],
  ["#mittel", 3],
  ["#schlecht", 6],
];

/**
 * Findet den ersten Hashtag in der Caption (z. B. "#A", "#B", "#gut", "#stark").
 * Längste Susi-Tags zuerst, sonst ein Wort nach dem #.
 */
export function extractFirstHashtag(caption: string): string | null {
  if (!caption || typeof caption !== "string") return null;
  const raw = caption.trim();
  const byLength = [...SUSI_TAG_RANKS].sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [tag] of byLength) {
    if (raw.toLowerCase().startsWith(tag.toLowerCase())) return tag;
  }
  const match = raw.match(/#([A-Za-z0-9_]+)/);
  return match ? `#${match[1]}` : null;
}

/**
 * Leitet aus einem rating_tag einen numerischen Sortierwert ab.
 * Susi-Tags: #stark=1, #gut=2, #mittel=3, …; sonst A=1..Z=26; unbekannt=999.
 */
export function ratingTagToRank(ratingTag: string): number {
  if (!ratingTag || typeof ratingTag !== "string") return RATING_UNKNOWN_RANK;
  const normalized = ratingTag.trim().toLowerCase();
  for (const [tag, rank] of SUSI_TAG_RANKS) {
    if (tag.toLowerCase() === normalized) return rank;
  }
  const single = normalized.replace(/^#/, "");
  if (single.length === 1) {
    const code = single.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) return code - 64;
  }
  return RATING_UNKNOWN_RANK;
}

/**
 * Ermittelt aus der Caption rating_tag und rating_rank zum Speichern.
 * Wenn kein Hashtag gefunden wird: rating_tag leer string, rating_rank 999.
 */
export function getRatingFromCaption(caption: string): {
  rating_tag: string;
  rating_rank: number;
} {
  const tag = extractFirstHashtag(caption);
  if (!tag) {
    return { rating_tag: "", rating_rank: RATING_UNKNOWN_RANK };
  }
  return {
    rating_tag: tag,
    rating_rank: ratingTagToRank(tag),
  };
}

export const RATING_UNKNOWN_RANK_CONST = RATING_UNKNOWN_RANK;
