import { useMutation } from "@tanstack/react-query";

import { api } from "@/common/lib/axios";
import type { CipherResultResponse } from "@/common/types/api";

import type { CaesarBruteforceRequest, CaesarCandidate, CaesarRequest } from "../types/caesar";

export const caesarKeys = {
  all: ["caesar"] as const,
  encrypt: () => [...caesarKeys.all, "encrypt"] as const,
  decrypt: () => [...caesarKeys.all, "decrypt"] as const,
  bruteforce: () => [...caesarKeys.all, "bruteforce"] as const,
};

export async function encryptCaesar(body: CaesarRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/caesar/encrypt", body);
  return data;
}

export async function decryptCaesar(body: CaesarRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/caesar/decrypt", body);
  return data;
}

export async function bruteforceCaesar(body: CaesarBruteforceRequest) {
  const { data } = await api.post<CaesarCandidate[]>("/api/caesar/bruteforce", body);
  return data;
}

export function useCaesarEncrypt() {
  return useMutation({ mutationKey: caesarKeys.encrypt(), mutationFn: encryptCaesar });
}

export function useCaesarDecrypt() {
  return useMutation({ mutationKey: caesarKeys.decrypt(), mutationFn: decryptCaesar });
}

export function useCaesarBruteforce() {
  return useMutation({ mutationKey: caesarKeys.bruteforce(), mutationFn: bruteforceCaesar });
}
