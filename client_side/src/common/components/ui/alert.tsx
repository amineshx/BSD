import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/common/utils/cn";

const variants = {
  error: { className: "border-error/30 bg-error-background text-error", Icon: XCircle },
  warning: { className: "border-warning/30 bg-warning-background text-warning", Icon: AlertTriangle },
  success: { className: "border-success/30 bg-success-background text-success", Icon: CheckCircle2 },
  info: { className: "border-info/30 bg-info-background text-info", Icon: Info },
} as const;

interface AlertProps {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const { className: variantClass, Icon } = variants[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-md border px-4 py-3 text-sm", variantClass, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-col gap-0.5">
        {title && <p className="font-medium">{title}</p>}
        <div className="break-words text-foreground-secondary">{children}</div>
      </div>
    </div>
  );
}
