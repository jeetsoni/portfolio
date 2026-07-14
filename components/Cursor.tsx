"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX - 3);
      dotY(e.clientY - 3);
      ringX(e.clientX - 18);
      ringY(e.clientY - 18);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      ring.classList.toggle("is-hovering", !!target);
    };

    // Cross-origin iframes (Instagram reels, the YouTube player once playing)
    // never dispatch mousemove back to the parent document, so the custom
    // cursor would otherwise freeze wherever it last was — right at the
    // iframe's edge — while the iframe's own native cursor shows underneath.
    // relatedTarget on the mouseout event isn't a reliable signal here: it's
    // the <iframe> DOM node itself, not null, in most browsers, so per-event
    // detection is brittle. A watchdog is more robust: if no mousemove has
    // reached the parent document in ~120ms, the pointer must be over an
    // iframe (or off-window), so fade the cursor out until movement resumes.
    let lastMove = performance.now();
    let hidden = false;
    const showOnMove = () => {
      lastMove = performance.now();
      if (hidden) {
        hidden = false;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const watchdog = window.setInterval(() => {
      if (!hidden && performance.now() - lastMove > 120) {
        hidden = true;
        dot.style.opacity = "0";
        ring.style.opacity = "0";
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
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
