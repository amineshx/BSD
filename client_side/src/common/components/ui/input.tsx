import { cn } from "@/common/utils/cn";

const fieldBase =
  "w-full rounded-sm border bg-background-secondary text-sm text-foreground placeholder:text-foreground-muted/70 transition-colors duration-150 hover:border-border-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60";

const stateStyles = {
  default: "border-border",
  error: "border-error/70 hover:border-error focus:border-error focus:ring-error/25",
  success: "border-success/60",
} as const;

export type FieldState = keyof typeof stateStyles;

interface FieldStyleProps {
  state?: FieldState;
  /** Use Geist Mono — for messages, keys and other technical values. */
  mono?: boolean;
}

export function Input({
  state = "default",
  mono = false,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & FieldStyleProps) {
  return (
    <input
      aria-invalid={state === "error" || undefined}
      className={cn(fieldBase, stateStyles[state], "h-10 px-3", mono && "font-mono tracking-wide", className)}
      {...props}
    />
  );
}

export function Textarea({
  state = "default",
  mono = false,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldStyleProps) {
  return (
    <textarea
      aria-invalid={state === "error" || undefined}
      className={cn(
        fieldBase,
        stateStyles[state],
        "min-h-28 resize-y px-3 py-2.5 leading-relaxed",
        mono && "font-mono tracking-wide break-all",
        className,
      )}
      {...props}
    />
  );
}
