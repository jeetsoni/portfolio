/**
 * The eight stages of the hero pipeline. Every "proof" line points at work
 * already described in lib/data.ts; nothing here is new claims.
 */
export type Stage = {
  id: string;
  label: string;
  /** what the stage is drawn as, printed on its callout */
  part: string;
  title: string;
  body: string;
  proof: string;
  log: string;
};

export const stages: Stage[] = [
  {
    id: "request",
    part: "Input port",
    label: "request",
    title: "A real user, a messy question.",
    body: "Production starts where the demo ends: vague asks, half the context missing, and someone waiting on the answer.",
    proof: "10+ agents live across finance, legal, media, real estate, e-commerce and travel.",
    log: "POST /agent · \"summarise Q3 fund risk\"",
  },
  {
    id: "context",
    part: "Context window",
    label: "context",
    title: "Context is designed, not dumped.",
    body: "What the model sees is built on purpose: history trimmed, memory recalled, instructions scoped to the task.",
    proof: "Context engineering and vector-backed agent memory in Efficia, the AgentOS orchestrator.",
    log: "context.build · 14 msgs → 3.1k tokens",
  },
  {
    id: "retrieve",
    part: "Vector store",
    label: "retrieve",
    title: "Retrieval you can cite.",
    body: "Search the embedding space, rerank, keep only what the answer can stand on.",
    proof: "RAG pipelines on pgvector, and a published piece on LLM-based chunking.",
    log: "pgvector.search k=24 → rerank → 6",
  },
  {
    id: "plan",
    part: "Planner",
    label: "plan",
    title: "Plan before acting.",
    body: "Break the task down and decide which agents and tools run, in what order, with what budget.",
    proof: "Multi-agent orchestration, up to 17 LLM agents in a single pipeline.",
    log: "planner · 2 tool calls scheduled",
  },
  {
    id: "tools",
    part: "MCP hub",
    label: "mcp tools",
    title: "Tools that touch the real world.",
    body: "MCP servers and custom tools let the agent read live data and act, not just talk.",
    proof: "MCP client and server in AgentOS. The DICOM viewer's agent reads scans by driving the viewer itself.",
    log: "mcp.call fund_data.get_nav · 200",
  },
  {
    id: "guard",
    part: "Guardrail gate",
    label: "guardrails",
    title: "No citation, no output.",
    body: "Every answer passes checks for grounding, PII and policy before a user ever sees it.",
    proof: "Redline Agent refuses any edit that doesn't cite a real rule in the playbook.",
    log: "guard.pii ✓ grounding ✓ cites 6/6",
  },
  {
    id: "evals",
    part: "Eval gauge",
    label: "evals",
    title: "Measured, every release.",
    body: "Simulated conversations, scored runs and regression sets decide whether a change ships.",
    proof: "Eval-first architecture in AgentOS; DICOM models scored against a ground-truth harness.",
    log: "eval.faithfulness 0.94 → langfuse",
  },
  {
    id: "response",
    part: "Response stream",
    label: "response",
    title: "Streamed, and it survives a dropped connection.",
    body: "Tokens stream as they're ready; if the client drops, it reconnects and replays what it missed.",
    proof: "SSE with reconnect replay in Redline; Redis pub/sub progress in Idea to Motion.",
    log: "stream → client · first token 410ms",
  },
];
