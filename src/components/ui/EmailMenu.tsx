"use client";

import { ChevronDown, Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gmailComposeUrl, mailtoUrl, outlookComposeUrl } from "@/lib/email";

/** "Write" button that offers several ways to send an email, so it works for every visitor. */
export function EmailMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = [
    { label: "Gmail", href: gmailComposeUrl(email), external: true },
    { label: "Outlook (web)", href: outlookComposeUrl(email), external: true },
    { label: "Default mail app", href: mailtoUrl(email), external: false },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 text-xs font-medium transition-colors hover:bg-accent/20"
      >
        <Send className="size-3.5" />
        Write
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="animate-pop absolute bottom-full left-0 z-30 mb-2 w-56 origin-bottom-left rounded-2xl border border-border bg-surface p-1.5 shadow-2xl shadow-black/30">
          <p className="px-3 pt-1.5 pb-1 font-mono text-[11px] tracking-widest text-subtle uppercase">Send with</p>
          {options.map((o) => (
            <a
              key={o.label}
              href={o.href}
              onClick={() => setOpen(false)}
              {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors hover:bg-elevated"
            >
              <Mail className="size-4 text-accent" />
              {o.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
