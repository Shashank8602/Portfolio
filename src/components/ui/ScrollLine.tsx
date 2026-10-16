"use client";

import { useEffect, useRef } from "react";

/** A glowing "data-flow" line that fills as its container scrolls through the viewport. */
export function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const { top, height } = el.getBoundingClientRect();
      // 0 when the top reaches 75% of the viewport, 1 when the bottom reaches 55%.
      const progress = Math.min(1, Math.max(0, (0.75 * vh - top) / (0.2 * vh + height)));
      fill.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute top-0 bottom-0 w-px ${className}`}>
      <div className="absolute inset-0 bg-border" />
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top scale-y-0 bg-accent transition-transform duration-150 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}
