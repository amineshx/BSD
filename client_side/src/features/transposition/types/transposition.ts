export interface TranspositionEncryptRequest {
  message: string;
  key: string;
}

export interface TranspositionDecryptRequest {
  message: string;
  key: string;
  /** Original unpadded message length; preserves literal trailing X characters. */
  originalLength?: number;
}
