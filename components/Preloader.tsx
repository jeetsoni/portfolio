"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Boot veil: the JS_ mark plus a thin signal bar that tracks *actual*
 * readiness (fonts + window load, capped). No fake terminal, no invented
 * percentages. Shows once per session; reduced-motion users skip it.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("js-booted")) {
      setDone(true);
      return;
    }
    // mark at show time — once per session means once *shown*, not once
    // finished, so a janky first paint can never replay it
    sessionStorage.setItem("js-booted", "1");

    let alive = true;
    const tweens: gsap.core.Animation[] = [];
    document.documentElement.style.overflow = "hidden";

    // perceived progress while real work happens
    tweens.push(gsap.to(bar.current, { scaleX: 0.75, duration: 0.9, ease: "power2.out" }));

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((res) => window.addEventListener("load", () => res(), { once: true }));
    const cap = new Promise<void>((res) => setTimeout(res, 1200));

    Promise.race([Promise.all([document.fonts.ready, loaded]).then(() => {}), cap]).then(() => {
      if (!alive) return;
      tweens.push(
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(bar.current, { scaleX: 1, duration: 0.2, ease: "power2.in" })
          .to(root.current, { yPercent: -100, duration: 0.6, ease: "power4.inOut", delay: 0.1 })
      );
    });

    // never trap the page
    const failsafe = window.setTimeout(() => setDone(true), 3500);

    return () => {
      alive = false;
      tweens.forEach((t) => t.kill());
      window.clearTimeout(failsafe);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useLayoutEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[999] grid place-items-center bg-ink"
      aria-hidden
    >
      <div className="flex flex-col items-center gap-6">
        <span className="font-mono text-2xl tracking-widest text-bone">
          JS<span className="live-dot text-signal">_</span>
        </span>
        <div className="h-px w-40 overflow-hidden bg-bone/15">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-signal" />
        </div>
      </div>
    </div>
  );
}
