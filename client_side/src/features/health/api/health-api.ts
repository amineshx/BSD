import { useQuery } from "@tanstack/react-query";

import { api } from "@/common/lib/axios";

import type { HealthResponse } from "../types/health";

export const healthKeys = {
  all: ["health"] as const,
};

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>("/health");
  return data;
}

export function useHealthQuery() {
  return useQuery({
    queryKey: healthKeys.all,
    queryFn: getHealth,
    refetchInterval: 30_000,
    retry: false,
  });
}
