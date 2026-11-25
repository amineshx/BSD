import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

interface AppShellProps {
  /** Pinned to the bottom of the sidebar / drawer (e.g. backend status). */
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}

/** Left sidebar on desktop, top bar + drawer below 1024px. */
export function AppShell({ sidebarFooter, children }: AppShellProps) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-border bg-background-secondary px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <div className="flex flex-col gap-2">
          <p className="px-3 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">Workspace</p>
          <NavLinks />
        </div>
        {sidebarFooter && <div className="mt-auto">{sidebarFooter}</div>}
      </aside>

      <div className="flex min-w-0 flex-col">
        <MobileNav footer={sidebarFooter} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
