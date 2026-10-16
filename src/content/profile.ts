import type { Profile } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  YOUR PORTFOLIO CONTENT LIVES HERE.
 *  Everything below is taken from the résumé "SHASHANK_S_Resume_(October-2026)".
 *  Only facts stated there are used. Lines marked TODO still need your input.
 *  Optional lists (certifications, exploring) hide their section when empty.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const profile: Profile = {
  name: "Shashank S",
  firstName: "Shashank",
  monogram: "08", // home button in the navbar (leave out to use your initials)
  role: "GenAI Engineer",
  company: "Wipro Limited",
  companyUrl: "https://www.wipro.com",
  location: "Bengaluru, India",
  yearsOfExperience: "nearly 2", // résumé: "nearly 2 years of experience"
  openToWork: false, // set to true to show the "Open to opportunities" badge
  availability: "", // optional sentence, e.g. "Open to remote or hybrid roles."

  tagline:
    "I build LLM-powered applications in Python — RAG systems with hybrid retrieval, AI agents and LLM evaluation — integrating LLMs through FastAPI.",

  // Cycled by the "decoding" animation in the hero.
  rotatingRoles: [
    "GenAI Engineer",
    "LLM Application Developer",
    "RAG Systems Builder",
    "Agentic AI Engineer",
  ],

  summary: [
    "I'm a GenAI Engineer at Wipro in Bengaluru with nearly two years of experience developing LLM-powered applications using Python and modern AI frameworks. My work centres on RAG systems, hybrid information retrieval, AI agents and LLM evaluation, with LLMs integrated through FastAPI.",
    "I co-developed AgentFabric, an agentic AI platform, and built DevDocs, a RAG-based assistant for codebases. At Wipro I developed an end-to-end RAG platform for a banking client and co-developed WEGA-Studio, an internal application that runs agentic workflows.",
  ],

  siteUrl: "https://your-portfolio.vercel.app", // TODO: your final URL (used for SEO)
  resume: "/SHASHANK_S_Resume_(October-2026).pdf",

  contact: {
    email: "shashu.s08@gmail.com",
    phone: "+91 94830 71522", // never rendered as plain text in the HTML
    linkedin: "https://www.linkedin.com/in/shashank8602",
    github: "https://github.com/Shashank8602",
  },

  // Every figure below comes from the DevDocs project or the summary line of the résumé.
  metrics: [
    { value: 1.5, suffix: "+", label: "Years building LLM-powered apps" },
    { value: 2, prefix: "~", suffix: "s", label: "DevDocs burst-question latency, down from 40+ s" },
    { value: 0.87, label: "DevDocs Recall@5 on tuning data, up from 0.83" },
    { value: 428, label: "Questions in the DevDocs evaluation benchmark" },
  ],

  // Your own list: keep only topics you are genuinely exploring right now.
  exploring: [
    "LangGraph",
    "RAG",
    "Agentic workflows",
    "Model Context Protocol",
    "LLM evals & observability",
    "Structured outputs",
  ],

  // Brand logos appear automatically for known tools (see src/lib/tech-icons.ts);
  // unknown ones render as clean text chips.
  skills: [
    {
      title: "GenAI & LLMs",
      icon: "sparkles",
      featured: true,
      blurb: "Building retrieval, agent and evaluation layers around LLMs.",
      items: [
        "OpenAI GPT",
        "Claude",
        "RAG",
        "Hybrid retrieval",
        "Chunking strategies",
        "Embeddings",
        "Tool & function calling",
        "AI agents",
        "Agentic workflows",
        "Multi-agent orchestration",
        "LLM evaluation",
      ],
    },
    {
      title: "Languages & Frameworks",
      icon: "code",
      blurb: "Application code and LLM orchestration.",
      items: ["Python", "LangChain", "LangGraph", "FastAPI"],
    },
    {
      title: "Databases & Vector Search",
      icon: "database",
      blurb: "Relational stores and vector retrieval.",
      items: ["MySQL", "PostgreSQL", "Qdrant", "pgvector", "Elasticsearch"],
    },
    {
      title: "Cloud & Tools",
      icon: "cloud",
      blurb: "Deployment and version control.",
      items: ["Azure", "Docker", "Git", "GitHub"],
    },
    {
      title: "AI-Assisted Development",
      icon: "workflow",
      blurb: "AI coding tools in the daily workflow.",
      items: ["GitHub Copilot", "Claude Code", "Codex"],
    },
  ],

  // Most recent first.
  experience: [
    {
      role: "GenAI Engineer",
      company: "Wipro Limited",
      companyUrl: "https://www.wipro.com",
      location: "Bengaluru",
      start: "Mar 2025",
      end: "Present",
      current: true,
      highlights: [
        "Developed an end-to-end RAG platform for a banking client: policy document ingestion, chunking, indexing and embedding, hybrid retrieval, and streamed answers with citations.",
        "Co-developed WEGA-Studio, an internal application that uses Factory AI's Droid Exec to run agentic workflows — documentation, Jira user stories, code features and test cases — through MCP.",
      ],
      stack: ["OpenAI GPT", "Hybrid retrieval", "Reranker", "MCP", "Jira", "Git"],
    },
  ],

  projects: [
    {
      title: "DevDocs",
      tagline: "RAG assistant for codebases, built with grounded, citable answers.",
      highlights: [
        "Hybrid retrieval pipeline combining Elasticsearch BM25 and vector search with Reciprocal Rank Fusion, plus similarity-based gating that rejects off-topic queries before the LLM is called.",
        "Incremental ingestion with SHA-256 change detection, structure-aware chunking (Python AST, Markdown, PDF) and selective re-embedding, with PostgreSQL as the source of truth.",
        "Project isolation and file-and-line citations generated in application code, so answers stay grounded and verifiable.",
        "Streaming chat, conversation memory, Stop/Retry controls and fallback-model routing, which cut burst-question latency from 40+ seconds to about 2 seconds.",
        "Evaluated on a 428-question benchmark over a 104-file project: Recall@5 rose from 0.83 to 0.87 and MRR from 0.78 to 0.83 on tuning data, with further gains on held-out evaluation.",
      ],
      metric: { value: "~2 s", label: "burst-question latency (from 40+ s)" },
      pipeline: ["Ingest", "Chunk + embed", "BM25 + vector", "RRF", "Similarity gate", "LLM", "Cited answer"],
      stack: ["Python", "FastAPI", "React", "PostgreSQL", "Elasticsearch", "Docker"],
      // TODO: add links: { github: "https://github.com/Shashank8602/<repo>" } if the repository is public.
    },
    {
      title: "RAG Platform for a Banking Client",
      tagline: "End-to-end RAG over policy documents, built at Wipro.",
      highlights: [
        "Covers policy document ingestion, chunking, indexing and embedding.",
        "Hybrid retrieval combining BM25 and vector search (cosine similarity), merged with Reciprocal Rank Fusion and refined with a reranker.",
        "Streams LLM answers (OpenAI GPT model) with citations to the source files used.",
      ],
      pipeline: ["Policy docs", "Chunk + index", "BM25 + vector", "RRF + rerank", "GPT (streamed)", "Cited answer"],
      stack: ["OpenAI GPT", "Hybrid retrieval", "Reranker"],
    },
    {
      title: "WEGA-Studio",
      tagline: "Internal application for agentic workflows, co-developed at Wipro.",
      highlights: [
        "Uses Factory AI's Droid Exec to run agentic workflows across multiple use cases.",
        "Workflows: documentation generation, user story generation with push to Jira via MCP, implementing user stories as code features using Jira and Git MCP, and test case generation for Git repositories via Git MCP.",
      ],
      pipeline: ["Use case", "Droid Exec agent", "Jira + Git (MCP)", "Docs · stories · code · tests"],
      stack: ["Droid Exec", "MCP", "Jira", "Git"],
    },
  ],

  // The résumé lists no certifications, so the section is hidden. Add entries to show it.
  certifications: [],

  // Appears in console answers only.
  education: [
    {
      degree: "B.E. in Computer Science and Technology (CGPA 8.93)",
      school: "SJB Institute of Technology",
      year: "2020 – 2024",
    },
  ],
};
