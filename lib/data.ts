export const site = {
  name: "Jeet Soni",
  /** The byline on Avesta Labs posts. Same person, so the JSON-LD says so. */
  alternateName: "Jeet Adeshara",
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
    vlogs: "https://www.youtube.com/@jeetsoni_vlogs",
    avestaBlog: "https://avestalabs.ai/blog/author/jeet-adeshara",
  },
};

/**
 * Posts themselves come from lib/writing-feed.json (snapshotted from the
 * Avesta Labs RSS on every build). `notes` is optional first-person context
 * per post, keyed by slug: a line here is original text on this site, which
 * the feed's description is not.
 */
export const writing = {
  heading: "Field notes from production agents.",
  body: "I write about what breaks when AI agents meet real users: tracing, guardrails, evaluation, RAG. The posts are published on the Avesta Labs engineering blog, where I'm a founding engineer on AgentOS.",
  publisher: { name: "Avesta Labs", url: "https://avestalabs.ai/blog" },
  notes: {} as Record<string, string>,
};

export const stats = [
  { value: 5, suffix: "+", label: "Years of engineering" },
  { value: 10, suffix: "+", label: "Production AI agents shipped" },
  { value: 17, suffix: "", label: "LLM agents in one pipeline" },
  { value: 6, suffix: "", label: "Industries served in production" },
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
      "Shipped OnlyFacts: climate questions answered as real-time generative UI. India Avenue: a customer-facing fund-data agent. Legal automation: lawyer-ready contracts drafted in 3-5 minutes.",
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
  /** stable id used by the palette agent's show_project tool */
  slug: string;
  title: string;
  kicker: string;
  status: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: string;
  linkLabel?: string;
  caseStudyHref?: string;
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "idea-to-motion",
    title: "Idea to Motion",
    kicker: "AI Video Production System · Founder",
    status: "LIVE",
    description:
      "A prompt-to-video product where AI plans the story, generates executable motion graphics, and hands a reviewed composition to a durable rendering workflow.",
    highlights: [
      "Clean Architecture across domain, application, infrastructure and presentation layers, with PipelineJob owning legal state transitions and artifact rules",
      "BullMQ workers execute persisted stages with explicit retry policies; PostgreSQL checkpoints scripts, fact checks, audio, directions, code and rendered assets",
      "AI-generated React/Remotion scenes are compile-checked, inspected for runtime hazards and repaired before composition; MCP client scene submissions also pass bounded three-frame smoke renders",
      "Redis pub/sub streams live progress while buffered scene events support replay after a client reconnects",
    ],
    stack: ["TypeScript", "Next.js 15", "Express 5", "BullMQ", "Remotion", "PostgreSQL", "Cloudflare R2"],
    caseStudyHref: "/work/idea-to-motion/",
    link: "https://ideatomotion.com",
    linkLabel: "Open live product",
    image: "/projects/idea-to-motion.jpg",
    imageAlt: "Idea to Motion landing page: an MCP video engine that lets any AI produce finished videos",
  },
  {
    index: "02",
    slug: "dicom-viewer",
    title: "DICOM Viewer + PACS",
    kicker: "Scanner-to-Report Radiology Platform",
    status: "LIVE",
    description:
      "A complete imaging chain built solo: scanners push to an offline-first edge gateway, studies land in a multi-tenant cloud PACS, and an AI agent reads scans by driving the viewer itself.",
    highlights: [
      "Pure-DICOMweb archive discipline (STOW-RS, QIDO-RS, WADO-RS): Orthanc swappable for AWS, Google or Azure health imaging by config; the archive is never exposed to the browser",
      "Edge gateway for clinics: scanners C-STORE to a LAN node; a standard-library-only Python forwarder pushes stable studies to the cloud and retries forever through outages",
      "Agentic deep read with the viewer as the AI's hands: view_slices and measure_hu execute in-browser on an off-screen viewport; models scored against a pydicom ground-truth harness",
      "MPR crosshairs, 3D volume rendering and quad layouts that survive older iPhones: live WebGL2 probing sizes each volume to the device's real GPU ceiling",
    ],
    stack: ["Next.js 16", "React 19", "Cornerstone3D", "PostgreSQL", "Orthanc", "Vercel AI SDK"],
    caseStudyHref: "/work/dicom-viewer/",
    link: "https://dicom-viewer-production-b98b.up.railway.app",
    linkLabel: "Open live demo",
    image: "/projects/dicom.jpg",
    imageAlt: "DICOM viewer 3D workspace: MPR slices and volume-rendered skull of a head CT with signed report",
  },
  {
    index: "03",
    slug: "redline-agent",
    title: "Redline Agent",
    kicker: "Rulebook-Driven Contract Review · Open Source",
    status: "LIVE",
    description:
      "Upload a contract and a negotiation playbook: an AI agent redlines it clause by clause and exports native Word tracked changes, with grounding evals that prove every edit cites a real rule.",
    highlights: [
      "Real OOXML revisions (w:ins/w:del): the exported .docx opens in Word with working Accept/Reject",
      "“No citation, no redline”: deterministic grounding checks plus run-level evals for citation coverage and anchoring",
      "Clause-by-clause SSE streaming with reconnect replay; gap analysis drafts ready-to-insert missing provisions",
      "Deliberately MERN: MongoDB Atlas, Express, React 19, Node; model-agnostic via Vercel AI SDK + AI Gateway",
    ],
    stack: ["MongoDB Atlas", "Express", "React 19", "TypeScript", "Vercel AI SDK", "Docker"],
    link: "https://redline-agent-production.up.railway.app/?sample=1",
    linkLabel: "Open live demo",
    image: "/projects/redline.png",
    imageAlt: "Redline Agent review board: clause list with risk badges and a tracked-changes diff citing playbook rules",
  },
  {
    index: "04",
    slug: "agentos",
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
  },
  {
    index: "05",
    slug: "view-com-au",
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
  },
];

// @jeetsoni.ai reels shown under Teaching, picked by view count on 2026-11-05:
// first the AI-avatar era (the 20K breakout, then the two newest), then the three
// most-watched reels where Jeet explains on camera. Interview-series clips (sitting
// at a desk, no talking) and the 2024 TrickyJS graphics are left out on purpose.
// `views` is a snapshot for reference, not rendered.
export const instagramReels = [
  { code: "DfFS2V9jKxF", views: "20.1K" }, // free alternative to Flow/Veo (avatar)
  { code: "DfWVUugAMdF", views: "813" }, // Upscayl: free photo upscaling (avatar, newest)
  { code: "DfTrOh8Hxct", views: "2.1K" }, // VoiceStudio vs ElevenLabs (avatar)
  { code: "DWrRlnPAl6I", views: "7.7K" }, // BM25 vs embeddings (on camera)
  { code: "DV5mMvWgoYz", views: "6.7K" }, // retrieval was fine, the LLM still hallucinated (on camera)
  { code: "DW7zffpzu1v", views: "5.2K" }, // HyDE retrieval (on camera)
];

export const educator = {
  heading: "I also teach machines' favorite subject: how they work.",
  body: "SynapByte is my animated engineering channel: one concept, one animation, one minute. Every single video is generated end-to-end by Idea to Motion, the platform I built. The content is the demo.",
  channels: [
    {
      name: "@synap_byte",
      platform: "Instagram",
      stat: "1,500+",
      statLabel: "followers",
      desc: "AI & software engineering, animated. LLMs · system design · dev internals.",
      href: "https://www.instagram.com/synap_byte/",
    },
    {
      name: "SynapByte",
      platform: "YouTube",
      stat: "210+",
      statLabel: "videos",
      desc: "Nginx internals, UUID vs integer keys, CI/CD from scratch. Where every concept clicks.",
      href: "https://www.youtube.com/channel/UCm7x2MjOJjRDDRsouptwh-g",
    },
    {
      name: "@jeetsoni.ai",
      platform: "Instagram",
      stat: "5,000+",
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
