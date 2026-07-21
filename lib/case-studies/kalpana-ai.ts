export const kalpanaCaseStudy = {
  title: "KalpanaAI",
  eyebrow: "Founder case study · AI video systems",
  summary:
    "A prompt-to-video product where AI plans the story, generates executable motion graphics, and hands a reviewed composition to a durable rendering workflow.",
  thesis:
    "The hard part was not generating a script. It was designing a system that could coordinate probabilistic models, executable code, long-running media jobs, and human review without turning one failure into a lost project.",
  role: "Founder · Product, architecture, full-stack engineering",
  period: "Repository evolution · Apr-Jul 2026",
  githubUrl: "https://github.com/jeetsoni",
  liveUrl: "https://video-ai-web-production.up.railway.app",
  proof: [
    {
      value: "300+",
      label: "repository commits",
      note: "Current branch history",
    },
    {
      value: "04",
      label: "architecture layers",
      note: "Dependencies point inward",
    },
    {
      value: "10m",
      label: "worker lock",
      note: "For long media stages",
    },
    {
      value: "03",
      label: "smoke-test frames",
      note: "MCP scene submissions",
    },
  ],
  problem: {
    before: [
      "Research and structure a coherent script",
      "Generate voice and recover word-level timing",
      "Translate narration into scene-by-scene visual direction",
      "Build motion graphics and keep them synchronized",
      "Preview, revise, render, and package the final video",
    ],
    challenge:
      "Each step has different latency, failure modes, providers, and artifacts. A single synchronous AI request would be easy to demo and difficult to trust.",
    productMove:
      "Turn the workflow into a reviewable production system: persist every meaningful artifact, pause where human judgment matters, and make each expensive stage observable and recoverable.",
  },
  pipeline: [
    { index: "01", name: "Prompt", detail: "Topic, format, voice, brand", kind: "input" },
    { index: "02", name: "Script", detail: "Structured scenes, streamed", kind: "agent" },
    { index: "03", name: "Fact check", detail: "Claim-level verification", kind: "gate" },
    { index: "04", name: "Review", detail: "Human edit and approval", kind: "human" },
    { index: "05", name: "Voice", detail: "Audio and word timing", kind: "service" },
    { index: "06", name: "Direction", detail: "Scene beats and assets", kind: "agent" },
    { index: "07", name: "Code", detail: "Remotion scene components", kind: "agent" },
    { index: "08", name: "Validate", detail: "Compile + static gates; MCP adds smoke render", kind: "gate" },
    { index: "09", name: "Preview", detail: "Tweak before spending", kind: "human" },
    { index: "10", name: "Render", detail: "MP4, thumbnail, metadata", kind: "output" },
  ],
  architecture: [
    {
      index: "01",
      name: "Presentation",
      remit: "HTTP, SSE, UI, controllers",
      detail:
        "Next.js feature modules and Express controllers translate product actions into use-case requests. Composition stays outside the domain.",
      evidence: "presentation/controllers · routes · factories",
    },
    {
      index: "02",
      name: "Application",
      remit: "Use cases and orchestration",
      detail:
        "Use cases coordinate repositories, queues, model ports, storage, and streaming while returning explicit Result values instead of using exceptions for control flow.",
      evidence: "application/use-cases · interfaces · services",
    },
    {
      index: "03",
      name: "Domain",
      remit: "Rules, state, invariants",
      detail:
        "PipelineJob owns legal stage transitions, artifact guards, progress state, and failure state. Infrastructure cannot redefine the workflow's business rules.",
      evidence: "PipelineJob.transitionTo() · markFailed()",
    },
    {
      index: "04",
      name: "Infrastructure",
      remit: "Providers and persistence",
      detail:
        "Prisma, BullMQ, Redis, model providers, TTS, object storage, Remotion, and FFmpeg sit behind interfaces and are wired at explicit composition roots.",
      evidence: "repositories · workers · service adapters",
    },
  ],
  reliability: [
    {
      index: "R1",
      title: "Checkpoint the work, not just the status",
      body:
        "PostgreSQL stores the current stage plus scripts, fact-check reports, audio, transcripts, directions, generated code, edit state, and rendered asset paths. A job can be understood from durable state rather than process memory.",
      tag: "PostgreSQL · Prisma",
    },
    {
      index: "R2",
      title: "Retry according to stage semantics",
      body:
        "BullMQ applies explicit exponential backoff by stage. Model-heavy steps receive multiple attempts; deterministic mapping and rendering are not blindly retried. Failed jobs can be cleared and resumed from their current stage.",
      tag: "BullMQ · Redis",
    },
    {
      index: "R3",
      title: "Replay progress after a disconnect",
      body:
        "Workers publish live SSE progress through Redis pub/sub. Scene-generation events are also appended to a Redis list and marked complete with a TTL, allowing reconnecting clients to replay buffered progress.",
      tag: "SSE · Redis buffer",
    },
    {
      index: "R4",
      title: "Do not leave the interface spinning forever",
      body:
        "A worker-level failure listener checks non-terminal pipeline state, persists a failure, and emits a final progress event. Long media stages use a ten-minute lock with stalled-job checks.",
      tag: "Failure safety net",
    },
    {
      index: "R5",
      title: "Treat generated code as untrusted input",
      body:
        "Generated JSX is compiled with esbuild, checked for known Remotion and runtime hazards, and rejected with targeted repair hints before it reaches a final render.",
      tag: "esbuild · static gates",
    },
    {
      index: "R6",
      title: "Bound runtime validation",
      body:
        "MCP client scene submissions are transformed and rendered at the first, middle, and final frame in a separate worker thread. A five-second timeout terminates runaway computation without blocking the API event loop.",
      tag: "Worker threads · 5s ceiling",
    },
  ],
  validationLoop: [
    { label: "Generate", detail: "One component per scene" },
    { label: "Compile", detail: "esbuild parses JSX" },
    { label: "Inspect", detail: "Domain-specific static rules" },
    { label: "Smoke render", detail: "MCP submissions · 3 frames" },
    { label: "Repair", detail: "Specific errors return to the model" },
    { label: "Compose", detail: "Scenes become one timeline" },
  ],
  decisions: [
    {
      number: "D-01",
      title: "A state machine over a giant request",
      context:
        "Video generation crosses slow model calls, speech services, asset storage, code execution, and headless rendering.",
      decision:
        "Model the product as durable stages owned by a domain entity and execute processing stages through a queue.",
      tradeoff:
        "More operational machinery and transition rules, in exchange for resumability, visibility, and isolated failure.",
    },
    {
      number: "D-02",
      title: "Human review before expensive production",
      context:
        "A fluent script can still be wrong, off-brand, or simply not what the creator wants. Downstream audio and rendering amplify that mistake.",
      decision:
        "Fact-check generated claims, then pause for script approval; pause again at browser preview before export.",
      tradeoff:
        "The flow is not fully autonomous, but user judgment is applied where it prevents the most wasted work.",
    },
    {
      number: "D-03",
      title: "Provider routing per responsibility",
      context:
        "Script writing, fact checking, direction, code repair, transcription, and voice generation have different model needs and cost profiles.",
      decision:
        "Resolve models by named agent through a ModelRegistry and place TTS, transcription, storage, and image lookup behind ports.",
      tradeoff:
        "Configuration becomes a system of its own, but provider changes no longer require rewriting the workflow or domain.",
    },
    {
      number: "D-04",
      title: "Share contracts with client-driven AI",
      context:
        "An MCP client can provide its own reasoning model, but bypassing server constraints would create a second, lower-quality pipeline.",
      decision:
        "Let client-driven jobs submit scripts, directions, and scene code through the same schemas, validation rules, composition logic, and persisted state.",
      tradeoff:
        "The protocol is more involved, but the server retains product invariants while the client supplies the intelligence.",
    },
  ],
  evolution: [
    {
      date: "17 Apr",
      title: "Architecture before features",
      detail: "Turborepo foundation, infrastructure services, and a Clean Architecture scaffold.",
    },
    {
      date: "18-20 Apr",
      title: "From pipeline to recoverable pipeline",
      detail: "Core faceless flow, SSE progress, browser preview, job retry, code autofix, and reconnect replay.",
    },
    {
      date: "29 Apr-04 Jun",
      title: "Observe and harden",
      detail: "Langfuse/OpenTelemetry, code validation, render timeouts, live render progress, and manual editing.",
    },
    {
      date: "08-19 Jun",
      title: "Expand the product surface",
      detail: "Uploaded-video and facecam workflows, retake control, background removal, and creator-edit direction.",
    },
    {
      date: "02-03 Jul",
      title: "Expose the production system over MCP",
      detail: "Client-driven creation, OAuth 2.1, per-scene briefs, parity gates, and interactive MCP Apps.",
    },
    {
      date: "08-11 Jul",
      title: "Production failures become product work",
      detail: "Chromium and memory fixes, retryable exports, durable object storage, wedged-worker protection, and script fact checking.",
    },
  ],
  evidence: {
    proves: [
      "A real multi-application product with domain boundaries and explicit composition roots",
      "Persistent workflow state, queued execution, replayable progress, and stage-aware recovery",
      "Generated-code validation built from observed failure modes rather than a generic AI wrapper",
      "Continuous product evolution across UI, media infrastructure, AI providers, auth, observability, and deployment",
    ],
    doesNotProve: [
      "Production throughput, uptime, revenue, or user adoption",
      "A universal success-rate or quality benchmark",
      "That every commit was authored manually or by one identity",
      "Independent source inspection while the application repository remains private",
      "That every workflow follows one fixed number of stages",
    ],
  },
} as const;

export type KalpanaCaseStudy = typeof kalpanaCaseStudy;
