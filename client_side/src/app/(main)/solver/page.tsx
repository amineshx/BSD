import type { Metadata } from "next";

import { SolverPage } from "@/features/solver/components/solver-page";

export const metadata: Metadata = { title: "Layered solver" };

export default function Page() {
  return <SolverPage />;
}
