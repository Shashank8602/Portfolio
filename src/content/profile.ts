import type { Profile } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  YOUR PORTFOLIO CONTENT LIVES HERE.
 *  Everything below is realistic PLACEHOLDER data (marked TODO) so the design
 *  can be previewed. Replace it with your own details — every section and the
 *  "Ask my AI" console update automatically.
 *  Optional lists (certifications, education) hide their section when empty.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const profile: Profile = {
  name: "Alex Morgan", // TODO
  firstName: "Alex", // TODO
  role: "GenAI Engineer", // TODO
  company: "Nimbus AI Labs", // TODO
  companyUrl: "https://example.com", // TODO (optional)
  location: "Bengaluru, India", // TODO
  yearsOfExperience: 4, // TODO
  openToWork: true, // shows the "Open to opportunities" badge
  availability: "Open to new opportunities — remote, hybrid or on-site.", // TODO

  tagline:
    "I design and ship production LLM systems — retrieval pipelines, AI agents and evaluation harnesses — that turn foundation models into products people can trust.", // TODO

  // Cycled by the "decoding" animation in the hero.
  rotatingRoles: [
    "GenAI Engineer",
    "LLM Application Developer",
    "RAG Systems Builder",
    "Agentic AI Engineer",
  ],

  // TODO: 2–3 short paragraphs.
  summary: [
    "I'm a GenAI engineer who loves the messy middle between a promising prototype and a reliable product. At Nimbus AI Labs I lead the design of retrieval-augmented and agentic systems that enterprise teams rely on every day.",
    "My toolkit spans LLM orchestration, vector search, fine-tuning and MLOps — but my favourite part is building the evals and guardrails that make AI dependable in the real world.",
  ],

  siteUrl: "https://your-portfolio.vercel.app", // TODO: your final URL (used for SEO)
  resume: "/resume.pdf", // TODO: replace public/resume.pdf with your CV

  contact: {
    email: "hello@example.com", // TODO
    phone: "+91 90000 00000", // TODO (never rendered as plain text in HTML)
    linkedin: "https://www.linkedin.com/in/your-handle", // TODO
    github: "https://github.com/your-handle", // TODO
  },

  // TODO: 4 headline numbers.
  metrics: [
    { value: 4, suffix: "+", label: "Years shipping ML & GenAI" },
    { value: 12, label: "LLM apps in production" },
    { value: 50, suffix: "K+", label: "Monthly AI-assisted users" },
    { value: 38, suffix: "%", label: "Avg. inference cost cut" },
  ],

  exploring: [
    "Agentic workflows",
    "Model Context Protocol",
    "LLM evals & observability",
    "Small language models",
    "Multimodal RAG",
    "Structured outputs",
  ],

  // TODO: your skills. Brand logos appear automatically for known tools
  // (see src/lib/tech-icons.ts); unknown ones render as clean text chips.
  skills: [
    {
      title: "GenAI & LLMs",
      icon: "sparkles",
      featured: true,
      blurb: "Designing, prompting, adapting and evaluating foundation models.",
      items: [
        "OpenAI GPT",
        "Claude",
        "Gemini",
        "Llama",
        "Mistral",
        "Prompt engineering",
        "Fine-tuning (LoRA / QLoRA)",
        "RAG",
        "AI agents",
        "Function calling",
      ],
    },
    {
      title: "Languages",
      icon: "code",
      blurb: "Production code, data wrangling and glue.",
      items: ["Python", "TypeScript", "SQL", "JavaScript", "Bash"],
    },
    {
      title: "Frameworks",
      icon: "workflow",
      blurb: "Orchestration and serving.",
      items: ["LangChain", "LangGraph", "LlamaIndex", "Hugging Face", "FastAPI", "Streamlit"],
    },
    {
      title: "ML & Deep Learning",
      icon: "brain",
      blurb: "Training and adapting models.",
      items: ["PyTorch", "TensorFlow", "scikit-learn", "Transformers", "Pandas", "NumPy"],
    },
    {
      title: "Data & Vector DBs",
      icon: "database",
      blurb: "Retrieval and storage at scale.",
      items: ["Qdrant", "Pinecone", "ChromaDB", "pgvector", "PostgreSQL", "Redis", "Elasticsearch"],
    },
    {
      title: "Cloud & MLOps",
      icon: "cloud",
      featured: true,
      blurb: "Taking models from notebook to reliable, observable production.",
      items: [
        "AWS",
        "Azure OpenAI",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "MLflow",
        "GitHub Actions",
        "Terraform",
      ],
    },
    {
      title: "Quality & Safety",
      icon: "shield",
      blurb: "Making AI dependable.",
      items: ["LLM evals", "RAGAS", "LangSmith", "Guardrails", "Red-teaming"],
    },
  ],

  // TODO: most recent first.
  experience: [
    {
      role: "GenAI Engineer",
      company: "Nimbus AI Labs",
      companyUrl: "https://example.com",
      location: "Bengaluru",
      start: "Jan 2024",
      end: "Present",
      current: true,
      highlights: [
        "Architected an enterprise RAG platform over 2M+ documents with hybrid search and re-ranking, lifting answer accuracy from 71% to 92%.",
        "Built multi-agent workflows with LangGraph and tool calling that automate support triage, saving ~1,200 analyst hours a month.",
        "Introduced an LLM evaluation and guardrails pipeline that cut hallucination-related escalations by 60%.",
      ],
      stack: ["Python", "LangGraph", "OpenAI GPT", "Claude", "Qdrant", "FastAPI", "AWS"],
    },
    {
      role: "Machine Learning Engineer",
      company: "Quantiva Analytics",
      location: "Pune",
      start: "Jul 2022",
      end: "Dec 2023",
      highlights: [
        "Fine-tuned transformer models for document classification and NER, reaching 94% F1 on production data.",
        "Shipped a semantic search service with sentence embeddings that replaced keyword search for 30K users.",
        "Automated training and deployment with MLflow, Docker and GitHub Actions — release time went from days to hours.",
      ],
      stack: ["PyTorch", "Hugging Face", "scikit-learn", "MLflow", "Docker", "Azure"],
    },
    {
      role: "Software Engineer — Data",
      company: "Brightline Systems",
      location: "Hyderabad",
      start: "Jun 2021",
      end: "Jun 2022",
      highlights: [
        "Built Python data pipelines and REST APIs processing 5M+ records a day.",
        "Developed analytics dashboards and forecasting models that informed quarterly planning.",
      ],
      stack: ["Python", "SQL", "Airflow", "PostgreSQL", "React"],
    },
  ],

  // TODO: 3–4 projects. `pipeline` drives the mini architecture diagram.
  projects: [
    {
      title: "DocuMind",
      tagline: "Enterprise RAG assistant — chat with 2M+ internal documents, with citations.",
      problem: "Teams lost hours digging through policies, contracts and wikis scattered across tools.",
      approach:
        "Hybrid retrieval (BM25 + dense vectors) with cross-encoder re-ranking, citation-grounded answers and a RAG eval suite running in CI.",
      outcome: "Became the default knowledge tool for 3,000+ employees.",
      metric: { value: "92%", label: "answer accuracy" },
      pipeline: ["Docs", "Chunk + Embed", "Qdrant", "Re-rank", "LLM", "Cited answer"],
      stack: ["LangChain", "Qdrant", "OpenAI GPT", "FastAPI", "React"],
      links: { github: "https://github.com/your-handle/documind", demo: "https://example.com" },
    },
    {
      title: "AgentOps",
      tagline: "Multi-agent support triage with human-in-the-loop approvals.",
      problem: "Support queues were overwhelmed by repetitive tickets that needed lookups across four systems.",
      approach:
        "A LangGraph supervisor agent routes tickets to specialist agents with tool calling, approval checkpoints and full tracing.",
      outcome: "Resolves 45% of tickets end-to-end and drafts replies for the rest.",
      metric: { value: "1.2K hrs", label: "saved per month" },
      pipeline: ["Ticket", "Router agent", "Tools / APIs", "Reviewer", "Reply"],
      stack: ["LangGraph", "Claude", "Python", "Redis", "Docker"],
      links: { github: "https://github.com/your-handle/agentops" },
    },
    {
      title: "LoRA-Lite",
      tagline: "Domain-specific LLM fine-tuning on a single GPU.",
      problem: "A general-purpose model kept missing industry terminology and required output formats.",
      approach:
        "QLoRA fine-tuning of an open-weights 8B model on 40K curated examples, gated by automated evals against a frozen benchmark.",
      outcome: "Matched a frontier model on the target task at a fraction of the cost.",
      metric: { value: "−70%", label: "inference cost" },
      pipeline: ["Raw data", "Curate", "QLoRA", "Eval", "Serve"],
      stack: ["PyTorch", "Hugging Face", "MLflow", "Docker"],
      links: { github: "https://github.com/your-handle/lora-lite" },
    },
    {
      title: "VisionQA",
      tagline: "Multimodal insights from photos and scanned PDFs.",
      problem: "Field teams captured thousands of photos and PDFs that nobody had time to review.",
      approach:
        "A vision-LLM pipeline extracts structured data from images and scans, validated against JSON schemas before storage.",
      outcome: "Turns unstructured uploads into searchable, structured reports in seconds.",
      metric: { value: "10×", label: "faster reporting" },
      pipeline: ["Images + PDFs", "Vision LLM", "Schema check", "Store", "Dashboard"],
      stack: ["Gemini", "Python", "PostgreSQL", "Streamlit"],
      links: { demo: "https://example.com" },
    },
  ],

  // TODO: leave as [] to hide the section.
  certifications: [
    { name: "AWS Certified Machine Learning – Specialty", issuer: "Amazon Web Services", year: "2024" },
    { name: "Azure AI Engineer Associate", issuer: "Microsoft", year: "2023" },
    { name: "Generative AI with Large Language Models", issuer: "DeepLearning.AI", year: "2023" },
  ],

  // TODO: used by the console only. Leave as [] if you prefer not to mention it.
  education: [{ degree: "B.Tech in Computer Science", school: "Your University", year: "2021" }],
};
