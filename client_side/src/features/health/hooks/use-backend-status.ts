import { useHealthQuery } from "../api/health-api";
import type { BackendStatus } from "../types/health";

export function useBackendStatus() {
  const { data, isPending, isError, isFetching, refetch } = useHealthQuery();

  const status: BackendStatus = isPending ? "checking" : isError || data?.status !== "ok" ? "offline" : "online";

  return { status, isRefreshing: isFetching, refresh: () => void refetch() };
}
