"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skills } from "@/lib/data";
import SectionHeading from "./SectionHeading";

/**
 * The arsenal behaves like the hero's neural field: each chip is a node,
 * and the cursor is a signal that ignites nearby nodes with a distance
 * falloff. A one-time pulse sweeps the grid when the section enters.
 */
const RADIUS = 190;

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".skill-group", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".skill-wrap", start: "top 82%" },
      });

      const wrap = root.current;
      if (!wrap) return;
      const chips = gsap.utils.toArray<HTMLElement>(".skill-chip", wrap);
      const state = chips.map(() => ({ cur: 0, tgt: 0 }));

      // lerp each chip toward its target so ignition blooms and decays organically
      const tick = () => {
        for (let i = 0; i < chips.length; i++) {
          const s = state[i];
          if (s.cur === 0 && s.tgt === 0) continue;
          s.cur += (s.tgt - s.cur) * 0.14;
          if (s.cur < 0.001 && s.tgt === 0) s.cur = 0;
          chips[i].style.setProperty("--ignite", s.cur.toFixed(3));
        }
      };
      gsap.ticker.add(tick);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // entrance: one pulse of signal travels chip-to-chip across the grid
      if (!reduced) {
        gsap
          .timeline({
            scrollTrigger: { trigger: ".skill-wrap", start: "top 70%" },
          })
          .to(state, { tgt: 1, duration: 0.25, ease: "none", stagger: 0.028 })
          .to(state, { tgt: 0, duration: 0.5, ease: "none", stagger: 0.028 }, 0.3);
      }

      const onMove = (e: PointerEvent) => {
        for (let i = 0; i < chips.length; i++) {
          const r = chips[i].getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy);
          state[i].tgt = Math.max(0, 1 - d / RADIUS) ** 1.6;
        }
      };
      const onLeave = () => state.forEach((s) => (s.tgt = 0));

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
      }

      return () => {
        gsap.ticker.remove(tick);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeading index="05" label="Arsenal" />

      <div className="skill-wrap grid gap-14 md:grid-cols-2 md:gap-x-20">
        {skills.map((g) => (
          <div key={g.group} className="skill-group">
            <h3 className="mb-6 flex items-baseline gap-3 font-sans text-xl font-extrabold tracking-tight">
              {g.group}
              <span className="h-px flex-1 bg-bone/10" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {g.items.map((item) => (
                <span key={item} data-cursor className="skill-chip px-3.5 py-1.5 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
