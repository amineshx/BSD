import { PageHeader } from "@/common/components/layout/page-header";

import { LayerPipeline } from "./layer-pipeline";
import { SolverWorkspace } from "./solver-workspace";

export function SolverPage() {
  return (
    <>
      <PageHeader
        eyebrow="Multi-layer"
        title="Layered solver"
        description="For messages encrypted with substitution, then transposition, then Caesar. The layers are removed in reverse order; without a Caesar key, all 25 shifts are tried."
      />
      <div className="mb-6">
        <LayerPipeline />
      </div>
      <SolverWorkspace />
    </>
  );
}
