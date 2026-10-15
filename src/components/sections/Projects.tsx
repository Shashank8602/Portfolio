import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { PipelineDiagram } from "@/components/ui/PipelineDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/content/types";

export function Projects({ projects, index }: { projects: Project[]; index: string }) {
  return (
    <Section
      id="projects"
      index={index}
      eyebrow="projects"
      title={
        <>
          Selected <span className="text-gradient">work</span>.
        </>
      }
      description="Each project follows the same arc: a real problem, a deliberate architecture, a measurable outcome."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={0.06 * (i % 2)}>
            <article className="spotlight card flex h-full flex-col overflow-hidden">
              <div className="relative border-b border-border bg-elevated/40 px-5 py-6 sm:px-6">
                <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />
                <div className="relative">
                  <PipelineDiagram steps={p.pipeline} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">{p.title}</h3>
                  </div>
                  {p.metric && (
                    <div className="shrink-0 text-right">
                      <p className="text-gradient font-display text-2xl leading-none font-bold">{p.metric.value}</p>
                      <p className="mt-1 text-xs text-subtle">{p.metric.label}</p>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-muted">{p.tagline}</p>

                <dl className="mt-5 space-y-3 text-sm">
                  {(
                    [
                      ["Problem", p.problem],
                      ["Approach", p.approach],
                      ["Outcome", p.outcome],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="grid gap-1 sm:grid-cols-[88px_1fr] sm:gap-3">
                      <dt className="font-mono text-[11px] tracking-widest text-accent uppercase sm:pt-0.5">{label}</dt>
                      <dd className="leading-relaxed text-muted">{text}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {p.stack.map((t) => (
                    <li key={t}>
                      <TechChip name={t} size="sm" />
                    </li>
                  ))}
                </ul>

                {(p.links?.github || p.links?.demo) && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {p.links.github && (
                      <a
                        href={p.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-accent/60"
                      >
                        <GithubIcon className="size-4" />
                        Code
                      </a>
                    )}
                    {p.links.demo && (
                      <a
                        href={p.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 text-sm font-medium transition-colors hover:bg-accent/20"
                      >
                        Live demo
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
