import { cn } from "@/common/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-6 py-10 text-center",
        className,
      )}
    >
      {icon && <div className="mb-1 text-foreground-muted [&_svg]:size-6">{icon}</div>}
      <p className="text-sm font-medium text-foreground-secondary">{title}</p>
      {description && <p className="max-w-xs text-xs leading-relaxed text-foreground-muted">{description}</p>}
    </div>
  );
}
