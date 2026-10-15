import type { ConsoleAction, Intent, KnowledgeBase } from "@/content/types";
import { THEMES, type Mode, type ThemeName } from "@/lib/theme";

/**
 * A tiny, dependency-free intent matcher. It normalises the question, maps
 * synonyms, tolerates typos and scores every intent on keyword coverage plus
 * fuzzy similarity to its example phrasings. No network, no model weights.
 */

export type Effect =
  | { type: "clear" }
  | { type: "theme"; theme?: ThemeName; mode?: Mode }
  | { type: "download"; href: string };

export type Reply = {
  text: string;
  chips?: string[];
  actions?: ConsoleAction[];
  effect?: Effect;
};

const STOP = new Set(
  (
    "a an the is are am was were be been being do does did done you your yours youre u ur i im ive me my mine we us our " +
    "to of in on at for with and or but if so as by from into about what whats which how many much tell can could would " +
    "will shall should may might please pls some any have has had this that these those it its there here just know like " +
    "give show see let lets get got want wanna need more also very really okay ok well"
  ).split(" "),
);

// Variant → canonical form (applied after stemming).
const SYNONYMS: Record<string, string> = {
  yourself: "self",
  urself: "self",
  who: "self",
  introduce: "self",
  introduction: "self",
  intro: "self",
  bio: "self",
  stack: "skill",
  techstack: "skill",
  tech: "skill",
  technology: "skill",
  tool: "skill",
  toolkit: "skill",
  expertise: "skill",
  proficiency: "skill",
  yr: "year",
  yoe: "year",
  mail: "email",
  gmail: "email",
  job: "role",
  position: "role",
  designation: "role",
  title: "role",
  favourite: "favorite",
  fav: "favorite",
  thx: "thank",
  ty: "thank",
  repo: "github",
  repository: "github",
  mobile: "phone",
  cell: "phone",
  whatsapp: "phone",
  agentic: "agent",
  llms: "llm",
  genai: "llm",
  cv: "resume",
};

function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(w: string): string {
  let s = w;
  if (s.length > 4 && s.endsWith("ies")) s = s.slice(0, -3) + "y";
  else if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("ed")) s = s.slice(0, -2);
  return s;
}

function canonical(w: string): string {
  return SYNONYMS[w] ?? SYNONYMS[stem(w)] ?? stem(w);
}

export function tokenize(s: string): string[] {
  const out = new Set<string>();
  for (const w of normalise(s).split(" ")) {
    if (!w || STOP.has(w)) continue;
    out.add(canonical(w));
  }
  return [...out];
}

/** Optimal-string-alignment distance (Levenshtein + transpositions). */
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

function bigrams(s: string): Map<string, number> {
  const str = normalise(s).replace(/\s/g, "");
  const m = new Map<string, number>();
  for (let i = 0; i < str.length - 1; i++) {
    const g = str.slice(i, i + 2);
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

/** Sørensen–Dice similarity on character bigrams (0…1). */
function dice(a: Map<string, number>, b: Map<string, number>): number {
  let total = 0;
  let overlap = 0;
  for (const n of a.values()) total += n;
  for (const [g, n] of b) {
    total += n;
    overlap += Math.min(n, a.get(g) ?? 0);
  }
  return total ? (2 * overlap) / total : 0;
}

type Compiled = { intent: Intent; keys: Set<string>; examples: Map<string, number>[] };
type Model = { intents: Compiled[]; df: Map<string, number> };

// Words that describe *what kind* of answer is wanted rather than the topic.
const GENERIC = new Set(["experience", "skill", "use", "used", "about"]);

const cache = new WeakMap<KnowledgeBase, Model>();

function compile(kb: KnowledgeBase): Model {
  let model = cache.get(kb);
  if (!model) {
    const intents = kb.intents.map((intent) => ({
      intent,
      keys: new Set(intent.keywords.flatMap(tokenize)),
      examples: intent.examples.map(bigrams),
    }));
    const df = new Map<string, number>();
    for (const c of intents) for (const k of c.keys) df.set(k, (df.get(k) ?? 0) + 1);
    model = { intents, df };
    cache.set(kb, model);
  }
  return model;
}

/** Rare, specific words (e.g. "pytorch") outweigh ones shared by many intents (e.g. "work"). */
function weight(token: string, df: Map<string, number>): number {
  const n = df.get(token) ?? 0;
  return (n > 1 ? 1 / Math.sqrt(n) : 1) * (GENERIC.has(token) ? 0.5 : 1);
}

function tokenScore(token: string, keys: Set<string>): number {
  if (keys.has(token)) return 1;
  if (token.length < 4) return 0;
  const max = token.length >= 7 ? 2 : 1;
  for (const k of keys) {
    if (k.length >= 4 && editDistance(token, k) <= max) return 0.85;
  }
  return 0;
}

export function match(input: string, kb: KnowledgeBase): { intent: Intent; score: number } | null {
  const { intents, df } = compile(kb);
  const tokens = tokenize(input);
  const weights = tokens.map((t) => weight(t, df));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const q = bigrams(input);
  let best: { intent: Intent; score: number } | null = null;

  for (const c of intents) {
    const kw = totalWeight
      ? tokens.reduce((sum, t, i) => sum + weights[i] * tokenScore(t, c.keys), 0) / totalWeight
      : 0;
    const ex = c.examples.reduce((m, e) => Math.max(m, dice(q, e)), 0);
    const score = tokens.length ? 0.6 * kw + 0.4 * ex : ex;
    if (!best || score > best.score) best = { intent: c.intent, score };
  }

  return best && best.score >= 0.34 ? best : null;
}

function byId(kb: KnowledgeBase, id: string): Reply {
  const intent = kb.intents.find((i) => i.id === id);
  return intent ? { text: intent.answer, chips: intent.chips, actions: intent.actions } : { text: kb.fallback };
}

const HELP = `Available commands:

/help         show this list
/skills       tech stack overview
/experience   career timeline
/projects     featured projects
/contact      ways to get in touch
/resume       download the résumé
/theme <name> nebula · matrix · sunset · light · dark
/clear        reset the conversation

Or just ask a question in plain English.`;

function command(input: string, kb: KnowledgeBase): Reply {
  const [cmd, arg = ""] = input.slice(1).trim().toLowerCase().split(/\s+/);
  switch (cmd) {
    case "help":
    case "?":
      return { text: HELP };
    case "skills":
    case "experience":
    case "projects":
    case "contact":
      return byId(kb, cmd);
    case "resume":
    case "cv":
      return { text: "Downloading the résumé… 📄", effect: { type: "download", href: kb.resume } };
    case "clear":
      return { text: "", effect: { type: "clear" } };
    case "theme": {
      if ((THEMES as readonly string[]).includes(arg)) {
        return { text: `Theme switched to ${arg}. ✨`, effect: { type: "theme", theme: arg as ThemeName } };
      }
      if (arg === "light" || arg === "dark") {
        return { text: `Switched to ${arg} mode.`, effect: { type: "theme", mode: arg } };
      }
      return { text: `Usage: /theme <${THEMES.join(" | ")} | light | dark>` };
    }
    default:
      return { text: `Unknown command "/${cmd}". Type /help to see what I can do.` };
  }
}

export function respond(input: string, kb: KnowledgeBase): Reply {
  const trimmed = input.trim();
  if (trimmed.startsWith("/")) return command(trimmed, kb);

  const hit = match(trimmed, kb);
  if (!hit) return { text: kb.fallback, chips: kb.suggestions };
  return { text: hit.intent.answer, chips: hit.intent.chips, actions: hit.intent.actions };
}

/** Splits text into sub-word chunks so it streams like LLM tokens. */
export function toTokens(text: string): string[] {
  return text.match(/\s+|[^\s]{1,4}/g) ?? [];
}
