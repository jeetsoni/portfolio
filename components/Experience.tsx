"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // rail draws itself as you scroll the list
      gsap.fromTo(
        ".exp-rail",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".exp-list",
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="experience"
      className="border-t hairline bg-ink-2"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeading index="02" label="Trajectory" />

        <div className="exp-list relative">
          <span className="exp-rail absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-signal via-signal/60 to-transparent" />

          <div className="space-y-20 pl-6 md:space-y-28 md:pl-16">
            {experience.map((job) => (
              <article key={job.company + job.period} className="exp-item relative">
                <span className="absolute -left-6 top-2.5 h-2 w-2 -translate-x-[3.5px] rounded-full bg-signal md:-left-16 md:top-3" />
                <p className="mono-label mb-3">{job.period}</p>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h3 className="font-sans text-3xl font-extrabold tracking-tight transition-colors duration-300 hover:text-signal md:text-5xl">
                    {job.company}
                  </h3>
                  <p className="font-serif-italic text-xl text-signal-soft md:text-2xl">
                    {job.role}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{job.place}</p>
                <ul className="mt-6 max-w-3xl space-y-3 text-bone-dim">
                  {job.points.map((pt, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="border hairline px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-bone-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
