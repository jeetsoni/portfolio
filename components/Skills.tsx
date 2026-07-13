"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skills } from "@/lib/data";
import SectionHeading from "./SectionHeading";

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
                <span
                  key={item}
                  data-cursor
                  className="border hairline px-3.5 py-1.5 text-sm text-bone-dim transition-all duration-300 hover:border-signal hover:text-bone"
                >
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
