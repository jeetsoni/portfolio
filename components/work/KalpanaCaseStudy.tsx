import { kalpanaCaseStudy as study } from "@/lib/case-studies/kalpana-ai";
import CaseStudyMotion from "./CaseStudyMotion";
import KalpanaScrollStory from "./KalpanaScrollStory";

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export default function KalpanaCaseStudy() {
  return (
    <main className="case-study relative isolate overflow-clip bg-ink text-bone">
      <CaseStudyMotion />
      <div className="case-progress" aria-hidden="true" />

      <header className="ks-nav">
        <nav aria-label="Case study navigation">
          <a href="/#work" className="ks-nav-back">
            <span aria-hidden="true">←</span>
            <span>Selected work</span>
          </a>
          <span className="ks-nav-id">KalpanaAI · System 01</span>
          <a href={study.liveUrl} target="_blank" rel="noreferrer" className="ks-nav-live">
            Live product <Arrow external />
          </a>
        </nav>
      </header>

      <KalpanaScrollStory />

      <section className="ks-technical" aria-labelledby="technical-title">
        <div className="ks-technical-heading">
          <p>Optional technical depth</p>
          <h2 id="technical-title">Under<br />the hood.</h2>
          <p>
            Open the appendix for exact architecture, reliability mechanisms, tradeoffs, and the
            evidence boundary. The main story stays focused on how the product feels and behaves.
          </p>
        </div>

        <details className="ks-appendix">
          <summary>
            <span>Open architecture and decision record</span>
            <span aria-hidden="true">+</span>
          </summary>

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
                <h3 id="appendix-reliability">Failure is bounded,<br />not denied.</h3>
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
        </details>
      </section>

      <footer className="ks-footer">
        <p>KalpanaAI · Founder case study · 2026</p>
        <div>
          <a href={study.liveUrl} target="_blank" rel="noreferrer">Live product <Arrow external /></a>
          <a href={study.githubUrl} target="_blank" rel="noreferrer">GitHub profile <Arrow external /></a>
          <a href="/#work">Selected work <Arrow /></a>
        </div>
      </footer>
    </main>
  );
}
