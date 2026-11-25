import { Badge } from "@/common/components/ui/badge";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl flex-col gap-3">
        {eyebrow && (
          <Badge variant="brand" className="w-fit font-mono uppercase tracking-wider">
            {eyebrow}
          </Badge>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm leading-relaxed text-foreground-muted sm:text-base">{description}</p>
      </div>
      {children}
    </header>
  );
}
