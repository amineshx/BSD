import type { Metadata } from "next";

import { CaesarPage } from "@/features/caesar/components/caesar-page";

export const metadata: Metadata = { title: "Caesar cipher" };

export default function Page() {
  return <CaesarPage />;
}
