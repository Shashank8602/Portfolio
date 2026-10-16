import { ArrowDown, Download, Mail, MapPin, Sparkles } from "lucide-react";
import { AIConsole, AskButton } from "@/components/console/AIConsole";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import type { KnowledgeBase, Profile } from "@/content/types";
import { DecodeText } from "./DecodeText";
import { NeuralCanvas } from "./NeuralCanvas";

export function Hero({ profile, kb }: { profile: Profile; kb: KnowledgeBase }) {
  const socials = [
    { href: profile.contact.github, label: "GitHub", icon: <GithubIcon className="size-[18px]" /> },
    { href: profile.contact.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-[18px]" /> },
    { href: "#contact", label: "Email — see contact options", icon: <Mail className="size-[18px]" /> },
  ];

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-14"
    >
      {/* Background: blueprint grid, soft accent glows, live neural network */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div
          className="absolute -top-48 left-1/2 h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 12%, transparent), transparent)" }}
        />
        <NeuralCanvas />
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <div className="animate-fade-up flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 font-mono text-xs text-muted">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="ping-soft absolute inline-flex size-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {profile.role} @ {profile.company}
            </span>
            {profile.openToWork && (
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-fg">
                Open to opportunities
              </span>
            )}
          </div>

          <p className="animate-fade-up mt-8 font-mono text-sm text-muted [animation-delay:60ms]">
            <span className="text-accent">&gt;</span> Hi, I&apos;m
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.75rem,8.5vw,5.5rem)] leading-[0.95] font-bold tracking-tight text-balance">
            {profile.name}
          </h1>
          <p className="mt-4 min-h-[1.3em] font-display [overflow-wrap:anywhere] text-[clamp(1.35rem,3.6vw,2.1rem)] font-medium">
            <DecodeText phrases={profile.rotatingRoles} className="text-accent" />
          </p>
          <p className="animate-fade-up mt-6 max-w-xl text-base text-pretty text-muted [animation-delay:140ms] sm:text-lg">
            {profile.tagline}
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
            <AskButton className="bg-accent inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-medium text-accent-fg transition-opacity hover:opacity-90">
              <Sparkles className="size-4" />
              Ask my AI
            </AskButton>
            <a
              href={profile.resume}
              download
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface/60 px-6 font-medium text-fg transition-colors hover:border-accent/60"
            >
              <Download className="size-4" />
              Download CV
            </a>
          </div>

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 [animation-delay:260ms]">
            <ul className="flex items-center gap-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-sm text-subtle">
              <MapPin className="size-4" />
              {profile.location}
            </span>
          </div>
        </div>

        <div className="animate-fade-up min-w-0 [animation-delay:240ms]">
          <AIConsole kb={kb} />
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-widest text-subtle uppercase transition-colors hover:text-fg lg:flex"
      >
        scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
