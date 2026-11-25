import { PageHeader } from "@/common/components/layout/page-header";

import { SubstitutionWorkspace } from "./substitution-workspace";

export function SubstitutionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Monoalphabetic"
        title="Substitution cipher"
        description="Replace each letter with its partner in a scrambled 26-letter alphabet. The same key encrypts and decrypts."
      />
      <SubstitutionWorkspace />
    </>
  );
}
