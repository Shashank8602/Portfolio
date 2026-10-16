"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { restoreTheme } from "@/lib/theme";

export function Providers({ children }: { children: ReactNode }) {
  // React's dev-mode remount clears attributes the inline script set on <html>.
  useLayoutEffect(restoreTheme, []);

  // One global listener feeds the cursor position to every `.spotlight` card,
  // so the cards themselves can stay server components.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return children;
}
