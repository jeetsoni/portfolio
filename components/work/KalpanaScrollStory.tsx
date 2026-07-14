import Image from "next/image";
import { kalpanaCaseStudy as study } from "@/lib/case-studies/kalpana-ai";

const journeyPhases = [
  { key: "plan", label: "Plan", note: "Script streams scene by scene" },
  { key: "verify", label: "Verify", note: "Claims are checked before approval" },
  { key: "create", label: "Create", note: "Voice, timing, direction, and scenes" },
  { key: "preview", label: "Preview", note: "Edit the real composition" },
  { key: "render", label: "Render", note: "Export only after review" },
] as const;

function Chapter({ number, label }: { number: string; label: string }) {
  return (
    <div className="k2-chapter">
      <span>{number}</span>
      <i />
      <strong>{label}</strong>
    </div>
  );
}

export default function KalpanaScrollStory() {
  return (
    <div className="k2-story" aria-label="KalpanaAI product and system story">
      <section className="k2-act k2-compose" data-k2-act="compose" aria-labelledby="k2-compose-title">
        <div className="k2-stage">
          <div className="k2-edge-signal" aria-hidden="true"><span /></div>
          <Chapter number="01" label="Compose" />

          <div className="k2-compose-copy">
            <p className="k2-eyebrow">KalpanaAI · Founder case study</p>
            <h1 id="k2-compose-title">
              One idea.<br />
              <em>One production workspace.</em>
            </h1>
            <p>
              Choose the format, voice, and visual language. The system turns that intent into a
              reviewable video project—not one opaque AI request.
            </p>
          </div>

          <div className="k2-composer" aria-label="KalpanaAI video composer example">
            <div className="k2-window-bar">
              <span>NEW EXPLAINER</span>
              <span>kalpana.ai / studio</span>
            </div>
            <div className="k2-composer-field">
              <span>WHAT SHOULD THE VIDEO EXPLAIN?</span>
              <strong>Why do distributed systems fail in surprising ways?</strong>
              <i aria-hidden="true" />
            </div>
            <div className="k2-composer-options">
              <div><span>FORMAT</span><strong>Reel · 9:16</strong></div>
              <div><span>DURATION</span><strong>60 seconds</strong></div>
              <div><span>THEME</span><strong>Studio</strong><i className="k2-theme-swatch" /></div>
              <div><span>VOICE</span><strong>Aria</strong></div>
            </div>
            <div className="k2-composer-footer">
              <span>Reference images · optional</span>
              <span className="k2-create-action">Create video <b>→</b></span>
            </div>
            <div className="k2-job-created" aria-hidden="true">
              <span>JOB CREATED</span>
              <strong>Draft workspace ready</strong>
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="k2-act k2-journey" data-k2-act="journey" aria-labelledby="k2-journey-title">
        <div className="k2-stage">
          <div className="k2-edge-signal" aria-hidden="true"><span /></div>
          <Chapter number="02" label="Review before render" />

          <div className="k2-heading">
            <h2 id="k2-journey-title">The work stays<br /><em>visible.</em></h2>
            <p>Five reader-facing phases. One project moves forward without hiding the decisions.</p>
          </div>
          <p className="sr-only">
            The product streams a scene-based script, verifies claims, generates voice and visual
            direction, reveals scene previews progressively, then lets the creator edit and approve
            the composition before rendering.
          </p>

          <div className="k2-workspace" aria-hidden="true">
            <div className="k2-window-bar">
              <span>PROJECT / DISTRIBUTED SYSTEMS</span>
              <span className="k2-workspace-status">DRAFT SAVED</span>
            </div>

            <div className="k2-phase-stack">
              <div className="k2-phase k2-phase-plan" data-k2-phase="plan">
                <div className="k2-phase-meta"><span>01 / PLAN</span><strong>Script appears while the model writes</strong></div>
                <div className="k2-script-sheet">
                  <div><b>SCENE 01</b><span>Every distributed system begins with a promise…</span></div>
                  <div><b>SCENE 02</b><span>But networks delay, reorder, and lose messages.</span></div>
                  <div><b>SCENE 03</b><span>Reliability starts by designing for that uncertainty.</span></div>
                </div>
                <div className="k2-stream-caret" />
              </div>

              <div className="k2-phase k2-phase-verify" data-k2-phase="verify">
                <div className="k2-phase-meta"><span>02 / VERIFY</span><strong>Check the claim before producing it</strong></div>
                <div className="k2-claim">
                  <span>CLAIM 03</span>
                  <p>Network delivery is not guaranteed to be ordered or exactly once.</p>
                  <div><b>SUPPORTED</b><span>2 sources</span></div>
                </div>
                <div className="k2-review-actions"><span>Edit script</span><strong>Approve draft →</strong></div>
              </div>

              <div className="k2-phase k2-phase-create" data-k2-phase="create">
                <div className="k2-phase-meta"><span>03 / CREATE</span><strong>Voice timing becomes visual direction</strong></div>
                <div className="k2-audio-line">
                  {Array.from({ length: 32 }, (_, index) => <i key={index} style={{ height: `${24 + ((index * 17) % 68)}%` }} />)}
                </div>
                <div className="k2-scene-row">
                  {["Establish", "Interrupt", "Compare", "Resolve"].map((label, index) => (
                    <div key={label}><span>0{index + 1}</span><i /><strong>{label}</strong></div>
                  ))}
                </div>
              </div>

              <div className="k2-phase k2-phase-preview" data-k2-phase="preview">
                <div className="k2-phase-meta"><span>04 / PREVIEW</span><strong>Scenes arrive one by one—not at the end</strong></div>
                <div className="k2-preview-layout">
                  <div className="k2-chat-lines"><span /><span /><span /></div>
                  <div className="k2-phone-preview">
                    <i className="k2-phone-grid" />
                    <strong>FAILURE<br /><em>IS A STATE</em></strong>
                    <span>00:18 / 01:00</span>
                  </div>
                  <div className="k2-scene-progress"><span>4 / 6 scenes</span><i><b /></i></div>
                </div>
              </div>

              <div className="k2-phase k2-phase-render" data-k2-phase="render">
                <div className="k2-phase-meta"><span>05 / RENDER</span><strong>Spend the render only after review</strong></div>
                <div className="k2-render-card">
                  <span>VERTICAL VIDEO · 1080 × 1920</span>
                  <strong>Composition approved</strong>
                  <div><i /><b>READY TO RENDER</b></div>
                </div>
              </div>
            </div>

            <div className="k2-phase-rail">
              {journeyPhases.map((phase, index) => (
                <div key={phase.key} data-k2-phase-stop={phase.key}>
                  <span>0{index + 1}</span>
                  <i />
                  <strong>{phase.label}</strong>
                  <small>{phase.note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="k2-act k2-recovery" data-k2-act="recovery" aria-labelledby="k2-recovery-title">
        <div className="k2-stage">
          <div className="k2-edge-signal" aria-hidden="true"><span /></div>
          <Chapter number="03" label="Recover" />

          <div className="k2-heading">
            <h2 id="k2-recovery-title">Pull the process.<br /><em>Keep the work.</em></h2>
            <p>The worker is temporary. The project state is not.</p>
          </div>
          <p className="sr-only">
            When a code-generation worker fails at stage seven, PostgreSQL retains the current
            stage and completed artifacts. BullMQ retries that stage, and buffered events help a
            reconnecting browser catch up before returning to live progress.
          </p>

          <div className="k2-recovery-machine" aria-hidden="true">
            <div className="k2-recovery-state k2-state-running" data-k2-recovery="running">
              <span className="k2-state-index">01</span>
              <div className="k2-worker-core"><small>WORKER</small><strong>CODE GENERATION</strong><i /></div>
              <div className="k2-job-token"><b>JOB 042</b><span>STAGE 07</span></div>
              <p>Worker owns the attempt.</p>
            </div>
            <div className="k2-recovery-state k2-state-lost" data-k2-recovery="lost">
              <span className="k2-state-index">02</span>
              <div className="k2-process-lost"><i>×</i><strong>PROCESS LOST</strong></div>
              <p>Memory disappears.</p>
            </div>
            <div className="k2-recovery-state k2-state-saved" data-k2-recovery="saved">
              <span className="k2-state-index">03</span>
              <div className="k2-checkpoint-core">
                <small>POSTGRES / PIPELINE_JOB</small>
                <strong>CODE_GENERATION</strong>
                <div><span>S</span><span>F</span><span>A</span><span>T</span><span>D</span><span className="is-next">C</span><span className="is-next">R</span></div>
              </div>
              <p>The checkpoint remains.</p>
            </div>
            <div className="k2-recovery-state k2-state-resumed" data-k2-recovery="resumed">
              <span className="k2-state-index">04</span>
              <div className="k2-resume-core"><small>NEW WORKER</small><strong>RESUME STAGE 07</strong><i /></div>
              <div className="k2-recovery-notes"><span>stage-aware retry</span><span>event replay → live</span></div>
              <p>Continue—not restart.</p>
            </div>
          </div>

          <div className="k2-recovery-static">
            <div className="k2-static-loss"><span>PROCESS LOST</span></div>
            <div className="k2-static-arrow">↓</div>
            <div className="k2-static-checkpoint"><span>POSTGRES CHECKPOINT</span><strong>Stage 07 + completed artifacts remain</strong></div>
            <div className="k2-static-arrow">↓</div>
            <div className="k2-static-resume"><span>NEW WORKER</span><strong>Resume code generation</strong></div>
          </div>
        </div>
      </section>

      <section className="k2-act k2-validation" data-k2-act="validation" aria-labelledby="k2-validation-title">
        <div className="k2-stage k2-stage-light">
          <div className="k2-edge-signal" aria-hidden="true"><span /></div>
          <Chapter number="04" label="Validate" />

          <div className="k2-heading">
            <h2 id="k2-validation-title">Code is a proposal.<br /><em>Not permission.</em></h2>
            <p>Every scene crosses explicit gates before it joins the video.</p>
          </div>
          <p className="sr-only">
            All generated scene code is compiled with esbuild and inspected for known hazards.
            MCP client scene submissions additionally render the first, middle, and final frame in
            an isolated worker thread with a five-second timeout.
          </p>

          <div className="k2-permission-path" aria-label="Generated scene validation path">
            <div className="k2-path-node k2-node-code">
              <span>INPUT</span><strong>Generated JSX</strong><code>{`<Scene progress={frame} />`}</code>
            </div>
            <i className="k2-path-arrow">→</i>
            <div className="k2-path-node">
              <span>GATE 01</span><strong>Compile</strong><small>esbuild parses JSX</small>
            </div>
            <i className="k2-path-arrow">→</i>
            <div className="k2-path-node">
              <span>GATE 02</span><strong>Inspect</strong><small>known runtime hazards</small>
            </div>
            <i className="k2-path-arrow">→</i>
            <div className="k2-path-node k2-node-compose">
              <span>OUTPUT</span><strong>Compose</strong><small>join the timeline</small>
            </div>
            <div className="k2-mcp-branch">
              <span className="k2-branch-line" />
              <div>
                <span>MCP SUBMISSIONS ONLY</span>
                <strong>3-frame smoke render</strong>
                <div className="k2-three-frames"><i>0</i><i>½</i><i>1</i></div>
                <small>isolated worker · 5s ceiling</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="k2-act k2-output" data-k2-act="output" aria-labelledby="k2-output-title">
        <div className="k2-stage">
          <div className="k2-edge-signal" aria-hidden="true"><span /></div>
          <Chapter number="05" label="Preview · edit · render" />

          <div className="k2-heading">
            <h2 id="k2-output-title">The creator sees<br /><em>the real composition.</em></h2>
            <p>Chat on the left. Remotion player in the center. Scene controls and timeline around it.</p>
          </div>

          <div className="k2-studio-frame">
            <div className="k2-window-bar"><span>KALPANA STUDIO</span><span>PREVIEW READY</span></div>
            <div className="k2-studio-image">
              <Image
                src="/projects/kalpana.jpg"
                alt="KalpanaAI studio with AI chat, video preview, and scene editing controls"
                fill
                priority
                sizes="(max-width: 1023px) 94vw, 68vw"
                className="object-cover object-top"
              />
            </div>
            <div className="k2-studio-callouts" aria-hidden="true">
              <span className="k2-callout-chat">01 · Ask for a change</span>
              <span className="k2-callout-player">02 · Inspect the frame</span>
              <span className="k2-callout-timeline">03 · Tune the scene</span>
            </div>
            <div className="k2-render-progress"><span /><strong>RENDERED · MP4 READY</strong></div>
          </div>

          <div className="k2-output-action">
            <p>From one prompt to an editable, recoverable production workspace.</p>
            <a href={study.liveUrl} target="_blank" rel="noreferrer">Open live product <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </div>
  );
}
