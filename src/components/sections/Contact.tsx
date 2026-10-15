import { ArrowUpRight, Mail, Phone, Send } from "lucide-react";
import type { ReactNode } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { CopyButton } from "@/components/ui/CopyButton";
import { PhoneReveal } from "@/components/ui/PhoneReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Profile } from "@/content/types";

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function ContactCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="spotlight card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">{icon}</span>
        <span className="font-mono text-[11px] tracking-widest text-subtle uppercase">{label}</span>
      </div>
      <div className="mt-5 min-w-0 flex-1">{children}</div>
    </div>
  );
}

function LinkCard({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <ContactCard icon={icon} label={label}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-start gap-1 font-medium break-all text-fg after:absolute after:inset-0 after:rounded-[1.25rem] after:content-[''] hover:text-accent"
      >
        {handle(href)}
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
      <p className="mt-4 text-xs text-subtle">Opens in a new tab</p>
    </ContactCard>
  );
}

export function Contact({ profile, index }: { profile: Profile; index: string }) {
  const { email, phone, linkedin, github } = profile.contact;
  // Reversed + base64 so the number never appears as plain text in the HTML.
  const encodedPhone = Buffer.from([...phone].reverse().join(""), "utf8").toString("base64");

  return (
    <Section
      id="contact"
      index={index}
      eyebrow="contact"
      title={
        <>
          Let&apos;s build something <span className="text-gradient">intelligent</span>.
        </>
      }
      description="Hiring for an AI role, scoping a GenAI product, or just want to talk LLMs? My inbox is open — I usually reply within a day."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <ContactCard icon={<Mail className="size-[18px]" />} label="Email">
            <a href={`mailto:${email}`} className="font-medium break-all text-fg hover:text-accent">
              {email}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 text-xs font-medium transition-colors hover:bg-accent/20"
              >
                <Send className="size-3.5" />
                Write
              </a>
              <CopyButton value={email} />
            </div>
          </ContactCard>
        </Reveal>
        <Reveal delay={0.05}>
          <ContactCard icon={<Phone className="size-[18px]" />} label="Phone">
            <PhoneReveal encoded={encodedPhone} />
          </ContactCard>
        </Reveal>
        <Reveal delay={0.1}>
          <LinkCard href={linkedin} icon={<LinkedinIcon className="size-[18px]" />} label="LinkedIn" />
        </Reveal>
        <Reveal delay={0.15}>
          <LinkCard href={github} icon={<GithubIcon className="size-[18px]" />} label="GitHub" />
        </Reveal>
      </div>
    </Section>
  );
}
