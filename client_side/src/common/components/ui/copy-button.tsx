"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, type ButtonProps } from "./button";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = "Copy", variant = "ghost", size = "sm", ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (insecure context or denied permission).
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} disabled={!value} {...props}>
      {copied ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  );
}
