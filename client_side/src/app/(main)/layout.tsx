import { AppShell } from "@/common/components/layout/app-shell";
import { BackendStatus } from "@/features/health/components/backend-status";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return <AppShell sidebarFooter={<BackendStatus />}>{children}</AppShell>;
}
