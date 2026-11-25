import { KeySquare } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="CryptoBox home">
      <span className="flex size-8 items-center justify-center rounded-md bg-brand text-white shadow-glow">
        <KeySquare className="size-4.5" aria-hidden />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        Crypto<span className="text-brand">Box</span>
      </span>
    </Link>
  );
}
