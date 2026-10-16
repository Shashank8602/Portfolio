import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, eyebrow, title, description, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative scroll-mt-16 pt-12 pb-16 sm:pt-14 sm:pb-20 ${className}`}>
      <div className="container-x">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            <span className="text-subtle">{"// "}</span>
            {index} · {eyebrow}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1] font-semibold tracking-tight text-balance"
          >
            {title}
          </h2>
          {description && <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{description}</p>}
        </Reveal>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
