"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the value is visible on the page anyway */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium transition-colors hover:border-accent/60"
    >
      {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
