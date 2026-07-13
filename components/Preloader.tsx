"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const bootLines = [
  "$ init jeet.adeshara",
  "› loading agents............ok",
  "› rag pipeline.............ok",
  "› guardrails...............ok",
  "› deploying portfolio......ok",
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = root.current!.querySelectorAll<HTMLElement>(".boot-line");
    const counter = root.current!.querySelector<HTMLElement>(".boot-counter");
    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    const progress = { n: 0 };
    tl.to(lines, { opacity: 1, duration: 0.01, stagger: 0.16 })
      .to(root.current, { opacity: 1, duration: 0.2 }, 0)
      .to(
        progress,
        {
          n: 100,
          duration: 0.95,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(progress.n));
          },
        },
        0
      )
      .to(root.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        delay: 0.25,
      });

    // hard fallback: never let the preloader trap the page (throttled rAF,
    // background tabs, reduced-motion browsers)
    const failsafe = window.setTimeout(() => setDone(true), 2800);

    document.documentElement.style.overflow = "hidden";
    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[999] flex items-end justify-between bg-ink p-6 md:p-10"
    >
      <span className="absolute right-5 top-5 font-sans text-5xl font-black tracking-tight text-bone/90 md:bottom-10 md:right-10 md:top-auto md:text-9xl">
        <span className="boot-counter">0</span>
        <span className="text-signal">%</span>
      </span>
      <div className="font-mono text-xs leading-relaxed text-bone-dim md:text-sm">
        {bootLines.map((l, i) => (
          <p key={i} className="boot-line opacity-0">
            {l.includes("ok") ? (
              <>
                {l.replace("ok", "")}
                <span className="text-live">ok</span>
              </>
            ) : (
              <span className="text-signal">{l}</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
