"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, certification, site } from "@/lib/data";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // word-by-word ink reveal, scrubbed to scroll
      gsap.to(".about-word", {
        color: "var(--color-bone)",
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-intro",
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });

      gsap.from(".about-body p, .about-card", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".about-body", start: "top 82%" },
      });

      // portrait unmasks with a clip wipe
      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".about-card", start: "top 78%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <p className="about-intro max-w-5xl font-sans text-[clamp(1.6rem,3.4vw,3rem)] font-semibold leading-[1.25] tracking-tight">
        {about.intro.split(" ").map((w, i) => (
          <span key={i} className="about-word text-bone/15">
            {w}{" "}
          </span>
        ))}
      </p>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1.4fr_1fr] md:gap-20">
        <div className="about-body flex flex-col space-y-6 text-lg leading-relaxed text-bone-dim">
          {about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {/* pull-quote anchored to the bottom so the column matches the card height */}
          <div className="!mt-auto border-l-2 border-signal pl-6 pt-14 md:pl-8">
            <p className="font-display text-3xl font-extrabold uppercase leading-[0.95] text-bone md:text-5xl">
              Demos are easy.
              <br />
              <span className="text-signal">Production</span> is the product.
            </p>
            <p className="mono-label mt-5">Working philosophy</p>
          </div>
        </div>

        <aside className="about-card h-max space-y-6 border hairline bg-ink-2 p-7 md:p-8">
          <div className="about-photo group relative aspect-square overflow-hidden border hairline">
            <Image
              src="/jeet.jpg"
              alt="Jeet Soni"
              fill
              sizes="(max-width: 768px) 90vw, 32vw"
              className="grayscale object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div>
            <p className="mono-label mb-1">Base</p>
            <p className="text-bone">{site.location}</p>
          </div>
          <div className="border-t hairline pt-6">
            <p className="mono-label mb-2">Certified</p>
            <a
              href={certification.href}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <p className="font-semibold text-bone transition-colors group-hover:text-signal">
                {certification.title}
              </p>
              <p className="mt-1 text-sm text-bone-dim">{certification.org}</p>
              <p className="mt-3 font-mono text-xs text-bone-dim">
                Scored <span className="text-signal">{certification.score}</span>
              </p>
            </a>
          </div>
          <div className="border-t hairline pt-6">
            <p className="mono-label mb-1">Education</p>
            <p className="text-bone">B.Tech IT · Marwadi University</p>
            <p className="mt-1 text-sm text-bone-dim">CGPA 9.37 / 10</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
