import { BrainCircuit, Cloud, Code, Database, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechChip";
import type { SkillCategory, SkillIcon } from "@/content/types";

const ICONS: Record<SkillIcon, typeof Sparkles> = {
  sparkles: Sparkles,
  code: Code,
  workflow: Workflow,
  brain: BrainCircuit,
  database: Database,
  cloud: Cloud,
  shield: ShieldCheck,
};

export function Skills({ skills, index }: { skills: SkillCategory[]; index: string }) {
  // On the 2-column tablet grid, stretch the last tile if it would sit alone.
  const tabletUnits = skills.reduce((n, s) => n + (s.featured ? 2 : 1), 0);

  return (
    <Section
      id="skills"
      index={index}
      eyebrow="skills"
      title={
        <>
          A toolkit built for the <span className="text-gradient">GenAI stack</span>.
        </>
      }
      description="From prompt to production: the models, frameworks and infrastructure I use to ship AI that works."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {skills.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          const lastAlone = i === skills.length - 1 && !s.featured && tabletUnits % 2 === 1;
          const span = s.featured ? "sm:col-span-2 lg:col-span-4" : lastAlone ? "sm:col-span-2 lg:col-span-2" : "lg:col-span-2";
          return (
            <Reveal key={s.title} delay={0.05 * (i % 3)} className={span}>
              <div className="spotlight card h-full p-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{s.blurb}</p>
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li key={item}>
                      <TechChip name={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
