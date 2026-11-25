import { useMutation } from "@tanstack/react-query";

import { api } from "@/common/lib/axios";
import type { CipherResultResponse } from "@/common/types/api";

import type { TranspositionDecryptRequest, TranspositionEncryptRequest } from "../types/transposition";

export const transpositionKeys = {
  all: ["transposition"] as const,
  encrypt: () => [...transpositionKeys.all, "encrypt"] as const,
  decrypt: () => [...transpositionKeys.all, "decrypt"] as const,
};

export async function encryptTransposition(body: TranspositionEncryptRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/transposition/encrypt", body);
  return data;
}

export async function decryptTransposition(body: TranspositionDecryptRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/transposition/decrypt", body);
  return data;
}

export function useTranspositionEncrypt() {
  return useMutation({ mutationKey: transpositionKeys.encrypt(), mutationFn: encryptTransposition });
}

export function useTranspositionDecrypt() {
  return useMutation({ mutationKey: transpositionKeys.decrypt(), mutationFn: decryptTransposition });
}
