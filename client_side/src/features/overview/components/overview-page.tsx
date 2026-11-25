import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { navItems } from "@/common/components/layout/nav-items";
import { Badge } from "@/common/components/ui/badge";

const tools = navItems.filter((item) => item.href !== "/");

const toolExamples: Record<string, { input: string; output: string }> = {
  "/caesar": { input: "BONJOUR", output: "ERQMRXU" },
  "/substitution": { input: "ATTAQUE", output: "QZZQJXT" },
  "/transposition": { input: "RENDEZVOUSAMIDI", output: "ESIEVMRZANOIDUD" },
  "/solver": { input: "GOACJIPIUE", output: "ABRICOTS" },
};

export function OverviewPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-surface to-background px-6 py-12 sm:px-10 sm:py-16">
        <div
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
          aria-hidden
        />
        <div className="relative flex max-w-2xl flex-col gap-5">
          <Badge variant="brand" className="w-fit font-mono tracking-wider uppercase">
            Classical cryptography
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Encrypt, decrypt and <span className="text-brand">break</span> classical ciphers.
          </h1>
          <p className="text-base leading-relaxed text-foreground-muted">
            A workspace for Caesar, substitution and columnar transposition — plus a solver that peels all three layers
            off a single message.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/caesar"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover active:bg-brand-active"
            >
              Start with Caesar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/solver"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-border-strong px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
            >
              Open the solver
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-2xl font-semibold tracking-tight">
          Tools
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {tools.map(({ href, label, description, icon: Icon }) => {
            const example = toolExamples[href];
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full flex-col gap-5 rounded-lg border border-border bg-surface p-6 transition-colors duration-150 hover:border-red-800 hover:bg-surface-elevated"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-md border border-border-strong bg-background-secondary text-brand">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <ArrowRight
                      className="size-4 text-foreground-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-foreground">{label}</h3>
                    <p className="text-sm text-foreground-muted">{description}</p>
                  </div>
                  {example && (
                    <p className="mt-auto truncate rounded-sm border border-border bg-black px-3 py-2 font-mono text-xs text-foreground-muted">
                      <span className="text-foreground-secondary">{example.input}</span>
                      <span className="px-2 text-brand">→</span>
                      <span className="text-foreground-secondary">{example.output}</span>
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
