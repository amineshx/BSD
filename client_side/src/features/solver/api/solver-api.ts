import { useMutation } from "@tanstack/react-query";

import { api } from "@/common/lib/axios";

import type { SolveRequest, SolveResponse } from "../types/solver";

export const solverKeys = {
  all: ["solver"] as const,
  solve: () => [...solverKeys.all, "solve"] as const,
};

export async function solveLayeredMessage(body: SolveRequest) {
  const { data } = await api.post<SolveResponse>("/api/solve", body);
  return data;
}

export function useSolveMutation() {
  return useMutation({ mutationKey: solverKeys.solve(), mutationFn: solveLayeredMessage });
}
