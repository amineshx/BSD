export interface SubstitutionRequest {
  message: string;
  /** Permutation of A-Z: A maps to the first key letter, B to the second, and so on. */
  key: string;
}
