import { ALPHABET } from "@/common/utils/letters";

/** Random permutation of A-Z (Fisher–Yates, using the Web Crypto RNG). */
export function generateSubstitutionKey(): string {
  const letters = [...ALPHABET];
  const random = new Uint32Array(letters.length);
  crypto.getRandomValues(random);

  for (let i = letters.length - 1; i > 0; i--) {
    const j = random[i] % (i + 1);
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return letters.join("");
}
