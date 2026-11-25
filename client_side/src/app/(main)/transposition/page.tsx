import type { Metadata } from "next";

import { TranspositionPage } from "@/features/transposition/components/transposition-page";

export const metadata: Metadata = { title: "Transposition cipher" };

export default function Page() {
  return <TranspositionPage />;
}
