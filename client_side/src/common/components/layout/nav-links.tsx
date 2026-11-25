"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/common/utils/cn";

import { navItems } from "./nav-items";

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-surface-elevated text-foreground"
                    : "text-foreground-muted hover:bg-surface hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand" aria-hidden />
                )}
                <Icon className={cn("size-4", active ? "text-brand" : "text-neutral-500")} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
