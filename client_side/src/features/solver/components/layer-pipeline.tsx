import { ChevronRight } from "lucide-react";

const steps = [
  { label: "Ciphertext", detail: "input" },
  { label: "Caesar⁻¹", detail: "keys 1–25" },
  { label: "Transposition⁻¹", detail: "keyword" },
  { label: "Substitution⁻¹", detail: "alphabet" },
  { label: "Plaintext", detail: "candidates" },
];

/** Shows the order in which the solver peels the three layers off. */
export function LayerPipeline() {
  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Decryption order">
      {steps.map((step, index) => {
        const edge = index === 0 || index === steps.length - 1;
        return (
          <li key={step.label} className="flex items-center gap-2">
            <div
              className={
                edge
                  ? "flex flex-col rounded-md border border-border bg-background-secondary px-3 py-1.5"
                  : "flex flex-col rounded-md border border-red-800 bg-red-900/20 px-3 py-1.5"
              }
            >
              <span className="font-mono text-xs font-medium text-foreground">{step.label}</span>
              <span className="text-[11px] text-foreground-muted">{step.detail}</span>
            </div>
            {index < steps.length - 1 && <ChevronRight className="size-4 text-neutral-600" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
