import type { CSSProperties, ReactNode } from "react";

/**
 * Fades content up as it scrolls into view (once). This is plain server-rendered
 * markup: one shared IntersectionObserver in <Providers /> flips `data-revealed`,
 * and CSS does the animation — so dozens of these cost nothing to hydrate.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal="" className={className} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
