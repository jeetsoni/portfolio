import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Code,
  GithubLogo,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/data";
import type { Chapter } from "./walkthrough";

type Rows<T> = readonly T[];

/** The fields both case studies (lib/case-studies/*) share; DICOM adds a hero shot. */
export type Study = {
  title: string;
  eyebrow: string;
  githubUrl: string;
  liveUrl: string;
  hero: { titleLines: Rows<string>; titleEm: string; sub: string; meta: Rows<{ label: string; value: string }> };
  shot?: { src: string; alt: string; caption: string };
  tldr: Rows<{ lead: string; text: string }>;
  flow: {
    heading: string;
    sub: string;
    legend: Rows<{ kind: string; label: string }>;
    stages: Rows<{ id: string; name: string; enum: string; kind: string; detail: string }>;
    note: string;
  };
  receipts: { heading: string; sub: string; items: Rows<{ file: string; tag: string; code: string; caption: string }> };
  proof: Rows<{ value: string; label: string; note: string }>;
  architecture: Rows<{ index: string; name: string; remit: string; detail: string; evidence: string }>;
  reliability: Rows<{ index: string; title: string; body: string; tag: string }>;
  decisions: Rows<{ number: string; title: string; context: string; decision: string; tradeoff: string }>;
  evolution: { heading: string; sub: string; phases: Rows<{ date: string; title: string; detail: string }> };
  evidence: { proves: Rows<string>; doesNotProve: Rows<string> };
};

const KIND_LABEL: Record<string, string> = {
  agent: "AI",
  gate: "Check",
  human: "Human",
  service: "System",
  output: "Output",
};

function Head({ id, no, label, title, sub }: { id: string; no: string; label: string; title: string; sub?: string }) {
  return (
    <header className="g-head">
      <p className="g-label">
        <span>{no}</span>
        {label}
      </p>
      <h2 id={id}>{title}</h2>
      {sub && <p className="cs-sub">{sub}</p>}
    </header>
  );
}

type Walkthrough = {
  heading: string;
  chapters: Chapter[];
  connect: { src: string; alt: string; callouts: string[]; closing: string };
  output: { title: string; em: string; lead: string };
};

export default function CaseStudy({
  study,
  image,
  imageAlt,
  next,
  walkthrough,
}: {
  study: Study;
  image: string;
  imageAlt: string;
  next: { title: string; href: string; kicker: string };
  walkthrough?: Walkthrough;
}) {
  const s = study;
  // sections number themselves in order, whichever optional ones are present
  let n = 0;
  const no = () => String(++n).padStart(2, "0");
  const shot = s.shot ?? { src: image, alt: imageAlt, caption: "" };

  return (
    <main className="cs" id="top">
      {/* ---------- hero ---------- */}
      <section className="cs-hero g-sec">
        <div className="cs-hero-grid">
          <div className="cs-hero-copy">
            <a href="/#work" className="cs-back">
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              All work
            </a>
            <p className="g-eyebrow cs-eyebrow">{s.eyebrow}</p>
            <h1>
              {s.hero.titleLines.map((l) => (
                <span key={l}>{l} </span>
              ))}
              <em>{s.hero.titleEm}</em>
            </h1>
            <div className="cs-hero-links">
              <a href={s.liveUrl} className="g-btn">
                Open the live product <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </a>
              <a href={s.githubUrl} className="g-btn g-btn-ghost">
                <GithubLogo size={18} weight="fill" aria-hidden="true" /> GitHub
              </a>
            </div>
          </div>
          <figure className="cs-shot">
            <div className="device">
              <img src={shot.src} alt={shot.alt} />
            </div>
            {shot.caption && <figcaption>{shot.caption}</figcaption>}
          </figure>
        </div>

        <p className="cs-lede">{s.hero.sub}</p>

        <dl className="cs-meta">
          {s.hero.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- tl;dr ---------- */}
      <section className="g-sec" aria-labelledby="tldr-title">
        <Head id="tldr-title" no={no()} label="In short" title="Four things to know." />
        <div className="cs-tldr">
          {s.tldr.map((t, i) => (
            <article key={t.lead} className="cs-card">
              <span className="cs-card-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.lead}</h3>
              <p>{t.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- product walkthrough (Idea to Motion) ---------- */}
      {walkthrough && (
        <section className="g-sec" aria-labelledby="walk-title">
          <Head id="walk-title" no={no()} label="Walkthrough" title={walkthrough.heading} />
          <div className="cs-walk">
            {walkthrough.chapters.map((c) => (
              <article key={c.no} className="cs-card cs-chapter">
                <p className="cs-chapter-no"><span>{c.no}</span>{c.label}</p>
                <h3>
                  {c.title} <em>{c.em}</em>
                </h3>
                <p>{c.lead}</p>
                {c.example && <p className="cs-chapter-example">{c.example}</p>}
                {c.detail && <p className="cs-chapter-detail">{c.detail}</p>}
                {c.steps && (
                  <ol className="cs-chapter-steps">
                    {c.steps.map((st) => (
                      <li key={st.title}>
                        <b>{st.title}</b>
                        {st.note && <small>{st.note}</small>}
                        {st.more && <small className="cs-step-more">{st.more}</small>}
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
          <div className="cs-card cs-connect">
            <div className="cs-connect-copy">
              <p className="cs-chapter-no"><span>05</span>Output</p>
              <h3>
                {walkthrough.output.title} <em>{walkthrough.output.em}</em>
              </h3>
              <p>{walkthrough.output.lead}</p>
              <ul className="cs-connect-callouts">
                {walkthrough.connect.callouts.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p>{walkthrough.connect.closing}</p>
            </div>
            <div className="device cs-connect-shot">
              <img src={walkthrough.connect.src} alt={walkthrough.connect.alt} loading="lazy" />
            </div>
          </div>
        </section>
      )}

      {/* ---------- proof numbers ---------- */}
      <section className="g-sec cs-proof-sec" aria-label="By the numbers">
        <div className="cs-proof">
          {s.proof.map((p) => (
            <div key={p.label} className="cs-proof-item">
              <b>{p.value}</b>
              <span>{p.label}</span>
              <small>{p.note}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- the pipeline ---------- */}
      <section className="g-sec" aria-labelledby="flow-title">
        <Head id="flow-title" no={no()} label="The pipeline" title={s.flow.heading} sub={s.flow.sub} />
        <ul className="cs-legend" aria-label="Legend">
          {s.flow.legend.map((l) => (
            <li key={l.kind} data-kind={l.kind}>
              <i aria-hidden="true" />
              {l.label}
            </li>
          ))}
        </ul>
        <ol className="cs-flow" data-draw>
          {s.flow.stages.map((st, i) => (
            <li key={st.id} data-kind={st.kind} style={{ ["--i" as string]: i }}>
              <span className="cs-flow-orb" aria-hidden="true">{st.id}</span>
              <div className="cs-flow-card">
                <p className="cs-flow-top">
                  <b>{st.name}</b>
                  <span className="cs-kind">{KIND_LABEL[st.kind] ?? st.kind}</span>
                </p>
                <code>{st.enum}</code>
                <p>{st.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="cs-note">{s.flow.note}</p>
      </section>

      {/* ---------- architecture ---------- */}
      <section className="g-sec" aria-labelledby="arch-title">
        <Head
          id="arch-title"
          no={no()}
          label="Architecture"
          title="Four layers, each with one job."
          sub="Exact architecture, the reliability mechanisms, and the decision record with tradeoffs stated, closing with the boundary of what this page does and does not claim."
        />
        <div className="cs-layers" data-draw>
          {s.architecture.map((a, i) => (
            <article key={a.name} className="cs-layer" style={{ ["--i" as string]: i }}>
              <span className="cs-layer-no">{a.index}</span>
              <div className="cs-layer-head">
                <h3>{a.name}</h3>
                <p>{a.remit}</p>
              </div>
              <p className="cs-layer-detail">{a.detail}</p>
              <code>{a.evidence}</code>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- reliability ---------- */}
      <section className="g-sec" aria-labelledby="rel-title">
        <Head id="rel-title" no={no()} label="Reliability" title="What keeps it standing when things fail." />
        <div className="cs-grid">
          {s.reliability.map((r) => (
            <article key={r.index} className="cs-card">
              <span className="cs-card-no">{r.index}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <span className="cs-tag">{r.tag}</span>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- receipts ---------- */}
      <section className="g-sec" aria-labelledby="code-title">
        <Head id="code-title" no={no()} label="Receipts" title={s.receipts.heading} sub={s.receipts.sub} />
        <div className="cs-code-grid">
          {s.receipts.items.map((r) => (
            <figure key={r.file} className="cs-code">
              <div className="cs-code-bar">
                <Code size={16} weight="bold" aria-hidden="true" />
                <span className="cs-code-file">{r.file}</span>
                <span className="cs-code-tag">{r.tag}</span>
              </div>
              <pre>
                <code>{r.code}</code>
              </pre>
              <figcaption>{r.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- decisions ---------- */}
      <section className="g-sec" aria-labelledby="dec-title">
        <Head id="dec-title" no={no()} label="Decisions" title="The calls that shaped it, and what they cost." />
        <div className="cs-decisions">
          {s.decisions.map((d) => (
            <article key={d.number} className="cs-card cs-decision">
              <p className="cs-decision-no">{d.number}</p>
              <h3>{d.title}</h3>
              <dl>
                <div><dt>Context</dt><dd>{d.context}</dd></div>
                <div><dt>Decision</dt><dd>{d.decision}</dd></div>
                <div><dt>Trade-off</dt><dd>{d.tradeoff}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- evolution ---------- */}
      <section className="g-sec" aria-labelledby="evo-title">
        <Head id="evo-title" no={no()} label="Build log" title={s.evolution.heading} sub={s.evolution.sub} />
        <ol className="cs-evo" data-draw style={{ ["--phases" as string]: s.evolution.phases.length }}>
          {s.evolution.phases.map((p, i) => (
            <li key={p.title} style={{ ["--i" as string]: i }} data-last={i === s.evolution.phases.length - 1 ? "1" : "0"}>
              <span className="cs-evo-orb" aria-hidden="true" />
              <p className="cs-evo-date">{p.date}</p>
              <h3>{p.title}</h3>
              <p>{p.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- evidence ---------- */}
      <section className="g-sec" aria-labelledby="ev-title">
        <Head id="ev-title" no={no()} label="Evidence" title="What this page proves, and what it does not." />
        <div className="cs-evidence">
          <div className="cs-card cs-ev-yes">
            <h3>Repository demonstrates</h3>
            <ul>
              {s.evidence.proves.map((t) => (
                <li key={t}><CheckCircle size={20} weight="fill" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="cs-card cs-ev-no">
            <h3>Not claimed without product data</h3>
            <ul>
              {s.evidence.doesNotProve.map((t) => (
                <li key={t}><XCircle size={20} weight="fill" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- next ---------- */}
      <section className="g-sec">
        <div className="cs-next">
          <a href={next.href} className="cs-card cs-next-card">
            <small>Next case study</small>
            <b>{next.title}</b>
            <span>{next.kicker}</span>
            <ArrowRight size={26} weight="bold" aria-hidden="true" />
          </a>
          <a href={`mailto:${site.email}`} className="cs-card cs-next-card cs-next-mail">
            <small>Building something similar?</small>
            <b>{site.email}</b>
            <span>{site.location}</span>
            <ArrowRight size={26} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
