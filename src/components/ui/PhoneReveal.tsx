"use client";

import { Check, Copy, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { REVEAL_PHONE_EVENT } from "@/lib/events";

// The number arrives reversed + base64-encoded, so it never appears as plain
// text in the HTML that scrapers read. It is decoded only on request.
const decode = (encoded: string) => [...atob(encoded)].reverse().join("");

export function PhoneReveal({ encoded }: { encoded: string }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onReveal = () => {
      setPhone(decode(encoded));
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2200);
    };
    window.addEventListener(REVEAL_PHONE_EVENT, onReveal);
    return () => window.removeEventListener(REVEAL_PHONE_EVENT, onReveal);
  }, [encoded]);

  const copy = async () => {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the number is still visible */
    }
  };

  return (
    <div className={`rounded-xl transition-shadow duration-500 ${highlight ? "shadow-[0_0_0_2px_var(--accent)]" : ""}`}>
      {phone ? (
        <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="block font-medium break-all text-fg hover:text-accent">
          {phone}
        </a>
      ) : (
        <p className="font-medium tracking-wider text-subtle select-none" aria-label="Phone number hidden">
          +•• ••••• •••••
        </p>
      )}
      <div className="mt-4 flex gap-2">
        {phone ? (
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium transition-colors hover:border-accent/60"
          >
            {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhone(decode(encoded))}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 text-xs font-medium transition-colors hover:bg-accent/20"
          >
            <Eye className="size-3.5" />
            Show number
          </button>
        )}
      </div>
    </div>
  );
}
