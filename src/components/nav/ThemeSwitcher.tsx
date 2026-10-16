"use client";

import { Check, Moon, Palette, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ENABLED_THEMES, setTheme, THEME_LABELS, THEME_PICKER_ENABLED } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

export function ThemeSwitcher() {
  const { theme, mode } = useTheme();
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

  return (
    <div className="flex items-center gap-1">
      {/* The colour picker only appears when more than one theme is enabled (see ENABLED_THEMES in lib/theme.ts). */}
      {THEME_PICKER_ENABLED && (
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Choose color theme"
            aria-expanded={open}
            aria-haspopup="true"
            className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
          >
            <Palette className="size-[18px]" />
          </button>
          {open && (
              <div className="animate-pop absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-2xl shadow-black/30">
                <p className="px-2 pt-1 pb-2 font-mono text-[11px] tracking-widest text-subtle uppercase">Theme</p>
                {ENABLED_THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme({ theme: t })}
                    aria-pressed={theme === t}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm transition-colors hover:bg-elevated"
                  >
                    <span
                      className="size-5 shrink-0 rounded-full ring-1 ring-border"
                      style={{ background: THEME_LABELS[t].colors[0] }}
                    />
                    <span className="flex-1">{THEME_LABELS[t].label}</span>
                    {theme === t && <Check className="size-4 text-accent" />}
                  </button>
                ))}
              </div>
            )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setTheme({ mode: mode === "dark" ? "light" : "dark" })}
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
      >
        {mode === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </button>
    </div>
  );
}
