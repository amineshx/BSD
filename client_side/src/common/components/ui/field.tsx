import { cn } from "@/common/utils/cn";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: string | null;
  /** Rendered on the right of the label, e.g. a counter or a small action. */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + hint / validation message. */
export function Field({ label, htmlFor, hint, error, aside, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex min-h-5 items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground-secondary">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {(error || hint) && (
        <p
          id={`${htmlFor}-message`}
          className={cn("text-xs leading-relaxed", error ? "text-error" : "text-foreground-muted")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
