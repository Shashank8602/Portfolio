import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { PipelineDiagram } from "@/components/ui/PipelineDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/content/types";

export function Projects({ projects, index }: { projects: Project[]; index: string }) {
  // With an odd number of projects, the first becomes a full-width "featured" card (two columns
  // inside), so the grid below it stays balanced and long bullet lists stay readable.
  const hasFeatured = projects.length % 2 === 1;

  return (
    <Section
      id="projects"
      index={index}
      eyebrow="projects"
      title={
        <>
          Selected <span className="text-accent">work</span>.
        </>
      }
      description="Retrieval pipelines and agentic workflows I have built, with the architecture of each shown at the top of its card."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((p, i) => {
          const featured = hasFeatured && i === 0;
          const story = (
            [
              ["Problem", p.problem],
              ["Approach", p.approach],
              ["Outcome", p.outcome],
            ] as const
          ).filter(([, text]) => !!text);

          return (
            <Reveal key={p.title} delay={0.06 * (i % 2)} className={featured ? "md:col-span-2" : ""}>
              <article className="spotlight card flex h-full flex-col overflow-hidden">
                <div className="relative border-b border-border bg-elevated/40 px-5 py-5 sm:px-8">
                  <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
                  <div className="relative">
                    <PipelineDiagram steps={p.pipeline} />
                  </div>
                </div>

                <div
                  className={`flex flex-1 flex-col gap-6 p-6 sm:p-8 ${
                    featured ? "lg:grid lg:grid-cols-[5fr_7fr] lg:grid-rows-[auto_1fr] lg:gap-x-12" : ""
                  }`}
                >
                  {/* Title, summary and headline metric */}
                  <div className={featured ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <p className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">{p.title}</h3>
                    <p className="mt-2 text-muted">{p.tagline}</p>
                    {p.metric && (
                      <p className="mt-5 flex items-baseline gap-3 border-l-2 border-accent pl-4">
                        <span className="shrink-0 font-display text-2xl leading-none font-bold whitespace-nowrap text-accent">{p.metric.value}</span>
                        <span className="text-sm text-muted">{p.metric.label}</span>
                      </p>
                    )}
                  </div>

                  {/* The detail: story fields and/or bullet highlights */}
                  {(story.length > 0 || (p.highlights && p.highlights.length > 0)) && (
                    <div className={featured ? "lg:col-start-2 lg:row-span-2 lg:row-start-1" : ""}>
                      {story.length > 0 && (
                        <dl className="space-y-3 text-sm">
                          {story.map(([label, text]) => (
                            <div key={label} className="grid gap-1 sm:grid-cols-[88px_1fr] sm:gap-3">
                              <dt className="font-mono text-[11px] tracking-widest text-accent uppercase sm:pt-0.5">{label}</dt>
                              <dd className="leading-relaxed text-muted">{text}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {p.highlights && p.highlights.length > 0 && (
                        <ul className="space-y-3">
                          {p.highlights.map((h) => (
                            <li key={h} className="flex gap-3 text-[14.5px] leading-relaxed text-muted">
                              <span className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Technologies and links stay pinned to the bottom of the card */}
                  <div className={`mt-auto flex flex-col gap-5 ${featured ? "lg:col-start-1 lg:row-start-2 lg:self-end" : ""}`}>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                      {p.stack.map((t) => (
                        <li key={t}>
                          <TechChip name={t} size="sm" />
                        </li>
                      ))}
                    </ul>
                    {(p.links?.github || p.links?.demo) && (
                      <div className="flex flex-wrap gap-2">
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
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
