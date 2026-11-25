import { cn } from "@/common/utils/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex w-full rounded-md border border-border bg-background-secondary p-1 sm:w-auto",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 sm:flex-none [&_svg]:size-4",
              selected
                ? "bg-surface-elevated text-foreground shadow-sm ring-1 ring-border-strong"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
