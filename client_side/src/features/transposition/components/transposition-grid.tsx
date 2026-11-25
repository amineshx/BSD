import { cn } from "@/common/utils/cn";

import type { GridCell } from "../utils/grid";

const MAX_PREVIEW_ROWS = 8;

interface TranspositionGridProps {
  cipherKey: string;
  ranks: number[];
  grid: GridCell[][];
}

/** Columnar preview: the plaintext written in rows, columns read in rank order. */
export function TranspositionGrid({ cipherKey, ranks, grid }: TranspositionGridProps) {
  if (cipherKey.length === 0 || grid.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground-secondary">Grid preview</p>
      <div className="overflow-x-auto rounded-md border border-border bg-background-secondary p-3">
        <table className="mx-auto border-separate border-spacing-1 font-mono text-sm">
          <thead>
            <tr>
              {ranks.map((rank, column) => (
                <th key={column} scope="col" className="min-w-8 text-center text-[10px] font-normal text-brand">
                  {rank}
                </th>
              ))}
            </tr>
            <tr>
              {[...cipherKey].map((letter, column) => (
                <th
                  key={column}
                  scope="col"
                  className="h-8 rounded-xs bg-surface-elevated text-center font-semibold text-foreground"
                >
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.slice(0, MAX_PREVIEW_ROWS).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, column) => (
                  <td
                    key={column}
                    className={cn(
                      "h-8 rounded-xs border text-center",
                      cell.padding
                        ? "border-dashed border-border text-foreground-muted"
                        : "border-border text-foreground-secondary",
                    )}
                  >
                    {cell.letter}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {grid.length > MAX_PREVIEW_ROWS && (
          <p className="mt-2 text-center font-mono text-xs text-foreground-muted">
            … {grid.length - MAX_PREVIEW_ROWS} more rows
          </p>
        )}
      </div>
      <p className="text-xs text-foreground-muted">
        Columns are read top-to-bottom in the order shown in red. Dashed cells are <span className="font-mono">X</span>{" "}
        padding.
      </p>
    </div>
  );
}
