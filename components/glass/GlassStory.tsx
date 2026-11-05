"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { stages } from "./story";

const GlassScene = dynamic(() => import("./GlassScene"), { ssr: false });

const N = stages.length;
// one screen of overview, one per stage, plus the sticky viewport itself
const SCREENS = N + 2;

type Trace = { id: number; stage: number; at: string };

/** Sticky hero: scroll drives the camera through the eight stages. */
export default function GlassStory({ name }: { name: string }) {
  const root = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const focus = useRef(-1);
  const [f, setF] = useState(-1);
  const [trace, setTrace] = useState<Trace[]>([]);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = root.current;
      const vp = sticky.current;
      if (!el || !vp) return;
      const next = Math.max(-1, Math.min(N - 1 + 0.49, -el.getBoundingClientRect().top / vp.offsetHeight - 1));
      focus.current = next;
      setF((v) => (Math.abs(v - next) > 0.004 ? next : v));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onStage = useCallback((stage: number) => {
    const d = new Date();
    const at = `${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
    setTrace((prev) => [...prev.slice(-2), { id: d.getTime() + Math.random(), stage, at }]);
  }, []);

  const goTo = (i: number) => {
    const el = root.current;
    const vp = sticky.current;
    if (!el || !vp) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (i + 1) * vp.offsetHeight, behavior: "smooth" });
  };

  const intro = Math.max(0, Math.min(1, -f * 1.6 - 0.15));
  const active = f > -0.5 ? Math.round(Math.max(0, f)) : -1;
  const captionOpacity = active < 0 ? 0 : Math.max(0, 1 - Math.abs(f - active) * 2.6);

  return (
    <section ref={root} className="g-story" style={{ height: `calc(${SCREENS} * 100svh)` }} aria-label="How a request survives production">
      <div ref={sticky} className="g-sticky">
        <GlassScene focus={focus} onStage={onStage} />

        <div className="g-intro" style={{ opacity: intro, pointerEvents: intro > 0.2 ? "auto" : "none" }}>
          <h1>
            <span className="g-h1-name">{name}</span>{" "}
            I build AI agents that <span className="g-h1-em">survive production.</span>
          </h1>
          <p className="g-intro-sub">Scroll to follow one request through the systems I ship.</p>
          <div className="g-cue" aria-hidden="true"><i /></div>
        </div>

        <ol className="g-trace" aria-hidden="true" style={{ opacity: trace.length ? intro : 0 }}>
          {trace.map((l, i) => (
            <li key={l.id} data-new={i === trace.length - 1 ? "1" : "0"}>
              <span>{l.at}</span> <b>{stages[l.stage].label}</b> {stages[l.stage].log}
            </li>
          ))}
        </ol>

        {/* every caption is in the HTML (readable without JS and by crawlers);
            only the stage in focus is shown */}
        {stages.map((st, i) => {
          const on = i === active;
          return (
            <article
              key={st.id}
              className="g-caption"
              data-on={on ? "1" : "0"}
              style={{ opacity: on ? captionOpacity : 0, visibility: on ? "visible" : "hidden" }}
              aria-hidden={!on}
            >
              <p className="g-caption-step">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>/ {String(N).padStart(2, "0")}</span>
                <b>{st.part}</b>
              </p>
              <h2>{st.title}</h2>
              <p className="g-caption-body">{st.body}</p>
              <p className="g-caption-proof">
                <i aria-hidden="true" />
                {st.proof}
              </p>
            </article>
          );
        })}

        <nav className="g-rail" aria-label="Pipeline stages" style={{ opacity: active < 0 || f > N - 1 + 0.45 ? 0 : 1, pointerEvents: active < 0 ? "none" : "auto" }}>
          {stages.map((s, i) => (
            <button key={s.id} type="button" onClick={() => goTo(i)} data-on={i === active ? "1" : "0"} data-done={active > i ? "1" : "0"} aria-label={`Stage ${i + 1}: ${s.part}`}>
              <span>{s.part}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
