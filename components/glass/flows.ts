/**
 * Architecture flows drawn under each project, distilled from the
 * highlights in lib/data.ts. `kind` picks the schematic symbol; `hot`
 * marks the step that makes the system hard, and gets the redline note.
 */
export type Kind = "input" | "doc" | "agent" | "check" | "queue" | "db" | "store" | "screen" | "device" | "gateway" | "gauge" | "hub";
export type FlowStep = { label: string; note?: string; kind: Kind; hot?: boolean };

export const flows: Record<string, { steps: FlowStep[]; redline: string }> = {
  "idea-to-motion": {
    redline: "AI-written code never ships unchecked",
    steps: [
      { label: "Prompt", note: "idea or upload", kind: "input" },
      { label: "Story plan", note: "script + fact check", kind: "agent" },
      { label: "Scene codegen", note: "React / Remotion", kind: "agent" },
      { label: "Compile check", note: "3-frame smoke render", kind: "check", hot: true },
      { label: "Render queue", note: "BullMQ, checkpointed", kind: "queue" },
      { label: "Video", note: "R2 + live progress", kind: "store" },
    ],
  },
  "dicom-viewer": {
    redline: "the agent drives the viewer itself",
    steps: [
      { label: "Scanner", note: "C-STORE", kind: "device" },
      { label: "Edge gateway", note: "offline-first", kind: "gateway" },
      { label: "Cloud PACS", note: "pure DICOMweb", kind: "db" },
      { label: "Viewer", note: "MPR + 3D volume", kind: "screen" },
      { label: "AI deep read", note: "view_slices, measure_hu", kind: "agent", hot: true },
      { label: "Report", note: "signed", kind: "doc" },
    ],
  },
  "redline-agent": {
    redline: "no citation, no redline",
    steps: [
      { label: "Contract", note: "+ playbook", kind: "doc" },
      { label: "Clause split", note: "SSE stream", kind: "queue" },
      { label: "Agent redline", note: "model-agnostic", kind: "agent" },
      { label: "Grounding", note: "every edit cites a rule", kind: "check", hot: true },
      { label: "Evals", note: "coverage, anchoring", kind: "gauge" },
      { label: ".docx", note: "native tracked changes", kind: "doc" },
    ],
  },
  agentos: {
    redline: "guardrails are first-class",
    steps: [
      { label: "Design", note: "agents + tools", kind: "doc" },
      { label: "Orchestrate", note: "context, RAG, memory", kind: "agent" },
      { label: "MCP + guards", note: "client & server", kind: "hub", hot: true },
      { label: "Evaluate", note: "simulated chats", kind: "gauge" },
      { label: "Monitor", note: "Langfuse traces", kind: "screen" },
    ],
  },
};

/** The 17-agent pipeline drawn as layers; counts sum to 17. */
export const dagLayers = [1, 3, 4, 4, 3, 2];

export const industries = ["Finance", "Legal", "Media", "Real estate", "E-com", "Travel"];

/**
 * Every skill from lib/data.ts, regrouped as the layers of an agent system,
 * top to bottom. Wording is kept exactly as in data so nothing indexed changes.
 */
export const stackLayers = [
  { name: "Models", items: ["Claude · Gemini · OpenAI", "Multimodal / Vision"] },
  { name: "Orchestration", items: ["AI Agents & Multi-Agent Orchestration", "MCP (Model Context Protocol)", "Prompt & Context Engineering", "Function / Tool Calling", "Vercel AI SDK", "Streaming"] },
  { name: "Knowledge", items: ["RAG Pipelines", "Embeddings & Vector Search (pgvector)"] },
  { name: "Quality", items: ["Agent Evaluation & Guardrails", "LLM Observability (Langfuse)", "Property-Based Testing"] },
  { name: "Application", items: ["TypeScript", "JavaScript", "Python", "Next.js", "React", "Node.js", "Express", "NestJS", "Angular"] },
  { name: "Architecture", items: ["Clean / Hexagonal Architecture", "Domain-Driven Design", "SOLID", "Design Patterns", "CI/CD"] },
  { name: "Data & infra", items: ["PostgreSQL + pgvector", "MongoDB", "Redis · BullMQ", "Prisma", "GraphQL", "AWS Lambda · API Gateway · DynamoDB", "Cloudflare R2", "Docker", "Turborepo", "Serverless"] },
];
