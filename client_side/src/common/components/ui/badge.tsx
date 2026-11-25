import { cn } from "@/common/utils/cn";

const variants = {
  neutral: "border-border bg-surface-elevated text-foreground-secondary",
  brand: "border-red-800 bg-red-900/40 text-red-300",
  success: "border-success/30 bg-success-background text-success",
  error: "border-error/30 bg-error-background text-error",
  warning: "border-warning/30 bg-warning-background text-warning",
  info: "border-info/30 bg-info-background text-info",
} as const;

export type BadgeVariant = keyof typeof variants;

export function Badge({
  variant = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
