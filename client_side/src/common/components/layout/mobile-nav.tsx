"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";

import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

/** Top bar + slide-in drawer for mobile and tablet (< 1024px). */
export function MobileNav({ footer }: { footer?: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
      <Logo />
      <button
        type="button"
        onClick={open}
        className="flex size-9 cursor-pointer items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
        aria-label="Open navigation"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Navigation"
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes the drawer.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r border-border bg-background-secondary p-0 text-foreground backdrop:bg-black/70"
      >
        <div className="flex h-full flex-col gap-6 p-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={close}
              className="flex size-9 cursor-pointer items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
              aria-label="Close navigation"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <NavLinks onNavigate={close} />
          {footer && <div className="mt-auto">{footer}</div>}
        </div>
      </dialog>
    </header>
  );
}
