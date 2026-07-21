import Image from "next/image";
import { dicomCaseStudy as study } from "@/lib/case-studies/dicom";
import "./case-study.css";

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export default function DicomCaseStudy() {
  return (
    <main className="case-study relative isolate overflow-clip bg-ink text-bone">
      <header className="ks-nav">
        <nav aria-label="Case study navigation">
          <a href="/#work" className="ks-nav-back">
            <span aria-hidden="true">←</span>
            <span>Selected work</span>
          </a>
          <span className="ks-nav-id">DICOM Viewer + PACS · System 02</span>
          <a href={study.liveUrl} target="_blank" rel="noreferrer" className="ks-nav-live">
            Live product <Arrow external />
          </a>
        </nav>
      </header>

      {/* Plain-language opening */}
      <section className="ks-hero" aria-labelledby="ks-hero-title">
        <div className="ks-hero-inner">
          <p className="ks-hero-eyebrow">{study.eyebrow}</p>
          <h1 id="ks-hero-title">
            {study.hero.titleLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
            <em>{study.hero.titleEm}</em>
          </h1>
          <p className="ks-hero-sub">{study.hero.sub}</p>

          <div className="ks-hero-meta">
            {study.hero.meta.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>

          <div className="ks-hero-actions">
            <a href={study.liveUrl} target="_blank" rel="noreferrer">
              Open live product <Arrow external />
            </a>
            <a href="/#work">Back to selected work <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="ks-tldr" aria-labelledby="ks-tldr-title">
        <div className="ks-tldr-inner">
          <h2 id="ks-tldr-title">If you read nothing else</h2>
          <ul>
            {study.tldr.map((item) => (
              <li key={item.lead}>
                <strong>{item.lead}</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The reading room, in one frame */}
      <section className="ks-shot" aria-label="Product screenshot">
        <figure>
          <div className="ks-shot-frame">
            <Image
              src={study.shot.src}
              alt={study.shot.alt}
              fill
              priority
              sizes="(max-width: 1023px) 94vw, 72vw"
              className="object-cover object-top"
            />
          </div>
          <figcaption>{study.shot.caption}</figcaption>
        </figure>
      </section>

      {/* The chain, formalized */}
      <section className="ks-flow" aria-labelledby="ks-flow-title">
        <div className="ks-flow-inner">
          <div className="ks-flow-head">
            <h2 id="ks-flow-title">{study.flow.heading}</h2>
            <p>{study.flow.sub}</p>
          </div>
          <div className="ks-flow-legend" aria-hidden="true">
            {study.flow.legend.map((l) => (
              <span key={l.kind}>
                <i className={`ks-kind-${l.kind}`} /> {l.label}
              </span>
            ))}
          </div>
          <div className="ks-flow-list">
            {study.flow.stages.map((stage) => (
              <div key={stage.id} className="ks-flow-stage" data-kind={stage.kind}>
                <span>{stage.id}</span>
                <strong>{stage.name}</strong>
                <p>{stage.detail}</p>
                <code>{stage.enum}</code>
              </div>
            ))}
          </div>
          <p className="ks-flow-note">{study.flow.note}</p>
        </div>
      </section>

      <section className="ks-receipts" aria-labelledby="ks-receipts-title">
        <div className="ks-receipts-inner">
          <h2 id="ks-receipts-title">{study.receipts.heading}</h2>
          <p>{study.receipts.sub}</p>
          <div className="ks-receipts-grid">
            {study.receipts.items.map((r) => (
              <figure key={r.file} className="ks-receipt">
                <header>
                  <b>{r.tag}</b>
                  <span>{r.file}</span>
                </header>
                <pre>{r.code}</pre>
                <figcaption>{r.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ks-technical" aria-labelledby="technical-title">
        <div className="ks-technical-heading">
          <p>Technical depth</p>
          <h2 id="technical-title">Under<br />the hood.</h2>
          <p>
            Exact architecture, the reliability mechanisms, and the decision record with tradeoffs
            stated, closing with the boundary of what this page does and does not claim.
          </p>
        </div>

        <div className="ks-appendix">
          <div className="ks-appendix-body">
            <div className="ks-proof-strip" aria-label="Verified implementation facts">
              {study.proof.map((fact) => (
                <div key={fact.label}>
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                  <small>{fact.note}</small>
                </div>
              ))}
            </div>

            <section aria-labelledby="appendix-architecture">
              <div className="ks-appendix-intro">
                <span>A / Architecture</span>
                <h3 id="appendix-architecture">Four layers.<br />One protected workflow.</h3>
              </div>
              <div className="ks-appendix-list">
                {study.architecture.map((layer) => (
                  <article key={layer.name}>
                    <span>{layer.index}</span>
                    <div>
                      <h4>{layer.name}</h4>
                      <small>{layer.remit}</small>
                      <p>{layer.detail}</p>
                      <code>{layer.evidence}</code>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="appendix-reliability">
              <div className="ks-appendix-intro">
                <span>B / Reliability</span>
                <h3 id="appendix-reliability">Built for clinics,<br />not demos.</h3>
              </div>
              <div className="ks-appendix-list ks-appendix-list-two">
                {study.reliability.map((item) => (
                  <article key={item.index}>
                    <span>{item.index}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                      <code>{item.tag}</code>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="appendix-decisions">
              <div className="ks-appendix-intro">
                <span>C / Decision record</span>
                <h3 id="appendix-decisions">Explicit choices.<br />Visible tradeoffs.</h3>
              </div>
              <div className="ks-decision-list">
                {study.decisions.map((decision) => (
                  <article key={decision.number}>
                    <span>{decision.number}</span>
                    <h4>{decision.title}</h4>
                    <dl>
                      <div><dt>Context</dt><dd>{decision.context}</dd></div>
                      <div><dt>Decision</dt><dd>{decision.decision}</dd></div>
                      <div><dt>Tradeoff</dt><dd>{decision.tradeoff}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="appendix-evidence">
              <div className="ks-appendix-intro">
                <span>D / Evidence boundary</span>
                <h3 id="appendix-evidence">Credibility includes<br />what is not claimed.</h3>
              </div>
              <div className="ks-evidence-grid">
                <div>
                  <h4>Repository demonstrates</h4>
                  <ul>{study.evidence.proves.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <h4>Not claimed without product data</h4>
                  <ul>{study.evidence.doesNotProve.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="ks-build" aria-labelledby="ks-build-title">
        <div className="ks-build-inner">
          <h2 id="ks-build-title">{study.evolution.heading}</h2>
          <p>{study.evolution.sub}</p>
          <div className="ks-build-list ks-build-list-five">
            {study.evolution.phases.map((phase) => (
              <article key={phase.date}>
                <span>{phase.date}</span>
                <h3>{phase.title}</h3>
                <p>{phase.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="ks-footer">
        <p>DICOM Viewer + PACS · Solo-build case study · 2026</p>
        <div>
          <a href={study.liveUrl} target="_blank" rel="noreferrer">Live product <Arrow external /></a>
          <a href={study.githubUrl} target="_blank" rel="noreferrer">GitHub profile <Arrow external /></a>
          <a href="/#work">Selected work <Arrow /></a>
        </div>
      </footer>
    </main>
  );
}
