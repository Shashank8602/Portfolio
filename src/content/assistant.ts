import { gmailComposeUrl } from "@/lib/email";
import type { Intent, KnowledgeBase, Profile } from "./types";

/**
 * Builds the knowledge base for the "Ask my AI" console.
 *
 * Most answers are generated from profile.ts, so they stay in sync. The
 * hand-written topics further down (RAG, agents, "why hire you"…) are worth
 * rewriting in your own words — edit the `answer` strings freely.
 *
 * This runs on the server only: the phone number is never included here.
 */
export function buildKnowledgeBase(p: Profile): KnowledgeBase {
  const first = p.firstName;
  const current = p.experience.find((e) => e.current) ?? p.experience[0];
  const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");
  const words = (s: string) =>
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1);

  const intents: Intent[] = [];

  /* ------------------------------------------------------------ identity */

  intents.push({
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hola", "namaste", "greetings", "yo", "sup", "morning", "evening"],
    examples: ["hi", "hello there", "hey", "good morning"],
    answer: `Hey 👋 I'm ${first}'s portfolio model. Ask me about ${first}'s skills, experience, projects or how to get in touch.`,
    chips: ["Tell me about yourself", "What's your tech stack?", "Show me your projects"],
  });

  intents.push({
    id: "about",
    keywords: ["self", "background", "summary", "overview", "profile", "name"],
    examples: ["tell me about yourself", "who are you", `who is ${first}`, "introduce yourself", "give me a quick summary"],
    answer: `${p.name} is a ${p.role} at ${p.company}, based in ${p.location}, with ${p.yearsOfExperience} years of experience building LLM-powered applications.\n\n${p.summary[0]}`,
    chips: ["What's your tech stack?", "Current role?", "Best project?"],
    actions: [{ type: "scroll", target: "about", label: "Read more" }],
  });

  intents.push({
    id: "role",
    keywords: ["role", "current", "currently", "now", "company", "employer", "work", "doing", "today"],
    examples: ["what do you do", "where do you work", "what is your current role", "current job", "what are you doing now"],
    answer: current
      ? `Right now ${first} is a ${current.role} at ${current.company} (since ${current.start}).\n\nHighlights:\n${bullets(current.highlights)}`
      : `${first} is a ${p.role} at ${p.company}.`,
    chips: ["Previous experience?", "What's your tech stack?"],
    actions: [{ type: "scroll", target: "experience", label: "View timeline" }],
  });

  intents.push({
    id: "experience",
    keywords: ["experience", "career", "history", "year", "previous", "past", "worked", "journey", "senior"],
    examples: ["how many years of experience", "work history", "previous companies", "tell me about your career", "where have you worked"],
    answer: `${p.yearsOfExperience.charAt(0).toUpperCase()}${p.yearsOfExperience.slice(1)} years of experience:\n\n${p.experience
      .map((e) => `• ${e.role} — ${e.company} (${e.start} – ${e.end})`)
      .join("\n")}\n\nAsk about any company by name for details.`,
    chips: p.experience.slice(0, 2).map((e) => `What did you do at ${e.company}?`),
    actions: [{ type: "scroll", target: "experience", label: "View timeline" }],
  });

  for (const e of p.experience) {
    intents.push({
      id: `company:${e.company}`,
      keywords: words(e.company),
      examples: [`what did you do at ${e.company}`, `tell me about ${e.company}`],
      answer: `${e.role} at ${e.company}${e.location ? `, ${e.location}` : ""} (${e.start} – ${e.end}):\n\n${bullets(
        e.highlights,
      )}\n\nStack: ${e.stack.join(" · ")}`,
      actions: e.companyUrl ? [{ type: "link", href: e.companyUrl, label: e.company }] : undefined,
    });
  }

  /* ------------------------------------------------------------ skills */

  intents.push({
    id: "skills",
    keywords: ["skill", "good", "strong", "capable", "specialize", "specialise", "specialty"],
    examples: ["what's your tech stack", "what are your skills", "which tools do you use", "what are you good at"],
    answer: `${first}'s stack at a glance:\n\n${p.skills
      .map((c) => `• ${c.title}: ${c.items.slice(0, 5).join(", ")}${c.items.length > 5 ? "…" : ""}`)
      .join("\n")}`,
    chips: p.skills.slice(0, 3).map((c) => `Tell me about ${c.title}`),
    actions: [{ type: "scroll", target: "skills", label: "See all skills" }],
  });

  for (const c of p.skills) {
    intents.push({
      id: `skill:${c.title}`,
      keywords: [...words(c.title), ...c.items.flatMap(words)],
      examples: [
        `tell me about ${c.title}`,
        `which ${c.title} have you worked with`,
        `what ${c.title} do you use`,
        `${c.title} experience`,
      ],
      answer: `${c.title} — ${c.blurb}\n\n${c.items.join(" · ")}`,
      actions: [{ type: "scroll", target: "skills", label: "See skills" }],
    });
  }

  /* ------------------------------------------------------------ projects */

  intents.push({
    id: "projects",
    keywords: ["project", "built", "build", "portfolio", "showcase", "demo", "made", "create", "created"],
    examples: ["show me your projects", "what have you built", "any side projects", "portfolio projects"],
    answer: `Featured projects:\n\n${p.projects
      .map((pr) => `• ${pr.title} — ${pr.tagline}${pr.metric ? ` (${pr.metric.value} ${pr.metric.label})` : ""}`)
      .join("\n")}\n\nAsk about any project by name for the full story.`,
    chips: p.projects.slice(0, 3).map((pr) => `Tell me about ${pr.title}`),
    actions: [{ type: "scroll", target: "projects", label: "View projects" }],
  });

  const projectAnswer = (pr: Profile["projects"][number]) =>
    [
      `${pr.title} — ${pr.tagline}`,
      [
        pr.problem && `Problem: ${pr.problem}`,
        pr.approach && `Approach: ${pr.approach}`,
        pr.outcome && `Outcome: ${pr.outcome}`,
        pr.highlights?.length && bullets(pr.highlights),
        pr.metric && `Result: ${pr.metric.value} ${pr.metric.label}`,
      ]
        .filter(Boolean)
        .join("\n"),
      `Stack: ${pr.stack.join(" · ")}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  const projectLinks = (pr: Profile["projects"][number]) =>
    [
      pr.links?.github && { type: "link" as const, href: pr.links.github, label: "GitHub" },
      pr.links?.demo && { type: "link" as const, href: pr.links.demo, label: "Live demo" },
    ].filter((a) => !!a);

  if (p.projects[0]) {
    intents.push({
      id: "best-project",
      keywords: ["best", "favorite", "proud", "proudest", "top", "flagship", "impressive", "biggest", "highlight"],
      examples: ["what is your best project", "which project are you most proud of", "favourite project"],
      answer: projectAnswer(p.projects[0]),
      actions: projectLinks(p.projects[0]),
    });
  }

  for (const pr of p.projects) {
    intents.push({
      id: `project:${pr.title}`,
      keywords: words(pr.title),
      examples: [`tell me about ${pr.title}`, `what is ${pr.title}`],
      answer: projectAnswer(pr),
      actions: projectLinks(pr),
    });
  }

  /* ------------------------------------------------------------ hand-written topics (edit freely) */

  intents.push({
    id: "rag",
    keywords: ["rag", "retrieval", "vector", "embedding", "semantic", "search", "chunk", "rerank", "knowledge", "grounding"],
    examples: ["do you know rag", "experience with retrieval augmented generation", "how do you build rag systems", "vector databases"],
    answer: `RAG is the core of ${first}'s work.\n\n• At Wipro: an end-to-end RAG platform for a banking client — document ingestion, chunking, indexing and embedding; hybrid retrieval (BM25 + vector search) merged with Reciprocal Rank Fusion and refined by a reranker; streamed answers with source citations.\n• DevDocs: a RAG assistant for codebases with structure-aware chunking, similarity-based gating before the LLM, file-and-line citations and a 428-question evaluation benchmark.\n\nVector search: Qdrant, pgvector, Elasticsearch.`,
    chips: p.projects[0] ? [`Tell me about ${p.projects[0].title}`] : undefined,
  });

  intents.push({
    id: "agents",
    keywords: ["agent", "autonomous", "tool", "function", "calling", "mcp", "orchestration", "multi", "workflow", "langgraph", "agentfabric", "wega"],
    examples: ["have you built ai agents", "experience with agentic ai", "tool calling", "multi agent systems"],
    answer: `${first} has worked on agentic systems in two places:\n\n• AgentFabric — co-developed an agentic AI platform.\n• WEGA-Studio at Wipro — co-developed an internal application that runs agentic workflows through Factory AI's Droid Exec, integrating Jira and Git over MCP (documentation, user stories, code features, test cases).\n\nSkills: tool and function calling, multi-agent orchestration, LangChain and LangGraph.`,
    chips: ["Tell me about WEGA-Studio"],
  });

  intents.push({
    id: "why-hire",
    keywords: ["why", "hire", "strength", "unique", "different", "value", "stand", "choose", "fit", "bring"],
    examples: ["why should we hire you", "what makes you different", "what are your strengths", "why you"],
    answer: `What ${first} brings:\n\n• Hands-on with the whole RAG pipeline — ingestion, chunking, hybrid retrieval, reranking and cited, streamed answers.\n• Measures results — DevDocs was evaluated on a 428-question benchmark (Recall@5 0.83 → 0.87 and MRR 0.78 → 0.83 on tuning data).\n• Agentic work too — co-developed AgentFabric and WEGA-Studio.\n\nExperience so far: ${p.yearsOfExperience} years.`,
    chips: ["How do I contact you?", "Download résumé"],
  });

  intents.push({
    id: "exploring",
    keywords: ["learning", "learn", "exploring", "explore", "interest", "interested", "curious", "next", "future", "trend", "reading"],
    examples: ["what are you learning", "what are you exploring right now", "what interests you", "what's next"],
    answer: `Currently exploring:\n\n${bullets(p.exploring)}`,
  });

  if (p.certifications.length) {
    intents.push({
      id: "certifications",
      keywords: ["certification", "certificate", "certified", "cert", "course", "credential", "badge"],
      examples: ["do you have certifications", "any certificates", "courses completed"],
      answer: `Certifications:\n\n${p.certifications.map((c) => `• ${c.name} — ${c.issuer} (${c.year})`).join("\n")}`,
      actions: [{ type: "scroll", target: "certifications", label: "View certifications" }],
    });
  }

  if (p.education.length) {
    intents.push({
      id: "education",
      keywords: ["education", "degree", "study", "studied", "university", "college", "school", "graduate", "graduation", "qualification", "cgpa", "gpa", "grade", "marks"],
      examples: ["what is your education", "where did you study", "which degree do you have"],
      answer: `Education:\n\n${p.education.map((e) => `• ${e.degree} — ${e.school} (${e.year})`).join("\n")}`,
    });
  }

  /* ------------------------------------------------------------ contact */

  intents.push({
    id: "contact",
    keywords: ["contact", "reach", "email", "connect", "touch", "message", "talk", "chat", "hire"],
    examples: ["how do i contact you", "what is your email", "how can i reach you", "let's connect", "get in touch"],
    answer: `Best ways to reach ${first}:\n\n• Email — ${p.contact.email}\n• LinkedIn — ${p.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}\n• GitHub — ${p.contact.github.replace(/^https?:\/\/(www\.)?/, "")}\n\nThe phone number is behind a "Show number" button to keep spam bots away.`,
    actions: [
      { type: "link", href: gmailComposeUrl(p.contact.email), label: "Write in Gmail" },
      { type: "reveal-phone", label: "Show phone" },
    ],
  });

  intents.push({
    id: "phone",
    keywords: ["phone", "call", "number", "mobile", "whatsapp", "cell", "ring"],
    examples: ["what is your phone number", "can i call you", "mobile number"],
    answer: `The phone number is hidden from scrapers 🤖 — tap below and it'll be revealed in the Contact section.`,
    actions: [{ type: "reveal-phone", label: "Show phone" }],
  });

  intents.push({
    id: "linkedin",
    keywords: ["linkedin"],
    examples: ["linkedin profile", "are you on linkedin"],
    answer: `Here's ${first}'s LinkedIn: ${p.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`,
    actions: [{ type: "link", href: p.contact.linkedin, label: "Open LinkedIn" }],
  });

  intents.push({
    id: "github",
    keywords: ["github", "repo", "repository", "opensource", "source"],
    examples: ["github profile", "where is your code", "open source work"],
    answer: `Code lives on GitHub: ${p.contact.github.replace(/^https?:\/\/(www\.)?/, "")}`,
    actions: [{ type: "link", href: p.contact.github, label: "Open GitHub" }],
  });

  intents.push({
    id: "resume",
    keywords: ["resume", "cv", "pdf", "download"],
    examples: ["can i see your resume", "download cv", "send me your resume"],
    answer: `Sure — grab the latest résumé below (PDF).`,
    actions: [{ type: "download", href: p.resume, label: "Download résumé" }],
  });

  intents.push({
    id: "location",
    keywords: ["where", "location", "based", "live", "city", "country", "remote", "relocate", "relocation", "onsite", "hybrid", "timezone"],
    examples: ["where are you based", "where do you live", "are you open to remote", "can you relocate"],
    answer: [`${first} is based in ${p.location}.`, p.availability].filter(Boolean).join(" "),
  });

  intents.push({
    id: "availability",
    keywords: ["available", "availability", "opportunity", "looking", "freelance", "notice", "opening", "open"],
    examples: ["are you available", "are you looking for a job", "open to opportunities", "available for freelance"],
    answer: p.openToWork
      ? `Yes! ${p.availability || "Open to new opportunities."}\n\nThe fastest route is email: ${p.contact.email}`
      : `For roles, projects or collaborations, the best route is email: ${p.contact.email}`,
    chips: ["Download résumé", "How do I contact you?"],
  });

  /* ------------------------------------------------------------ meta & small talk */

  intents.push({
    id: "meta",
    keywords: ["real", "console", "chatbot", "bot", "chatgpt", "backend", "api", "website", "site", "fake", "powered", "trained"],
    examples: ["are you a real ai", "how does this console work", "is this chatgpt", "how was this site built", "what powers you"],
    answer: `Honest answer: I'm a tiny intent-matching model that runs entirely in your browser — no server, no API key, no data leaves your device.\n\nI normalise your question, expand synonyms, fuzzy-match it against ${first}'s profile and stream the answer token-by-token like an LLM. The site itself is Next.js + Tailwind + a hand-written canvas neural net, hosted on Vercel.`,
  });

  intents.push({
    id: "joke",
    keywords: ["joke", "funny", "laugh", "humor", "humour", "fun"],
    examples: ["tell me a joke", "say something funny"],
    answer: `Why did the LLM break up with the vector database?\n\nIt said the relationship lacked context. 🥁`,
  });

  intents.push({
    id: "thanks",
    keywords: ["thank", "thanks", "bye", "goodbye", "cheers", "great", "awesome", "cool", "nice", "perfect"],
    examples: ["thanks", "thank you", "bye", "awesome"],
    answer: `Anytime! If you'd like to talk with the real ${first}, the Contact section is one scroll away. 🚀`,
    actions: [{ type: "scroll", target: "contact", label: "Go to contact" }],
  });

  return {
    modelName: `${first.toLowerCase().replace(/[^a-z0-9]/g, "")}-llm`,
    firstName: first,
    greeting: `Hi! I'm ${first}'s portfolio model, running locally in your browser. Ask me anything about ${first}'s work — or type /help.`,
    suggestions: ["Tell me about yourself", "What's your tech stack?", "Show me your projects", "How do I contact you?"],
    fallback: `Hmm, that's outside my training data — I only know about ${first}'s profile. 🙂\n\nTry asking about skills, experience, projects, RAG, agents or how to get in touch.`,
    resume: p.resume,
    intents,
  };
}
