"use client";

import { useCallback, type CSSProperties, type ReactNode } from "react";

/**
 * Fades content up the first time it scrolls into view.
 *
 * Each block registers itself with one shared IntersectionObserver through a ref
 * callback, so it is picked up whenever it appears in the DOM (first load, hot
 * reload, streaming, re-mounts) and can never get stuck invisible. If scripting
 * is unavailable, CSS shows the content immediately (see globals.css).
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer?.unobserve(entry.target);
      }
    },
    // A small fixed margin (not a percentage), so content in the last stretch of the
    // page still reveals instead of staying invisible at the very bottom.
    { rootMargin: "0px 0px -40px 0px" },
  );
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.setAttribute("data-revealed", ""); // no IntersectionObserver: just show it
      return;
    }
    if (!el.hasAttribute("data-revealed")) io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <div ref={ref} data-reveal="" className={className} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
