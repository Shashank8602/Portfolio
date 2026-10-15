import { ArrowUpRight, Award } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Certification } from "@/content/types";

export function Certifications({ certifications, index }: { certifications: Certification[]; index: string }) {
  if (!certifications.length) return null;
  return (
    <Section id="certifications" index={index} eyebrow="certifications" title="Credentials.">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <li key={c.name}>
            <Reveal delay={0.05 * i} className="h-full">
              <div className="spotlight card flex h-full items-start gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Award className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="leading-snug font-medium">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 hover:text-accent">
                        {c.name}
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                      </a>
                    ) : (
                      c.name
                    )}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-subtle">
                    {c.issuer} · {c.year}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
