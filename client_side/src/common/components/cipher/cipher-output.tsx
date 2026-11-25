import { Terminal } from "lucide-react";

import { CopyButton } from "@/common/components/ui/copy-button";
import { EmptyState } from "@/common/components/ui/empty-state";
import { Skeleton } from "@/common/components/ui/skeleton";
import { cn } from "@/common/utils/cn";

interface CipherOutputProps {
  /** Shown in the terminal title bar, e.g. "ciphertext". */
  label: string;
  value?: string | null;
  isPending?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Optional actions next to the copy button (e.g. "Use as input"). */
  actions?: React.ReactNode;
  className?: string;
}

/** Terminal-style panel for ciphertext / plaintext results. */
export function CipherOutput({
  label,
  value,
  isPending = false,
  emptyTitle = "No output yet",
  emptyDescription,
  actions,
  className,
}: CipherOutputProps) {
  const hasValue = typeof value === "string";

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-black", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background-secondary px-4 py-2">
        <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted">
          <Terminal className="size-3.5 text-brand" aria-hidden />
          <span>{label}</span>
          {hasValue && <span className="text-neutral-500">· {value.length} chars</span>}
        </div>
        <div className="flex items-center gap-1">
          {hasValue && actions}
          {hasValue && <CopyButton value={value} />}
        </div>
      </div>

      <div className="p-4" aria-live="polite" aria-busy={isPending}>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : hasValue ? (
          value.length > 0 ? (
            <pre className="font-mono text-base leading-relaxed tracking-wider break-all whitespace-pre-wrap text-foreground">
              <span className="text-brand select-none">&gt; </span>
              {value}
            </pre>
          ) : (
            <p className="font-mono text-sm text-foreground-muted">&gt; (empty result)</p>
          )
        ) : (
          <EmptyState
            icon={<Terminal />}
            title={emptyTitle}
            description={emptyDescription}
            className="border-neutral-800"
          />
        )}
      </div>
    </div>
  );
}
