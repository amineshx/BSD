export interface SolveRequest {
  message: string;
  /** Exactly 26 letters, each once. */
  substitutionKey: string;
  /** One or more letters A-Z. */
  transpositionKey: string;
  /** Omit to try Caesar keys 1 through 25. */
  caesarKey?: number;
}

export interface SolveCandidate {
  caesarKey: number;
  plaintext: string;
}

export interface SolveResponse {
  candidates: SolveCandidate[];
}
