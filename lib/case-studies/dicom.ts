/**
 * DICOM Viewer + PACS case study content.
 *
 * Every number, protocol name, file path and code excerpt below was verified
 * against the actual application repository in July 2026: 33 commits,
 * Jun 8 to Jul 9, 2026; 168 TypeScript files, ~15,700 lines. Do not edit
 * values without re-checking the source.
 */
export const dicomCaseStudy = {
  title: "DICOM Viewer + PACS",
  eyebrow: "Solo-build case study · Radiology imaging",
  githubUrl: "https://github.com/jeetsoni",
  liveUrl: "https://dicom-viewer-production-b98b.up.railway.app",

  hero: {
    titleLines: ["From the scanner.", "To the signed report."],
    titleEm: "One system owns the chain.",
    sub: "A complete radiology imaging chain, built solo in 33 commits: an offline-first edge gateway that scanners push into, a multi-tenant cloud archive speaking pure DICOMweb, a GPU-adaptive browser viewer with MPR and 3D volume rendering, and an AI agent that reads scans by driving that viewer itself. This page explains the system in plain language, then quotes the code.",
    meta: [
      { label: "Role", value: "Solo design and engineering" },
      { label: "Timeline", value: "Jun-Jul 2026, 33 commits" },
      { label: "Stack", value: "TypeScript, Next.js 16, Cornerstone3D, Postgres, Orthanc, Python" },
      { label: "Surface", value: "Live viewer + cloud PACS + edge gateway" },
    ],
  },

  tldr: [
    {
      lead: "What it is.",
      text: "Upload a study, or let a scanner push one: it lands in a cloud archive, appears on the imaging center's worklist, opens in a browser viewer with windowing, MPR and 3D volume rendering, and leaves as an immutable signed report with an audit trail.",
    },
    {
      lead: "The PACS discipline.",
      text: "The application speaks only standard DICOMweb to the archive: STOW-RS to store, QIDO-RS to search, WADO-RS to retrieve, never a vendor's private API. Swapping Orthanc for a managed health-imaging cloud is configuration, and the browser never touches the archive directly.",
    },
    {
      lead: "The agentic reader.",
      text: "An LLM reads the scan by driving the viewer: it requests slice montages and Hounsfield measurements, the browser executes those tools on an off-screen viewport, and every draft opens with a required line: AI-proposed, radiologist verification required. Models are scored offline against a pydicom ground-truth harness.",
    },
    {
      lead: "The edge reality.",
      text: "Clinics lose internet; scanning must not stop. A standard-library-only Python gateway store-and-forwards stable studies to the cloud, retries forever through outages, and deletes its local copy only after the cloud confirms receipt.",
    },
  ],

  shot: {
    src: "/projects/dicom.jpg",
    alt: "DICOM viewer 3D workspace: MPR slices and volume-rendered skull of a head CT with the report cockpit open",
    caption: "The 3D workspace on a head CT: MPR planes, volume render, and the reporting cockpit.",
  },

  flow: {
    heading: "The journey of a study.",
    sub: "Nine steps from a modality in a clinic to a signed report in the archive. These are the real protocols, files and endpoints from the code.",
    legend: [
      { kind: "agent", label: "AI reads" },
      { kind: "gate", label: "System checks" },
      { kind: "human", label: "Human decides" },
      { kind: "service", label: "Infrastructure moves" },
    ],
    stages: [
      { id: "01", name: "Scan", enum: "C-STORE :4242", kind: "service", detail: "A modality pushes the study to the clinic's LAN Orthanc over classic DIMSE. Scanning never depends on the internet." },
      { id: "02", name: "Edge gateway", enum: "gateway/orthanc", kind: "service", detail: "The gateway holds the study until it is stable: fully received from the scanner and no longer changing." },
      { id: "03", name: "Store-and-forward", enum: "gateway/forwarder.py", kind: "service", detail: "A standard-library-only Python sidecar pushes stable studies to the cloud over STOW-RS, retries forever offline, and deletes locally only after the cloud confirms." },
      { id: "04", name: "Ingest door", enum: "/api/gateway/studies", kind: "gate", detail: "Each gateway authenticates with its own per-center credential; every accepted study is attributed to its center and audited." },
      { id: "05", name: "Archive + index", enum: "orthanc + studies_index", kind: "service", detail: "Pixels live in the DICOM archive keyed by SOP Instance UID. Identity, tenancy, reports and audit live in Postgres." },
      { id: "06", name: "Worklist", enum: "PostgresWorklistIndex", kind: "human", detail: "Radiologists see only their center's studies, filtered by patient, modality and date. Unindexed studies are denied by default." },
      { id: "07", name: "Read", enum: "/api/dicomweb/[...path]", kind: "human", detail: "The viewer streams slices through a credential-injecting proxy that allowlists the path shape. The archive is never exposed to the browser." },
      { id: "08", name: "Agentic read", enum: "view_slices · measure_hu", kind: "agent", detail: "Optionally, an AI reader drives the same viewer: montages of slices, Hounsfield measurements over a drawn ROI, then a structured draft report." },
      { id: "09", name: "Sign", enum: "reports/[studyUid]/sign", kind: "output", detail: "Only radiologists and admins sign. A signed report can never be edited again, and every signature lands in the append-only audit log." },
    ],
    note: "Browser upload joins the chain at the archive: drag DICOM files or a whole zip onto the home page; files are detected by the DICM magic bytes at offset 128, never by extension. Studies open from the worklist or straight from the device.",
  },

  receipts: {
    heading: "Read the actual code.",
    sub: "Four excerpts quoted from the repository, with paths, so the claims on this page stay checkable rather than atmospheric.",
    items: [
      {
        file: "gateway/forwarder.py",
        tag: "the edge survives outages",
        code: `"""Store-and-forward relay for the edge gateway.
Watches the gateway Orthanc for *stable* studies (fully
received from the scanner) and pushes each one to the
cloud archive via STOW-RS ...
  - internet down -> studies accumulate on the gateway
    disk and retry forever
Standard library only - the sidecar container is a bare
python:alpine."""`,
        caption: "The clinic keeps scanning when the internet dies. Studies accumulate on the gateway disk, pushing resumes when connectivity returns, and the local copy is deleted only after the cloud archive confirms receipt.",
      },
      {
        file: "infrastructure/repositories/DicomWebRepository.ts",
        tag: "vendor-neutral by discipline",
        code: `/* Portability discipline: this class speaks ONLY
 * standard DICOMweb - STOW-RS to store, QIDO-RS to
 * search, WADO-RS to retrieve - never a vendor's
 * proprietary REST API. Swapping Orthanc for AWS
 * HealthImaging / Google or Azure DICOM services
 * should be a config + auth change, not a code
 * change. */`,
        caption: "The archive is a standard, not a dependency. The same discipline keeps the browser out: every DICOMweb request passes through a server proxy that injects credentials and validates the path shape against an allowlist.",
      },
      {
        file: "infrastructure/services/AiSdkAgenticReader.ts",
        tag: "the viewer is the agent's hands",
        code: `/* abridged: tools carry deliberately NO execute
   handlers - the loop stops after each model turn and
   the presentation layer executes the calls against
   the in-browser viewer, where the pixel data lives */
view_slices    up to 9 slices, labeled montage, CT presets
measure_hu     mean HU over a circular ROI, drawn back
submit_report  structured draft, called exactly once`,
        caption: "The server plans one stateless turn at a time; the browser executes. Slices render to a throwaway off-screen viewport, Hounsfield stats compute from raw pixels with rescale handled exactly once, and the sampled ROI is drawn back so the model can verify where it measured. The patient's name never leaves the app.",
      },
      {
        file: "infrastructure/services/agenticModels.ts",
        tag: "defaults chosen by measurement",
        code: `export const DEFAULT_AGENTIC_MODEL_ID =
  'claude-opus-4-8';
// On a head-CT ground-truth case, Flash still
// confabulated a mass. Opus 4.8 gave the most
// calibrated, clinically sound report - so it
// is the default.`,
        caption: "Model choice is an engineering decision with receipts: a pydicom harness builds a Hounsfield ground truth from a real head CT and scores each model's read against it. The picker ships four models; the default earned its place.",
      },
    ],
  },

  proof: [
    { value: "24", label: "API routes", note: "Upload to signing" },
    { value: "18", label: "Use-cases", note: "Application layer" },
    { value: "7", label: "AI endpoints", note: "One agentic, six assistive" },
    { value: "9", label: "Chain steps", note: "Scanner to signed report" },
  ],

  architecture: [
    {
      index: "01",
      name: "Presentation",
      remit: "Next.js shells, React, viewer",
      detail:
        "Route files are razor-thin shells; real UI lives in presentation components, hooks and the Cornerstone lib layer. The Zustand store mirrors transient viewport state only: no business logic, no DICOM data.",
      evidence: "presentation/components · hooks · lib/cornerstone",
    },
    {
      index: "02",
      name: "Application",
      remit: "Use cases and orchestration",
      detail:
        "18 use-cases orchestrate upload, retrieval, reporting and identity. Route handlers act as composition roots, wiring concrete implementations through factories.",
      evidence: "application/usecases · factories as composition roots",
    },
    {
      index: "03",
      name: "Domain",
      remit: "Rules, entities, ports",
      detail:
        "Study assembly grouped by series and instance UIDs, modality window presets, agent tool names, and the repository and AI ports all live framework-free. The AI is typed in the domain before any provider exists.",
      evidence: "domain/services · repositories (interfaces)",
    },
    {
      index: "04",
      name: "Infrastructure",
      remit: "Providers and persistence",
      detail:
        "The DICOMweb repository, four Postgres stores (identity, reports, worklist, audit), a scrypt password hasher, Anthropic and Google adapters, and the Python edge gateway implement the ports.",
      evidence: "infrastructure/repositories · services · identity",
    },
  ],

  reliability: [
    {
      index: "R1",
      title: "The edge survives outages",
      body:
        "Store-and-forward with stable-study detection: the gateway pushes only fully received studies, retries forever through connectivity loss, deduplicates by SOP Instance UID, and deletes its local copy only after the cloud archive confirms.",
      tag: "STOW-RS · retry forever",
    },
    {
      index: "R2",
      title: "The archive is never exposed",
      body:
        "The browser reaches the archive only through a read-only proxy that injects server-held credentials, validates every path segment against an allowlist regex, checks tenancy per request, and caches privately.",
      tag: "Credential-injecting proxy",
    },
    {
      index: "R3",
      title: "Tenancy, audit, immutability",
      body:
        "Center users see only their center's studies, deny-by-default for anything unindexed. Every sensitive action lands in an append-only audit log. Signing is restricted to radiologists and admins, and a signed report can never be edited again.",
      tag: "audit_log · signed reports",
    },
    {
      index: "R4",
      title: "A control plane that deploys itself",
      body:
        "Raw Postgres with no ORM. The schema self-migrates on first use under a Postgres advisory lock, so a fresh deploy needs no migration step and concurrent instances cannot race. Passwords use memory-hard scrypt; session tokens are stored only as hashes.",
      tag: "Advisory-lock migrate · scrypt",
    },
    {
      index: "R5",
      title: "Rendering that survives real phones",
      body:
        "A one-time WebGL2 probe reads each device's true texture ceiling and measures the largest float32 3D texture it can actually sample, fixing black volume renders on older iPhones. Pixel ratio is capped on 3x phones, a decode worker is reserved so scrolling never starves, and slices decimate to a GPU memory budget.",
      tag: "Device profile · WebGL2",
    },
    {
      index: "R6",
      title: "An agent under guardrails",
      body:
        "A 16-step ceiling with wrap-up forced at step 13, image history pruned to the last two tool steps, over-call traps written into the protocol prompt, a mandatory verification pass, and a required first impression line: AI-proposed draft, radiologist verification required.",
      tag: "Bounded loop · protocol prompt",
    },
  ],

  decisions: [
    {
      number: "D-01",
      title: "Speak DICOMweb only, never vendor APIs",
      context:
        "Orthanc's proprietary REST API is convenient and everywhere in tutorials.",
      decision:
        "The application talks to the archive exclusively through STOW-RS, QIDO-RS and WADO-RS, with original transfer syntax preserved.",
      tradeoff:
        "No vendor shortcuts, in exchange for an archive that swaps for AWS, Google or Azure health imaging as a configuration change.",
    },
    {
      number: "D-02",
      title: "Two systems of record, split by data nature",
      context:
        "A PACS holds two very different things: large immutable pixel data and small mutable operational truth.",
      decision:
        "Pixels live in the DICOM archive keyed by SOP Instance UID; identity, tenancy, reports, the worklist index and audit live in Postgres.",
      tradeoff:
        "Two stores to operate, each doing exactly what it is built for.",
    },
    {
      number: "D-03",
      title: "The browser executes the agent's tools",
      context:
        "The pixel data and the GPU renderer live client-side; shipping pixels to the server would duplicate the entire viewer.",
      decision:
        "The server plans one stateless model turn at a time; the viewer executes view_slices and measure_hu on an off-screen viewport and returns labeled montages.",
      tradeoff:
        "A chattier loop, but the model sees exactly what a radiologist sees, and the patient's name never leaves the app.",
    },
    {
      number: "D-04",
      title: "A deliberately dumb edge",
      context:
        "The gateway runs inside clinics on hardware nobody maintains.",
      decision:
        "A standard-library-only Python sidecar on a bare Alpine container: watch, forward, confirm, delete. No queue framework, no dependencies.",
      tradeoff:
        "No cleverness at the edge, and therefore nothing to operate or break inside a clinic.",
    },
  ],

  evolution: {
    heading: "How it was built.",
    sub: "Thirty-three commits, June 8 to July 9, 2026. The viewer came first; the platform arrived in a five-phase finale.",
    phases: [
      {
        date: "08-09 Jun",
        title: "Viewer MVP in two days",
        detail: "Clean-architecture scaffold, Cornerstone3D v4 stack viewer, upload with DICM magic-byte detection, and the first four AI report features.",
      },
      {
        date: "10 Jun",
        title: "The reporting cockpit",
        detail: "Structured ICRI reporting, a mobile-first PWA, synchronized multi-screen scrolling, and the 3D workspace: MPR crosshairs, volume rendering, slab projections.",
      },
      {
        date: "11 Jun",
        title: "The agentic deep read",
        detail: "The AI stops captioning and starts driving: view_slices and measure_hu executed by the viewer, live HU under the cursor, quad layouts, 2D MPR.",
      },
      {
        date: "12 Jun-04 Jul",
        title: "The Apple GPU war",
        detail: "Black 3D renders on iPhones: an on-device GPU diagnostics overlay, measuring the real float32 texture ceiling, demoting LINEAR to NEAREST filtering, and a mobile chrome redesign.",
      },
      {
        date: "08-09 Jul",
        title: "The PACS build-out",
        detail: "Orthanc archive over pure DICOMweb, the edge gateway for scanner connectivity, the archive worklist, and platform auth: centers, roles, signed reports, audit.",
      },
    ],
  },

  evidence: {
    proves: [
      "A real end-to-end imaging chain in one codebase: edge gateway, cloud archive, worklist, viewer, reporting",
      "Standards discipline: DICOMweb-only to the archive, classic DIMSE at the edge, swappable by configuration",
      "An agentic AI reader whose tools execute in the browser, scored against an offline ground-truth harness",
      "Device-adaptive GPU rendering built from debugging real failures on real phones",
    ],
    doesNotProve: [
      "Clinical accuracy or regulatory clearance: this is not a certified medical device",
      "Hospital deployments, imaging throughput or uptime",
      "Automated test coverage: the repository currently ships none",
      "DICOM de-identification: PHI is governed by tenancy and an append-only audit trail, and the AI path strips the patient name",
    ],
  },
} as const;

export type DicomCaseStudy = typeof dicomCaseStudy;
