"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/lib/data";

export default function StatsBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Counters are server-rendered at their real values (crawlers and
      // reader modes must never see "0+"). With JS + motion allowed, zero
      // them pre-paint and count up on entry.
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { n: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          n: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      });

      gsap.from(".stat-cell", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".stat-grid", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section-bleed relative border-y hairline bg-ink-2">
      <div className="stat-grid mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`stat-cell px-6 py-10 md:px-10 md:py-14 ${
              i > 0 ? "md:border-l hairline" : ""
            } ${i % 2 === 1 ? "border-l hairline md:border-l" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""}`}
          >
            <p className="font-display text-5xl font-extrabold sm:text-6xl md:text-7xl">
              <span className="stat-value" data-value={s.value}>{s.value}</span>
              <span className="text-[0.55em] text-signal">{s.suffix}</span>
            </p>
            <p className="mono-label mt-3">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
