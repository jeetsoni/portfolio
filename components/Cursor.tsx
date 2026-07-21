"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Functional cursor companion: a small signal square that trails the
 * pointer and, over elements carrying data-cursor-label, turns into a
 * verb chip (PLAY · OPEN · READ). It rides alongside the native cursor —
 * never replaces it — so pointer affordance is a layer, not a liability.
 */
export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const core = coreRef.current!;
    const label = labelRef.current!;

    const coreX = gsap.quickTo(core, "x", { duration: 0.18, ease: "power2.out" });
    const coreY = gsap.quickTo(core, "y", { duration: 0.18, ease: "power2.out" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.26, ease: "power2.out" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.26, ease: "power2.out" });

    const move = (e: MouseEvent) => {
      coreX(e.clientX - 5);
      coreY(e.clientY - 5);
      labelX(e.clientX + 18);
      labelY(e.clientY + 18);
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const labelled = el.closest<HTMLElement>("[data-cursor-label]");
      const interactive = labelled ?? el.closest("a, button");
      core.classList.toggle("is-active", !!interactive);
      if (labelled) {
        label.textContent = labelled.dataset.cursorLabel ?? "";
        label.classList.add("is-visible");
      } else {
        label.classList.remove("is-visible");
      }
    };

    // Cross-origin iframes (reels, the YouTube player) never dispatch
    // mousemove back to the parent document, so the companion would freeze
    // at the iframe's edge. If no mousemove reaches us for ~120ms, the
    // pointer is over an iframe (or off-window): fade out until it moves.
    let lastMove = performance.now();
    let hidden = false;
    const showOnMove = () => {
      lastMove = performance.now();
      if (hidden) {
        hidden = false;
        core.style.opacity = "1";
        label.style.opacity = "";
      }
    };
    const watchdog = window.setInterval(() => {
      if (!hidden && performance.now() - lastMove > 120) {
        hidden = true;
        core.style.opacity = "0";
        label.style.opacity = "0";
      }
    }, 100);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousemove", showOnMove, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", showOnMove);
      window.removeEventListener("mouseover", over);
      window.clearInterval(watchdog);
    };
  }, []);

  return (
    <>
      <div ref={coreRef} className="cursor-core hidden md:block" aria-hidden />
      <div ref={labelRef} className="cursor-label hidden md:block" aria-hidden />
    </>
  );
}
