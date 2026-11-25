import { ListTree } from "lucide-react";

import { CopyButton } from "@/common/components/ui/copy-button";
import { EmptyState } from "@/common/components/ui/empty-state";
import { Skeleton } from "@/common/components/ui/skeleton";
import { cn } from "@/common/utils/cn";

export interface Candidate {
  key: number;
  text: string;
}

interface CandidateListProps {
  candidates?: Candidate[] | null;
  isPending?: boolean;
  /** Label used for the key column, e.g. "Key" or "Caesar key". */
  keyLabel?: string;
  selectedKey?: number | null;
  onSelect?: (key: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * List of decryption candidates (Caesar brute force, layered solver).
 * Selecting a row pins it so the readable plaintext stands out.
 */
export function CandidateList({
  candidates,
  isPending = false,
  keyLabel = "Key",
  selectedKey = null,
  onSelect,
  emptyTitle = "No candidates yet",
  emptyDescription,
}: CandidateListProps) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-2" aria-busy>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-11 w-full" />
        ))}
      </div>
    );
  }

  if (!candidates) {
    return <EmptyState icon={<ListTree />} title={emptyTitle} description={emptyDescription} />;
  }

  if (candidates.length === 0) {
    return <EmptyState icon={<ListTree />} title="No candidates returned" />;
  }

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Decryption candidates">
      {candidates.map((candidate) => {
        const selected = candidate.key === selectedKey;
        return (
          <li
            key={candidate.key}
            className={cn(
              "group flex items-center gap-3 rounded-md border px-2 py-1.5 transition-colors duration-150",
              selected
                ? "border-brand/70 bg-red-900/20 shadow-glow"
                : "border-border bg-background-secondary hover:border-border-strong",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect?.(candidate.key)}
              aria-pressed={selected}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-sm py-1 text-left"
            >
              <span
                className={cn(
                  "inline-flex h-7 min-w-14 shrink-0 items-center justify-center rounded-xs border px-2 font-mono text-xs",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-border-strong bg-surface-elevated text-foreground-muted",
                )}
              >
                <span className="sr-only">{keyLabel} </span>
                {candidate.key > 0 ? `+${candidate.key}` : candidate.key}
              </span>
              <span
                className={cn(
                  "min-w-0 font-mono text-sm tracking-wider break-all",
                  selected ? "text-foreground" : "text-foreground-secondary",
                )}
              >
                {candidate.text || "(empty)"}
              </span>
            </button>
            <CopyButton
              value={candidate.text}
              label="Copy"
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            />
          </li>
        );
      })}
    </ul>
  );
}
