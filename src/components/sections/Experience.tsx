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
          Where I&apos;ve been <span className="text-gradient">building</span>.
        </>
      }
    >
      <div className="relative">
        <ScrollLine className="left-[11px] lg:left-1/2" />
        <ol className="space-y-10 lg:space-y-14">
          {experience.map((job, i) => {
            const cardRight = i % 2 === 1;
            return (
              <li key={`${job.company}-${job.start}`} className="relative grid grid-cols-1 pl-10 lg:grid-cols-2 lg:gap-16 lg:pl-0">
                {/* Node on the timeline */}
                <span
                  aria-hidden="true"
                  className={`absolute top-7 left-[11px] size-3.5 -translate-x-1/2 rounded-full border-2 border-accent lg:left-1/2 ${
                    job.current ? "bg-accent shadow-[0_0_16px_var(--accent)]" : "bg-bg"
                  }`}
                />

                {/* Dates beside the line (desktop) */}
                <div
                  className={`hidden pt-6 lg:block ${cardRight ? "lg:order-1 lg:text-right" : "lg:order-2"}`}
                  aria-hidden="true"
                >
                  <p className="font-mono text-sm text-accent">
                    {job.start} — {job.end}
                  </p>
                  {job.location && <p className="mt-1 text-sm text-subtle">{job.location}</p>}
                </div>

                <Reveal className={cardRight ? "lg:order-2" : "lg:order-1"}>
                  <article className={`spotlight card p-6 sm:p-7 ${job.current ? "border-accent/50" : ""}`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-xl font-semibold">{job.role}</h3>
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
                      <span className="lg:hidden">
                        {" "}
                        · {job.start} — {job.end}
                      </span>
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                          <span className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                      {job.stack.map((t) => (
                        <li key={t}>
                          <TechChip name={t} size="sm" />
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
