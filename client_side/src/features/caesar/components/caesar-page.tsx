import { PageHeader } from "@/common/components/layout/page-header";

import { CaesarWorkspace } from "./caesar-workspace";

export function CaesarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shift cipher"
        title="Caesar cipher"
        description="Shift every letter by a fixed number of positions. Encrypt and decrypt with a known key, or brute-force all 25 shifts when the key is unknown."
      />
      <CaesarWorkspace />
    </>
  );
}
