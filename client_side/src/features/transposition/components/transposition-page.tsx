import { PageHeader } from "@/common/components/layout/page-header";

import { TranspositionWorkspace } from "./transposition-workspace";

export function TranspositionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Columnar"
        title="Transposition cipher"
        description="Write the message in rows under a keyword, then read the columns in alphabetical keyword order. Letters move; they never change."
      />
      <TranspositionWorkspace />
    </>
  );
}
