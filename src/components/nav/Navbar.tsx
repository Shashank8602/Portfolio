"use client";

import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { ThemeSwitcher } from "./ThemeSwitcher";

type Props = {
  initials: string;
  links: { id: string; label: string }[];
  resume: string;
  github: string;
  linkedin: string;
};

export function Navbar({ initials, links, resume, github, linkedin }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll progress bar along the bottom edge of the navbar.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [links]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass border-b border-border/60">
        <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-4">
          <a href="#top" className="group flex items-center gap-2.5" aria-label={`${initials}, back to top`}>
            <span className="bg-gradient-accent grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-accent-fg shadow-[0_0_24px_-4px_var(--accent)]">
              {initials}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm ring-1 transition-colors duration-300 ${
                    active === l.id ? "bg-elevated text-fg ring-border" : "text-muted ring-transparent hover:text-fg"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <a
              href={resume}
              download
              className="ml-1 hidden items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-accent/20 lg:inline-flex"
            >
              <Download className="size-4" />
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full text-fg hover:bg-elevated md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
        <div ref={progressRef} aria-hidden="true" className="bg-gradient-accent h-px origin-left scale-x-0" />
      </div>

      {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-x flex h-16 items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-subtle uppercase">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="grid size-11 place-items-center rounded-full hover:bg-elevated"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="container-x mt-6 flex flex-col gap-1">
              {links.map((l, i) => (
                <li key={l.id} className="animate-slide-in" style={{ animationDelay: `${0.04 * i + 0.05}s` }}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 font-display text-3xl font-semibold"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="container-x mt-auto flex items-center gap-3 pb-[max(2rem,env(safe-area-inset-bottom))]">
              <a
                href={resume}
                download
                className="bg-gradient-accent inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 font-medium text-accent-fg"
              >
                <Download className="size-4" />
                Download résumé
              </a>
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-12 place-items-center rounded-full border border-border">
                <GithubIcon />
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-12 place-items-center rounded-full border border-border">
                <LinkedinIcon />
              </a>
            </div>
          </div>
      )}
    </header>
  );
}
