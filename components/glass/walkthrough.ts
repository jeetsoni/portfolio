/**
 * The Idea to Motion product walkthrough, carried over word for word from
 * the previous case-study page (IdeaToMotionScrollStory) so no indexed copy
 * is lost in the redesign.
 */
export type Chapter = {
  no: string;
  label: string;
  title: string;
  em: string;
  lead: string;
  detail?: string;
  steps?: { title: string; note?: string; more?: string }[];
  example?: string;
};

export const ideaToMotionWalkthrough: {
  heading: string;
  chapters: Chapter[];
  connect: { src: string; alt: string; callouts: string[]; closing: string };
} = {
  heading: "The product, from the creator's seat",
  chapters: [
    {
      no: "01",
      label: "Compose",
      title: "One idea.",
      em: "One production workspace.",
      lead: "Choose the format, voice, and visual language. The system turns that intent into a reviewable video project, not one opaque AI request.",
      example: "What should the video explain? Why do distributed systems fail in surprising ways?",
    },
    {
      no: "02",
      label: "Journey",
      title: "The work stays",
      em: "visible.",
      lead: "Five reader-facing phases. One project moves forward without hiding the decisions.",
      detail:
        "The product streams a scene-based script, verifies claims, generates voice and visual direction, reveals scene previews progressively, then lets the creator edit and approve the composition before rendering.",
      steps: [
        { title: "Plan", note: "Script streams scene by scene", more: "Script appears while the model writes" },
        { title: "Verify", note: "Claims are checked before approval", more: "Check the claim before producing it" },
        { title: "Create", note: "Voice, timing, direction, and scenes", more: "Voice timing becomes visual direction" },
        { title: "Preview", note: "Edit the real composition", more: "Scenes arrive one by one, not at the end" },
        { title: "Render", note: "Export only after review", more: "Spend the render only after review" },
      ],
    },
    {
      no: "03",
      label: "Recovery",
      title: "Pull the process.",
      em: "Keep the work.",
      lead: "The worker is temporary. The project state is not.",
      detail:
        "When a code-generation worker fails at stage eight, PostgreSQL retains the current stage and completed artifacts. BullMQ retries that stage, and buffered events help a reconnecting browser catch up before returning to live progress.",
      steps: [
        { title: "Worker owns the attempt." },
        { title: "Memory disappears." },
        { title: "The checkpoint remains.", note: "POSTGRES / PIPELINE_JOB · CODE_GENERATION", more: "Stage 07 + completed artifacts remain" },
        { title: "Continue, not restart." },
      ],
    },
    {
      no: "04",
      label: "Validation",
      title: "Code is a proposal.",
      em: "Not permission.",
      lead: "Every scene crosses explicit gates before it joins the video.",
      detail:
        "All generated scene code is compiled with esbuild and inspected for known hazards. MCP client scene submissions additionally render the first, middle, and final frame in an isolated worker thread with a five-second timeout.",
      steps: [
        { title: "Generated JSX", note: "Input" },
        { title: "Compile", note: "esbuild parses JSX" },
        { title: "Inspect", note: "known runtime hazards" },
        { title: "Compose", note: "join the timeline" },
        { title: "3-frame smoke render", note: "MCP submissions only · isolated worker · 5s ceiling" },
      ],
    },
  ],
  connect: {
    src: "/projects/idea-to-motion-connect.jpg",
    alt: "Idea to Motion connect page: pick an MCP client, then add the server with one command",
    callouts: ["01 · Pick your client", "02 · One config entry", "03 · 26 tools, live"],
    closing:
      "From one prompt — typed in the studio, or spoken to your own agent — to an editable, recoverable production workspace.",
  },
};

export const ideaToMotionOutput = {
  title: "Your AI brings the brain.",
  em: "Idea to Motion brings the studio.",
  lead: "One MCP entry in the client you already use. Your assistant supplies the reasoning; the server keeps the contracts, and every script, direction and scene it submits passes the same gates as the web app.",
};
