import { Briefcase, MapPin } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Profile } from "@/content/types";

export function About({ profile, index }: { profile: Profile; index: string }) {
  return (
    <Section
      id="about"
      index={index}
      eyebrow="about"
      title={
        <>
          Turning foundation models into <span className="text-gradient">dependable products</span>.
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <Reveal className="col-span-2 lg:col-span-4 lg:row-span-2">
          <div className="spotlight card h-full p-6 sm:p-8">
            <div className="space-y-4 text-base leading-relaxed text-muted sm:text-[17px]">
              {profile.summary.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                <Briefcase className="size-3.5 text-accent" />
                {profile.role} · {profile.company}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                <MapPin className="size-3.5 text-accent" />
                {profile.location}
              </span>
            </div>
          </div>
        </Reveal>

        {profile.metrics.map((m, i) => (
          <Reveal key={m.label} delay={0.06 * i} className="col-span-1">
            <div className="spotlight card flex h-full flex-col justify-between gap-3 p-5 sm:p-6">
              <span className="text-gradient font-display text-[clamp(2rem,5vw,2.75rem)] leading-none font-bold">
                <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} />
              </span>
              <span className="text-sm text-muted">{m.label}</span>
            </div>
          </Reveal>
        ))}

        {profile.exploring.length > 0 && (
          <Reveal className="col-span-2 lg:col-span-6">
            <div className="card marquee flex items-center gap-4 overflow-hidden py-4 pl-5 sm:pl-6">
              <span className="shrink-0 font-mono text-[11px] tracking-widest text-accent uppercase">Currently exploring</span>
              <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
                <div className="animate-marquee flex w-max">
                  {[0, 1].map((copy) => (
                    <ul key={copy} aria-hidden={copy === 1 ? "true" : undefined} className="flex shrink-0 items-center">
                      {profile.exploring.map((topic) => (
                        <li key={topic} className="flex items-center gap-4 pr-4 text-sm whitespace-nowrap text-fg">
                          {topic}
                          <span className="size-1 rounded-full bg-accent-2" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
