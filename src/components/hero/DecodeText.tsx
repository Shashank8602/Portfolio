"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01<>/\\{}[]#$%&*+=?ΣλΔ∇░▒";

/**
 * Cycles through phrases with a "decoding" effect: characters resolve from
 * random glyphs, left to right. Text is written straight to the DOM (no React
 * re-renders per frame). Screen readers get the full list once, statically.
 */
export function DecodeText({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || phrases.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;

    const decode = (target: string) => {
      const duration = 900;
      const startTime = performance.now();
      const frame = (now: number) => {
        // rAF timestamps can precede `startTime` slightly, so clamp at 0 too.
        const progress = Math.max(0, Math.min(1, (now - startTime) / duration));
        const resolved = Math.floor(progress * target.length);
        let out = target.slice(0, resolved);
        for (let i = resolved; i < target.length; i++) {
          out += target[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (progress < 1) raf = requestAnimationFrame(frame);
        else timer = setTimeout(nextPhrase, 2600);
      };
      raf = requestAnimationFrame(frame);
    };

    const nextPhrase = () => {
      index = (index + 1) % phrases.length;
      if (reduced) {
        el.textContent = phrases[index];
        timer = setTimeout(nextPhrase, 3200);
      } else {
        decode(phrases[index]);
      }
    };

    timer = setTimeout(nextPhrase, 2600);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [phrases]);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span ref={ref} aria-hidden="true">
        {phrases[0]}
      </span>
    </span>
  );
}
