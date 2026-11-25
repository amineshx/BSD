export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Normalizes free text to the API's message format: uppercase A-Z only.
 * Accents are folded (É → E) and everything else is removed.
 */
export function toCipherLetters(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export interface SubstitutionKeyCheck {
  valid: boolean;
  missing: string[];
  duplicates: string[];
}

/** A substitution key must be a permutation of A-Z. */
export function checkSubstitutionKey(key: string): SubstitutionKeyCheck {
  const counts = new Map<string, number>();
  for (const letter of key) counts.set(letter, (counts.get(letter) ?? 0) + 1);

  const missing = [...ALPHABET].filter((letter) => !counts.has(letter));
  const duplicates = [...counts].filter(([, count]) => count > 1).map(([letter]) => letter);

  return {
    valid: key.length === 26 && missing.length === 0 && duplicates.length === 0,
    missing,
    duplicates,
  };
}

/** Human readable reason why a substitution key is invalid, or null if valid. */
export function describeSubstitutionKeyError(key: string): string | null {
  if (key.length === 0) return "Enter a 26-letter key.";
  const { valid, missing, duplicates } = checkSubstitutionKey(key);
  if (valid) return null;
  if (duplicates.length > 0) return `Each letter must appear once. Repeated: ${duplicates.join(", ")}.`;
  if (key.length < 26) return `${26 - key.length} letter${key.length === 25 ? "" : "s"} missing: ${missing.join(", ")}.`;
  return "The key must contain exactly 26 letters.";
}

/** Parses an integer typed into a text field ("-3", "12"); returns null when invalid. */
export function parseInteger(value: string): number | null {
  const trimmed = value.trim();
  return /^-?\d+$/.test(trimmed) ? Number(trimmed) : null;
}
