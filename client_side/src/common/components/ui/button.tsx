import { Loader2 } from "lucide-react";

import { cn } from "@/common/utils/cn";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-active shadow-sm disabled:bg-red-900 disabled:text-neutral-400",
  secondary:
    "bg-surface-elevated text-foreground hover:bg-neutral-700 active:bg-neutral-600 disabled:text-foreground-muted",
  outline:
    "border border-border-strong text-foreground hover:border-neutral-500 hover:bg-surface-elevated active:bg-neutral-700 disabled:text-foreground-muted",
  ghost:
    "text-foreground-secondary hover:bg-surface-elevated hover:text-foreground active:bg-neutral-700 disabled:text-foreground-muted",
  destructive:
    "border border-error/40 bg-error-background text-error hover:bg-error/20 active:bg-error/30",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  icon: "size-9",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed [&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
