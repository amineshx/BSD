import { useMutation } from "@tanstack/react-query";

import { api } from "@/common/lib/axios";
import type { CipherResultResponse } from "@/common/types/api";

import type { SubstitutionRequest } from "../types/substitution";

export const substitutionKeys = {
  all: ["substitution"] as const,
  encrypt: () => [...substitutionKeys.all, "encrypt"] as const,
  decrypt: () => [...substitutionKeys.all, "decrypt"] as const,
};

export async function encryptSubstitution(body: SubstitutionRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/substitution/encrypt", body);
  return data;
}

export async function decryptSubstitution(body: SubstitutionRequest) {
  const { data } = await api.post<CipherResultResponse>("/api/substitution/decrypt", body);
  return data;
}

export function useSubstitutionEncrypt() {
  return useMutation({ mutationKey: substitutionKeys.encrypt(), mutationFn: encryptSubstitution });
}

export function useSubstitutionDecrypt() {
  return useMutation({ mutationKey: substitutionKeys.decrypt(), mutationFn: decryptSubstitution });
}
