export const site = {
  name: "Jeet Soni",
  role: "AI Engineer",
  tagline: "LLM Applications, Agentic Systems & RAG",
  headline: "I build AI agents that survive production.",
  location: "Ahmedabad, India",
  email: "adesharajeet@gmail.com",
  phone: "+91 82008 32464",
  socials: {
    github: "https://github.com/jeetsoni",
    linkedin: "https://www.linkedin.com/in/jeet-soni/",
    instagram: "https://www.instagram.com/jeetsoni.ai/",
    synapbyte: "https://www.instagram.com/synap_byte/",
    youtube: "https://www.youtube.com/channel/UCm7x2MjOJjRDDRsouptwh-g",
  },
};

export const stats = [
  { value: 5, suffix: "+", label: "Years of engineering" },
  { value: 10, suffix: "+", label: "Production AI agents shipped" },
  { value: 17, suffix: "", label: "LLM agents in one pipeline" },
  { value: 892, suffix: "/1000", label: "Claude Certified Architect" },
];

export const marqueeItems = [
  "AI Agents",
  "RAG Pipelines",
  "MCP",
  "Next.js",
  "Multi-Agent Orchestration",
  "TypeScript",
  "Vector Search",
  "Guardrails",
  "Generative UI",
  "Clean Architecture",
  "LLM Observability",
  "Python",
];

export const about = {
  intro:
    "AI Engineer with 5+ years across full-stack and applied-AI development, now leading both the build of an enterprise LLM agent platform and its delivery to clients who bet real workflows on it.",
  body: [
    "As founding engineer of AgentOS at AvestaLabs, I shaped an agent orchestration platform from whiteboard to production: context engineering, RAG pipelines, vector-backed agent memory, MCP client and server, custom tools, guardrails.",
    "I sit on both sides of the table: architecting the platform, then embedding with enterprise clients to map their workflows and ship agents that hold up when real users arrive. Ten-plus production GenAI agents across finance, legal, media, real estate, e-commerce and travel.",
    "Everything runs on a full-stack spine of Next.js, Node.js, TypeScript and Python, with an architect's bias for ports & adapters, DDD, and systems that can swap their LLM without rewriting their soul.",
  ],
};

export type Job = {
  period: string;
  role: string;
  company: string;
  place: string;
  points: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    period: "Dec 2024 → Present",
    role: "AI Product Engineer & Team Lead",
    company: "AvestaLabs",
    place: "Avesta HQ's AI division",
    points: [
      "Founding engineer of AgentOS, an enterprise suite to design, deploy, evaluate and monitor AI agents; lead the core engineering team.",
      "Architected Efficia, the agent orchestration product: context engineering, RAG, vector-backed agent memory, MCP client/server, custom tools framework, guardrails.",
      "Embedded technical lead on enterprise engagements, with 10+ production agents live across finance, legal, media, real estate, e-commerce and travel.",
      "Shipped OnlyFacts: climate questions answered as real-time generative UI. India Avenue: a customer-facing fund-data agent. Legal automation: lawyer-ready contracts drafted in 3–5 minutes.",
    ],
    tags: ["AgentOS", "Efficia", "MCP", "RAG", "Guardrails", "Team Lead"],
  },
  {
    period: "May 2023 → Dec 2024",
    role: "Software Engineer",
    company: "Avesta HQ",
    place: "Ahmedabad, India",
    points: [
      "Spearheaded the complete rebranding and feature expansion of view.com.au, a major Australian real-estate portal, on Next.js, Node.js and PostgreSQL.",
      "Led end-to-end delivery of product features, working directly with PMs and clients on requirements.",
      "Designed implementation architecture and mentored the team on Next.js best practices and design patterns.",
    ],
    tags: ["Next.js", "Node.js", "PostgreSQL", "Architecture"],
  },
  {
    period: "Jan 2021 → May 2023",
    role: "MERN Stack Developer",
    company: "Space-O Technologies",
    place: "Ahmedabad, India",
    points: [
      "Built and maintained MERN applications: analytical dashboards, CRM web apps, delivery platforms.",
      "Integrated secure payment gateways (Stripe, TYRO) across multiple web applications.",
      "Star Performer of the Month.",
    ],
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    period: "Dec 2019 → Sep 2020",
    role: "MEAN / Web Developer",
    company: "9Brainz · TRUESYS",
    place: "Early career",
    points: [
      "Engineered MEAN-stack web APIs and real-time Angular applications; AWS API Gateway, Lambda, DynamoDB for cloud-native projects, growing from intern to live-project delivery.",
    ],
    tags: ["Angular", "AWS", "Node.js"],
  },
];

export type Project = {
  index: string;
  title: string;
  kicker: string;
  status: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: string;
  linkLabel?: string;
  image?: string;
  imageAlt?: string;
  imageUrlBar?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "KalpanaAI",
    kicker: "AI Video Generation Platform · Founder",
    status: "LIVE",
    description:
      "Type a topic, get a fully narrated, animated, rendered MP4. ~17 specialized LLM agents orchestrated through one automated pipeline: scripting, voiceover, scene direction, code generation, metadata.",
    highlights: [
      "16-stage fault-tolerant pipeline on BullMQ/Redis with per-stage retries and SSE progress a reconnecting browser never loses",
      "An agentic loop where an LLM writes React/Remotion animation code that is compile-validated, runtime-checked, auto-repaired and then rendered with word-timestamped voiceover",
      "Provider abstraction that hot-swaps LLM, TTS and transcription by config; self-hosted GPU TTS sidecar kills the dominant per-video cost",
      "Dogfooded daily: every SynapByte video is generated end-to-end by the platform",
    ],
    stack: ["TypeScript", "Next.js 15", "Express 5", "BullMQ", "Remotion", "Cloudflare R2", "Langfuse"],
    link: "https://video-ai-web-production.up.railway.app",
    linkLabel: "video-ai-web-production.up.railway.app",
    image: "/projects/kalpana.jpg",
    imageAlt: "KalpanaAI studio: turn any idea into a finished video",
    imageUrlBar: "kalpana.ai/studio",
  },
  {
    index: "02",
    title: "Redline Agent",
    kicker: "Rulebook-Driven Contract Review · Open Source",
    status: "LIVE",
    description:
      "Upload a contract and a negotiation playbook — an AI agent redlines it clause by clause and exports native Word tracked changes, with grounding evals that prove every edit cites a real rule.",
    highlights: [
      "Real OOXML revisions (w:ins/w:del): the exported .docx opens in Word with working Accept/Reject",
      "“No citation, no redline” — deterministic grounding checks plus run-level evals for citation coverage and anchoring",
      "Clause-by-clause SSE streaming with reconnect replay; gap analysis drafts ready-to-insert missing provisions",
      "Deliberately MERN: MongoDB Atlas, Express, React 19, Node — model-agnostic via Vercel AI SDK + AI Gateway",
    ],
    stack: ["MongoDB Atlas", "Express", "React 19", "TypeScript", "Vercel AI SDK", "Docker"],
    link: "https://redline-agent-production.up.railway.app/?sample=1",
    linkLabel: "redline-agent-production.up.railway.app",
    image: "/projects/redline.png",
    imageAlt: "Redline Agent review board: clause list with risk badges and a tracked-changes diff citing playbook rules",
    imageUrlBar: "redline-agent · review board",
  },
  {
    index: "03",
    title: "DICOM Viewer",
    kicker: "AI-Assisted Radiology Platform",
    status: "LIVE",
    description:
      "A mobile-first web DICOM viewer for radiologists (CT, MR, X-ray, ultrasound) with an agentic AI reader that autonomously drives the viewer itself.",
    highlights: [
      "Slice scrolling, windowing, zoom/pan, measurements, multi-viewport layouts and 3D/MPR volume reconstruction on Cornerstone3D/WebGL",
      "An LLM drives the viewer through a tool-use loop: selecting series, scrolling, re-windowing, measuring Hounsfield density, then drafting a structured report",
      "AI-assisted reporting: shorthand-to-report expansion, multimodal slice second-look, voice dictation, patient-friendly summaries, all behind provider-agnostic ports",
    ],
    stack: ["Next.js 16", "React 19", "Cornerstone3D", "Vercel AI SDK", "Zustand", "WebGL"],
    link: "https://dicom-viewer-production-b98b.up.railway.app",
    linkLabel: "dicom-viewer-production-b98b.up.railway.app",
    image: "/projects/dicom.jpg",
    imageAlt: "DICOM viewer 3D workspace: MPR slices and volume-rendered skull of a head CT with signed report",
    imageUrlBar: "dicom-viewer/viewer/ncct-head · 3D MPR",
  },
  {
    index: "04",
    title: "AgentOS · Efficia",
    kicker: "Enterprise Agent Platform · AvestaLabs",
    status: "IN PRODUCTION",
    description:
      "The factory that builds the agents. An enterprise suite to design, deploy, evaluate and monitor AI agents, architected from concept to production as founding engineer.",
    highlights: [
      "Agent orchestration with context engineering, RAG pipelines and vector-DB-backed agent memory",
      "MCP client & server, a custom tools framework, and guardrails as first-class citizens",
      "Eval-first architecture: simulate messy conversations, evaluate every edge case, auto-correct and loop",
      "Companion products for LLM observability, RAG data-ingestion and evaluation",
    ],
    stack: ["TypeScript", "Node.js", "pgvector", "MCP", "Langfuse", "Evals"],
    image: "/projects/agentos.jpg",
    imageAlt: "Avesta AgentOS: AI co-worker teams running sales, finance and support workflows in parallel",
    imageUrlBar: "avestalabs.ai · AgentOS co-workers",
  },
  {
    index: "05",
    title: "view.com.au",
    kicker: "Australian Real-Estate Portal",
    status: "SHIPPED",
    description:
      "Complete rebranding and feature expansion of one of Australia's major property portals, led end-to-end on Next.js, Node.js and PostgreSQL.",
    highlights: [
      "Led feature delivery working directly with PMs and clients",
      "Designed the implementation architecture and mentored the team on Next.js patterns",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL"],
    link: "https://view.com.au",
    linkLabel: "view.com.au",
    image: "/projects/view.jpg",
    imageAlt: "view.com.au homepage: property search Australia-wide",
    imageUrlBar: "view.com.au",
  },
];

// most-watched @jeetsoni.ai reels (face-to-camera, Hindi), snapshotted by view count
export const instagramReels = [
  { code: "DW7zffpzu1v", views: "5.2K" },
  { code: "DXCvCAak-ZH", views: "4.1K" },
  { code: "DWv-RxSgjmL", views: "2.9K" },
  { code: "DXGZO7_AkUL", views: "2.8K" },
  { code: "DXZ5p5wk8b3", views: "2.4K" },
  { code: "DXBnhI-j_-t", views: "2.4K" },
];

export const educator = {
  heading: "I also teach machines' favorite subject: how they work.",
  body: "SynapByte is my animated engineering channel: one concept, one animation, one minute. Every single video is generated end-to-end by KalpanaAI, the platform I built. The content is the demo.",
  channels: [
    {
      name: "@synap_byte",
      platform: "Instagram",
      stat: "1,400+",
      statLabel: "followers",
      desc: "AI & software engineering, animated. LLMs · system design · dev internals.",
      href: "https://www.instagram.com/synap_byte/",
    },
    {
      name: "SynapByte",
      platform: "YouTube",
      stat: "73+",
      statLabel: "videos",
      desc: "Nginx internals, UUID vs integer keys, CI/CD from scratch. Where every concept clicks.",
      href: "https://www.youtube.com/channel/UCm7x2MjOJjRDDRsouptwh-g",
    },
    {
      name: "@jeetsoni.ai",
      platform: "Instagram",
      stat: "4,800+",
      statLabel: "followers",
      desc: "JS → production AI systems. RAG · agents · tools · UI. Real-world AI, not demos.",
      href: "https://www.instagram.com/jeetsoni.ai/",
    },
  ],
  extras: [
    {
      text: "Publication: “LLM-Based Chunking: Intelligent Text Splitting for Better RAG”, Avesta Labs Blog",
      href: "https://avestalabs.ai/blog/llm-based-chunking-intelligent-text-splitting-for-better-rag",
    },
    {
      text: "Contributing author: Aspire AI Academy Gen-AI Engineering Course",
      href: "https://avestalabs.ai/aspire-ai-academy/gen-ai-engineering",
    },
    {
      text: "1st place: AI-Driven Development Hackathon, Avesta HQ",
      href: "https://www.linkedin.com/posts/jeet-soni_hackathon-leadership-generativeai-activity-7347534053161496576-S3V2",
    },
  ],
};

export const skills = [
  {
    group: "AI / LLM",
    items: [
      "AI Agents & Multi-Agent Orchestration",
      "RAG Pipelines",
      "MCP (Model Context Protocol)",
      "Prompt & Context Engineering",
      "Function / Tool Calling",
      "Embeddings & Vector Search (pgvector)",
      "Agent Evaluation & Guardrails",
      "LLM Observability (Langfuse)",
      "Claude · Gemini · OpenAI",
      "Vercel AI SDK",
      "Multimodal / Vision",
      "Streaming",
    ],
  },
  {
    group: "Languages & Frameworks",
    items: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Next.js",
      "React",
      "Node.js",
      "Express",
      "NestJS",
      "Angular",
    ],
  },
  {
    group: "Architecture",
    items: [
      "Clean / Hexagonal Architecture",
      "Domain-Driven Design",
      "SOLID",
      "Design Patterns",
      "Property-Based Testing",
      "CI/CD",
    ],
  },
  {
    group: "Data · Cloud · DevOps",
    items: [
      "PostgreSQL + pgvector",
      "MongoDB",
      "Redis · BullMQ",
      "Prisma",
      "GraphQL",
      "AWS Lambda · API Gateway · DynamoDB",
      "Cloudflare R2",
      "Docker",
      "Turborepo",
      "Serverless",
    ],
  },
];

export const certification = {
  title: "Claude Certified Architect (Foundations)",
  org: "Anthropic · 2026",
  score: "892 / 1000",
  href: "https://www.credly.com/badges/bf168301-6e23-4b09-8884-d6f4d9a301d4",
};
