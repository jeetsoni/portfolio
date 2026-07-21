/**
 * KalpanaAI case study content.
 *
 * Every number, stage name, file path and code excerpt below was verified
 * against the actual application repository (private) in July 2026:
 * 314 commits, Apr 17 to Jul 17, 2026. Do not edit values without
 * re-checking the source.
 */
export const kalpanaCaseStudy = {
  title: "KalpanaAI",
  eyebrow: "Founder case study · AI video production",
  role: "Founder · solo design and engineering",
  period: "Apr-Jul 2026",
  commits: "314 commits",
  githubUrl: "https://github.com/jeetsoni",
  liveUrl: "https://video-ai-web-production.up.railway.app",

  hero: {
    titleLines: ["One prompt in.", "A finished video out."],
    titleEm: "Nothing lost in between.",
    sub: "KalpanaAI is a prompt-to-video production system, designed and built solo across 314 commits: AI plans the script, verifies its claims, voices it, writes real motion-graphics code and renders the video, while a human approves the two moments that matter. This page explains how it works in plain language, then shows the actual code that keeps it honest.",
    meta: [
      { label: "Role", value: "Founder, solo build" },
      { label: "Timeline", value: "Apr-Jul 2026, 314 commits" },
      { label: "Stack", value: "TypeScript, Next.js, Express, BullMQ, Remotion, Postgres, Redis" },
      { label: "Surface", value: "Live studio app + MCP server for external agents" },
    ],
  },

  tldr: [
    {
      lead: "What it is.",
      text: "Type a topic; get a scripted, fact-checked, voiced, animated and rendered video. Every step is visible and editable in a live studio, so the result is a project you shaped, not a black-box clip.",
    },
    {
      lead: "The hard problem.",
      text: "Probabilistic models, AI-written executable code, long media jobs and human review have to cooperate without one failure destroying the project. The answer is a checkpointed state machine: eleven stages, every artifact saved to Postgres, and any crash resumes exactly where it stopped.",
    },
    {
      lead: "The trust problem.",
      text: "The AI writes real React code for every scene, and that code is treated as untrusted input. It must pass a compile check, eight named hazard rules, a sandboxed three-frame test render with a five-second kill switch, and a quality audit before it may join the video.",
    },
    {
      lead: "The open factory.",
      text: "The whole pipeline is also exposed over MCP with 18 tools and OAuth 2.1. An external agent can bring its own model for the script, the direction and the code, and every submission still passes the same gates.",
    },
  ],

  flow: {
    heading: "The pipeline, precisely.",
    sub: "The chapters above compress what is really eleven stages. These are the actual stage names from the code, in the order the state machine allows them to run.",
    legend: [
      { kind: "agent", label: "AI writes" },
      { kind: "gate", label: "System checks" },
      { kind: "human", label: "Human decides" },
      { kind: "service", label: "Media is produced" },
    ],
    stages: [
      { id: "01", name: "Script", enum: "script_generation", kind: "agent", detail: "Researches the topic and writes a scene-by-scene script, streamed to the browser token by token." },
      { id: "02", name: "Fact check", enum: "fact_check", kind: "gate", detail: "Verifies claims against live Google Search. Contradicted lines are rewritten against the evidence; if the checker itself fails, the script continues to review marked unverified." },
      { id: "03", name: "Script review", enum: "script_review", kind: "human", detail: "The creator edits and approves the script before any money is spent producing it." },
      { id: "04", name: "Voice", enum: "tts_generation", kind: "service", detail: "ElevenLabs, or a local GPU voice sidecar with the identical contract, speaks the script and returns word-level timing." },
      { id: "05", name: "Transcription", enum: "transcription", kind: "service", detail: "Facecam footage is transcribed with word timestamps; faceless videos skip the call because voice timing already exists." },
      { id: "06", name: "Timestamp map", enum: "timestamp_mapping", kind: "service", detail: "Every script line is pinned to exact start and end times on the voice track." },
      { id: "07", name: "Direction", enum: "direction_generation", kind: "agent", detail: "Timed lines become visual direction: beats, layouts, brand assets and motion for each scene." },
      { id: "08", name: "Code", enum: "code_generation", kind: "agent", detail: "An agent writes real React/Remotion code per scene. Every file faces the validation gates before composition." },
      { id: "09", name: "Preview", enum: "preview", kind: "human", detail: "The creator watches the real composition, tweaks it by chat or direct manipulation, and approves the render." },
      { id: "10", name: "Render", enum: "rendering", kind: "service", detail: "Headless Chromium renders h264 at 30fps; audio is loudness-normalized to the -14 LUFS social standard." },
      { id: "11", name: "Done", enum: "done", kind: "output", detail: "MP4, a midpoint-frame thumbnail and generated social metadata land in object storage." },
    ],
    note: "Facecam projects insert facecam_editing and facecam_review after Voice; uploaded-footage projects take a separate creator route. In the code the stage enum is append-only so database indices stay stable across migrations: the transition map, not the enum order, is the real graph.",
  },

  receipts: {
    heading: "Read the actual code.",
    sub: "Four excerpts quoted from the private repository, with paths, so the claims on this page stay checkable rather than atmospheric.",
    items: [
      {
        file: "pipeline/domain/entities/pipeline-job.ts",
        tag: "the state machine says no",
        code: `if (!this.props.stage.canTransitionTo(targetStage)) {
  return Result.fail(
    new ValidationError(
      \`Cannot transition from "\${this.props.stage.value}"
       to "\${targetStageValue}"\`,
      "INVALID_TRANSITION",
    ),
  );
}`,
        caption: "The domain entity owns the workflow. A worker cannot skip a stage, and artifact setters are stage-guarded too: generated code can only be attached during code_generation. Failures return typed Results; exceptions are never used for control flow.",
      },
      {
        file: "pipeline/infrastructure/queue/pipeline-queue.ts",
        tag: "retries follow economics",
        code: `/* abridged: per-stage BullMQ policy */
script_generation:    { attempts: 3, delay: 2000 },
direction_generation: { attempts: 3, delay: 5000 },
transcription:        { attempts: 1, delay: 1000 },
rendering:            { attempts: 1, delay: 1000 },`,
        caption: "Flaky LLM stages get three attempts with exponential backoff. Expensive, billable stages like rendering and transcription get exactly one: a failed job is resumed deliberately from its checkpoint, never silently re-billed.",
      },
      {
        file: "pipeline/infrastructure/queue/worker-registry.ts",
        tag: "locks sized to reality",
        code: `// BullMQ defaults: lockDuration=30s, stalledInterval=30s.
// Our transcription stage can take 2-5 minutes, so a
// default lock would mark a healthy worker as stalled.
lockDuration: 600_000,   // 10 minutes
stalledInterval: 300_000 // 5 minutes`,
        caption: "Media jobs are long. The lock is sized for that, long stages extend it mid-flight, and a worker-level failure listener persists the failed state and emits a final progress event, so the browser never spins forever, even after an out-of-memory kill.",
      },
      {
        file: "pipeline/infrastructure/services/remotion-client-scene-code.service.ts",
        tag: "untrusted code, bounded blast radius",
        code: `const SMOKE_RENDER_TIMEOUT_MS = 5000;

const frames = [0, Math.floor(durationInFrames / 2),
  durationInFrames - 1];
for (const frame of frames) {
  currentFrame = frame;
  renderToStaticMarkup(
    React.createElement(Main, { scene, scenePlan }));
}`,
        caption: "Externally submitted scene code executes inside a worker thread with mocked Remotion globals, rendered at the first, middle and final frame. A five-second ceiling kills infinite loops without ever blocking the API event loop.",
      },
    ],
  },

  proof: [
    { value: "17", label: "AI agents", note: "Per-agent model + temperature" },
    { value: "69", label: "Use-cases", note: "Application layer, Result-typed" },
    { value: "123", label: "Test files", note: "27 property-based suites" },
    { value: "54", label: "Animation themes", note: "Studio to Claude Dark" },
  ],

  architecture: [
    {
      index: "01",
      name: "Presentation",
      remit: "HTTP, SSE, UI, controllers",
      detail:
        "Next.js feature modules and Express controllers translate product actions into use-case requests. Server-sent events stream progress with sequence ids and 15-second heartbeats.",
      evidence: "presentation/controllers · SSE helpers · MCP routes",
    },
    {
      index: "02",
      name: "Application",
      remit: "Use cases and orchestration",
      detail:
        "69 use-cases coordinate repositories, queues, model ports, storage and streaming, returning explicit Result values instead of using exceptions for control flow.",
      evidence: "application/use-cases · Result<T, E> everywhere",
    },
    {
      index: "03",
      name: "Domain",
      remit: "Rules, state, invariants",
      detail:
        "PipelineJob owns legal stage transitions, stage-guarded artifact setters, progress state and failure state. Infrastructure cannot redefine the workflow's business rules.",
      evidence: "PipelineJob.transitionTo() · setGeneratedCode() guards",
    },
    {
      index: "04",
      name: "Infrastructure",
      remit: "Providers and persistence",
      detail:
        "Prisma, 14 BullMQ workers, Redis, five routable model providers, two TTS backends, object storage, Remotion and FFmpeg sit behind interfaces, wired at explicit composition roots.",
      evidence: "repositories · workers · service adapters · ModelRegistry",
    },
  ],

  reliability: [
    {
      index: "R1",
      title: "Checkpoint the work, not just the status",
      body:
        "One Postgres row per job stores the script, fact-check report, audio path, transcript, scene directions, generated code and rendered asset paths. Every worker saves immediately after each legal transition, so the database advances in lockstep with the state machine and any job can be understood from durable state alone.",
      tag: "PostgreSQL · Prisma upsert",
    },
    {
      index: "R2",
      title: "Retry according to stage economics",
      body:
        "Per-stage BullMQ policy: three attempts with exponential backoff where models are flaky, exactly one where output is expensive or billable. Failed jobs are cleared and resumed from their checkpointed stage rather than restarted.",
      tag: "BullMQ · per-stage policy",
    },
    {
      index: "R3",
      title: "Replay progress after a disconnect",
      body:
        "Progress events publish live over Redis and append to a durable list. A reconnecting browser replays the buffer in order, then rejoins the live channel; buffers expire an hour after completion. Once a stage is durable, Postgres, not the buffer, is the source of truth, so a refresh can never resurrect pre-edit content.",
      tag: "SSE · Redis buffer · seq ids",
    },
    {
      index: "R4",
      title: "Never leave the interface spinning",
      body:
        "A worker-level failure listener catches even out-of-memory kills, persists the failure and emits a terminal progress event. Locks run ten minutes with five-minute stall checks, and long stages extend their lock mid-flight.",
      tag: "Failure listener · 10-min lock",
    },
    {
      index: "R5",
      title: "Treat generated code as untrusted input",
      body:
        "Every scene compiles under esbuild, then faces eight named hazard rules learned from real failures: lowercase img tags, dead logo CDNs, frame arithmetic bugs, hallucinated identifiers and more. Errors return to the model as targeted repair hints; in preview, an agentic autofixer isolates the crashing scene and patches it surgically.",
      tag: "esbuild · 8 static gates · autofixer",
    },
    {
      index: "R6",
      title: "Bound runtime validation",
      body:
        "Client-submitted scenes additionally render three frames inside an isolated worker thread with mocked Remotion globals and a five-second timeout, then pass a quality audit for unclamped animations and under-built scenes.",
      tag: "worker_threads · 5s ceiling",
    },
  ],

  decisions: [
    {
      number: "D-01",
      title: "A state machine over a giant request",
      context:
        "Video generation crosses slow model calls, speech services, asset storage, code execution and headless rendering.",
      decision:
        "Model the product as durable stages owned by a domain entity and execute processing stages through a queue.",
      tradeoff:
        "More operational machinery and transition rules, in exchange for resumability, visibility and isolated failure.",
    },
    {
      number: "D-02",
      title: "Human review before expensive production",
      context:
        "A fluent script can still be wrong, off-brand, or simply not what the creator wants. Downstream audio and rendering amplify that mistake.",
      decision:
        "Fact-check generated claims, then pause for script approval; pause again at browser preview before export.",
      tradeoff:
        "The flow is not fully autonomous, but user judgment is applied at the two points where it prevents the most wasted work.",
    },
    {
      number: "D-03",
      title: "Provider routing per responsibility",
      context:
        "Seventeen agent roles, from script writing to thumbnail generation, have different model needs and cost profiles.",
      decision:
        "Resolve models by named agent through a ModelRegistry defaulting to the Vercel AI Gateway, with TTS, transcription, storage and image lookup behind ports; a local GPU sidecar can replace paid TTS with an identical contract.",
      tradeoff:
        "Configuration becomes a system of its own, but provider changes never require rewriting the workflow or domain.",
    },
    {
      number: "D-04",
      title: "Share contracts with client-driven AI",
      context:
        "An MCP client can provide its own reasoning model, but bypassing server constraints would create a second, lower-quality pipeline.",
      decision:
        "Let client-driven jobs submit scripts, directions and scene code through the same schemas, validation gates, composition logic and persisted state, across 18 MCP tools with OAuth 2.1.",
      tradeoff:
        "The protocol is more involved, but the server keeps product invariants while the client supplies the intelligence.",
    },
  ],

  evolution: {
    heading: "How it was built.",
    sub: "Ninety-two days from empty repository to live product with an open agent protocol, in six phases.",
    phases: [
      {
        date: "17 Apr",
        title: "Architecture before features",
        detail: "Turborepo foundation, infrastructure services and a Clean Architecture scaffold.",
      },
      {
        date: "18-20 Apr",
        title: "From pipeline to recoverable pipeline",
        detail: "Core faceless flow, SSE progress, browser preview, job retry, code autofix and reconnect replay.",
      },
      {
        date: "29 Apr-04 Jun",
        title: "Observe and harden",
        detail: "Langfuse and OpenTelemetry tracing, code validation, render timeouts, live render progress and manual editing.",
      },
      {
        date: "08-19 Jun",
        title: "Expand the product surface",
        detail: "Uploaded-video and facecam workflows, retake control, background removal and creator-edit direction.",
      },
      {
        date: "02-03 Jul",
        title: "Expose the factory over MCP",
        detail: "Client-driven creation, OAuth 2.1, per-scene briefs, parity gates and interactive MCP Apps.",
      },
      {
        date: "08-11 Jul",
        title: "Production failures become product work",
        detail: "Chromium and memory fixes, retryable exports, durable object storage, wedged-worker protection and script fact checking.",
      },
    ],
  },

  evidence: {
    proves: [
      "A real multi-application product with domain boundaries and explicit composition roots",
      "Persistent workflow state, queued execution, replayable progress and stage-aware recovery",
      "Generated-code validation built from observed failure modes rather than a generic AI wrapper",
      "Continuous evolution across UI, media infrastructure, AI providers, auth, observability and deployment",
    ],
    doesNotProve: [
      "Production throughput, uptime, revenue or user adoption",
      "A universal success-rate or quality benchmark",
      "Independent source inspection while the application repository remains private",
      "That every workflow follows one fixed number of stages",
    ],
  },
} as const;

export type KalpanaCaseStudy = typeof kalpanaCaseStudy;
