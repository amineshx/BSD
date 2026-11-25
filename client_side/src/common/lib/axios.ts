import axios, { isAxiosError } from "axios";

import type { ApiErrorResponse } from "@/common/types/api";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Single shared Axios instance for every backend request. */
export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/** Turns any thrown request error into a message that can be shown in the UI. */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const serverMessage = error.response?.data?.error;
    if (serverMessage) return serverMessage;

    if (!error.response) {
      return `Cannot reach the CryptoBox API${apiBaseUrl ? ` at ${apiBaseUrl}` : ""}. Make sure the backend is running.`;
    }

    if (error.response.status === 429) {
      return "Too many requests. Wait a moment and try again.";
    }

    return `Request failed with status ${error.response.status}.`;
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}
