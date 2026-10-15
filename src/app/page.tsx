import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/nav/Navbar";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { TechIconSprite } from "@/components/ui/TechChip";
import { buildKnowledgeBase } from "@/content/assistant";
import { profile } from "@/content/profile";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  const kb = buildKnowledgeBase(profile);
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Section numbers stay sequential when optional sections are hidden.
  const order = ["about", "skills", "experience", "projects", ...(profile.certifications.length ? ["certifications"] : []), "contact"];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    worksFor: { "@type": "Organization", name: profile.company },
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    url: profile.siteUrl,
    email: `mailto:${profile.contact.email}`,
    sameAs: [profile.contact.linkedin, profile.contact.github],
    knowsAbout: profile.skills.flatMap((s) => s.items).slice(0, 20),
  };

  const techNames = [
    ...profile.skills.flatMap((s) => s.items),
    ...profile.experience.flatMap((e) => e.stack),
    ...profile.projects.flatMap((p) => p.stack),
  ];

  return (
    <>
      <TechIconSprite names={techNames} />
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar
        initials={initials}
        links={NAV_LINKS}
        resume={profile.resume}
        github={profile.contact.github}
        linkedin={profile.contact.linkedin}
      />
      <main id="main">
        <Hero profile={profile} kb={kb} />
        <About profile={profile} index={n("about")} />
        <Skills skills={profile.skills} index={n("skills")} />
        <Experience experience={profile.experience} index={n("experience")} />
        <Projects projects={profile.projects} index={n("projects")} />
        <Certifications certifications={profile.certifications} index={n("certifications")} />
        <Contact profile={profile} index={n("contact")} />
      </main>
      <Footer name={profile.name} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
