import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollLine } from "@/components/ui/ScrollLine";
import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechChip";
import type { Experience as Job } from "@/content/types";

export function Experience({ experience, index }: { experience: Job[]; index: string }) {
  return (
    <Section
      id="experience"
      index={index}
      eyebrow="experience"
      title={
        <>
          Where I&apos;ve been <span className="text-accent">building</span>.
        </>
      }
    >
      {/* One left-aligned timeline at every width, so a single role never leaves half the page empty. */}
      <div className="relative">
        <ScrollLine className="left-[7px]" />
        <ol className="space-y-6">
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`} className="relative pl-9 sm:pl-12">
              <span
                aria-hidden="true"
                className={`absolute top-7 left-[7px] size-3.5 -translate-x-1/2 rounded-full border-2 border-accent ${
                  job.current ? "bg-accent" : "bg-bg"
                }`}
              />
              <Reveal>
                <article className={`spotlight card p-6 sm:p-8 ${job.current ? "border-accent/40" : ""}`}>
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-display text-xl font-semibold sm:text-2xl">{job.role}</h3>
                        {job.current && (
                          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] tracking-wider text-accent uppercase">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-muted">
                        {job.companyUrl ? (
                          <a
                            href={job.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-fg underline-offset-4 hover:text-accent hover:underline"
                          >
                            {job.company}
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : (
                          <span className="text-fg">{job.company}</span>
                        )}
                      </p>
                    </div>
                    <div className="font-mono text-sm sm:text-right">
                      <p className="text-accent">
                        {job.start} — {job.end}
                      </p>
                      {job.location && <p className="mt-0.5 text-subtle">{job.location}</p>}
                    </div>
                  </header>

                  <ul className="mt-6 grid gap-x-10 gap-y-3 lg:grid-cols-2">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                        <span className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5" aria-label="Technologies">
                    {job.stack.map((t) => (
                      <li key={t}>
                        <TechChip name={t} size="sm" />
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
