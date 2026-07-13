"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { marqueeItems, stats } from "@/lib/data";

export default function StatsBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { n: 0 };
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

  const row = [...marqueeItems, ...marqueeItems];

  return (
    <section ref={root} className="relative border-y hairline bg-ink-2">
      {/* dual-direction marquee */}
      <div className="overflow-hidden border-b hairline py-3">
        <div className="animate-marquee flex w-max items-center gap-8">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-bone-dim">
                {item}
              </span>
              <span className="text-signal">✳</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee-reverse mt-2 flex w-max items-center gap-8">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-outline font-sans text-sm font-black uppercase tracking-[0.18em]">
                {item}
              </span>
              <span className="text-bone-dim">✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* counters */}
      <div className="stat-grid mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`stat-cell px-6 py-10 md:px-10 md:py-14 ${
              i > 0 ? "md:border-l hairline" : ""
            } ${i % 2 === 1 ? "border-l hairline md:border-l" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""}`}
          >
            <p className="font-sans text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              <span className="stat-value" data-value={s.value}>0</span>
              <span className="text-[0.55em] text-signal">{s.suffix}</span>
            </p>
            <p className="mono-label mt-3">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
