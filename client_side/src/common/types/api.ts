/** Body returned by the backend for 400 responses. */
export interface ApiErrorResponse {
  error: string;
}

/** Response shared by every encrypt / decrypt endpoint. */
export interface CipherResultResponse {
  result: string;
}

export type CipherDirection = "encrypt" | "decrypt";
