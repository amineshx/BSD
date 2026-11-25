import { cn } from "@/common/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-surface-elevated", className)} />;
}
