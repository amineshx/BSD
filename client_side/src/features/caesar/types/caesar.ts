export type CaesarMode = "encrypt" | "decrypt" | "bruteforce";

export interface CaesarRequest {
  message: string;
  /** Shift amount; positive and negative values are supported. */
  key: number;
}

export interface CaesarBruteforceRequest {
  message: string;
}

export interface CaesarCandidate {
  key: number;
  message: string;
}
