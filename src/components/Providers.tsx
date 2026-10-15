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

  // Scroll-reveal for every <Reveal> on the page, via a single observer.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          observer.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return children;
}
