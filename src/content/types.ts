export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type SkillIcon =
  | "sparkles"
  | "code"
  | "workflow"
  | "brain"
  | "database"
  | "cloud"
  | "shield";

export type SkillCategory = {
  title: string;
  icon: SkillIcon;
  blurb: string;
  /** Featured categories get a wider tile in the bento grid. */
  featured?: boolean;
  items: string[];
};

export type Experience = {
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
  stack: string[];
};

export type Project = {
  title: string;
  tagline: string;
  /** Optional narrative fields: only the ones you fill in are shown. */
  problem?: string;
  approach?: string;
  outcome?: string;
  /** Optional bullet list, shown when you don't have a problem/approach/outcome story. */
  highlights?: string[];
  /** Full-width card with the details in a second column. Use for your 1–2 flagship projects. */
  featured?: boolean;
  metric?: { value: string; label: string };
  /** Steps rendered as the mini architecture diagram on the card. */
  pipeline: string[];
  stack: string[];
  links?: { github?: string; demo?: string };
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  url?: string;
};

export type Education = {
  degree: string;
  school: string;
  year: string;
};

export type Profile = {
  name: string;
  firstName: string;
  /** Short text on the home button in the navbar. Defaults to your initials. */
  monogram?: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  /** Free text, e.g. "nearly 2" or "3+" — shown as "<value> years" in the console. */
  yearsOfExperience: string;
  openToWork: boolean;
  /** Optional sentence about location / availability. Leave "" to say nothing. */
  availability: string;
  tagline: string;
  rotatingRoles: string[];
  summary: string[];
  siteUrl: string;
  resume: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  metrics: Metric[];
  exploring: string[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
};

/* ---------------------------------------------------------------- console */

export type ConsoleAction =
  | { type: "scroll"; target: string; label: string }
  | { type: "link"; href: string; label: string }
  | { type: "download"; href: string; label: string }
  | { type: "reveal-phone"; label: string };

export type Intent = {
  id: string;
  /** Words that signal this intent. Normalised, stemmed and synonym-mapped at match time. */
  keywords: string[];
  /** Sample phrasings, compared fuzzily against the visitor's question. */
  examples: string[];
  answer: string;
  chips?: string[];
  actions?: ConsoleAction[];
};

export type KnowledgeBase = {
  modelName: string;
  firstName: string;
  greeting: string;
  suggestions: string[];
  fallback: string;
  resume: string;
  intents: Intent[];
};
