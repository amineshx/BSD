import { ALPHABET } from "@/common/utils/letters";
import { cn } from "@/common/utils/cn";

interface KeyMappingProps {
  cipherKey: string;
  duplicates: string[];
}

/** Plain → cipher alphabet table so the user can see what the key does. */
export function KeyMapping({ cipherKey, duplicates }: KeyMappingProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-background-secondary p-3">
      <div className="grid min-w-[560px] grid-cols-[repeat(26,minmax(0,1fr))] gap-px font-mono text-xs">
        {[...ALPHABET].map((plain, index) => {
          const mapped = cipherKey[index];
          const duplicate = mapped !== undefined && duplicates.includes(mapped);
          return (
            <div key={plain} className="flex flex-col items-center gap-1 py-1">
              <span className="text-foreground-muted">{plain}</span>
              <span className="text-[10px] text-neutral-600" aria-hidden>
                ↓
              </span>
              <span
                className={cn(
                  "flex h-6 w-full items-center justify-center rounded-xs",
                  mapped === undefined && "text-neutral-600",
                  mapped !== undefined && !duplicate && "bg-surface-elevated text-foreground",
                  duplicate && "bg-warning-background text-warning ring-1 ring-warning/50",
                )}
              >
                {mapped ?? "·"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
