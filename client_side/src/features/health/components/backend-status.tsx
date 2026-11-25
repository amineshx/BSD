"use client";

import { RefreshCw } from "lucide-react";

import { cn } from "@/common/utils/cn";

import { useBackendStatus } from "../hooks/use-backend-status";
import type { BackendStatus as Status } from "../types/health";

const statusStyles: Record<Status, { dot: string; label: string }> = {
  checking: { dot: "bg-neutral-500 animate-pulse", label: "Checking API…" },
  online: { dot: "bg-success shadow-[0_0_8px_var(--success)]", label: "API online" },
  offline: { dot: "bg-error", label: "API offline" },
};

/** Live backend connection indicator, backed by GET /health. */
export function BackendStatus({ className }: { className?: string }) {
  const { status, isRefreshing, refresh } = useBackendStatus();
  const { dot, label } = statusStyles[status];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-2" role="status">
        <span className={cn("size-2 rounded-full", dot)} aria-hidden />
        <span className="text-xs font-medium text-foreground-secondary">{label}</span>
      </div>
      <button
        type="button"
        onClick={refresh}
        disabled={isRefreshing}
        className="cursor-pointer rounded-xs p-1 text-foreground-muted transition-colors hover:text-foreground disabled:cursor-default"
        aria-label="Re-check API status"
      >
        <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} aria-hidden />
      </button>
    </div>
  );
}
