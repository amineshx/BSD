import type { Metadata } from "next";

import { SubstitutionPage } from "@/features/substitution/components/substitution-page";

export const metadata: Metadata = { title: "Substitution cipher" };

export default function Page() {
  return <SubstitutionPage />;
}
