"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/data";
import SectionHeading from "./SectionHeading";

function BrowserFrame({ p }: { p: Project }) {
  if (!p.image) return null;
  return (
    <div className="group/frame relative self-center overflow-hidden border hairline bg-ink-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 lg:rotate-[1.2deg] lg:hover:rotate-0">
      <div className="flex items-center gap-2 border-b hairline bg-ink-2 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-signal/70" />
        <span className="h-2 w-2 rounded-full bg-bone/25" />
        <span className="h-2 w-2 rounded-full bg-bone/25" />
        <span className="ml-3 truncate font-mono text-[0.6rem] tracking-wider text-bone-dim">
          {p.imageUrlBar}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt={p.imageAlt ?? p.title}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover/frame:scale-[1.04]"
      />
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="project-card relative flex h-full w-[87vw] shrink-0 snap-center flex-col border-l hairline px-5 py-14 md:w-[88vw] md:snap-align-none md:px-14 md:pb-14 md:pt-14 lg:w-[80vw] xl:w-[74vw]">
      {/* header band: status left, index right, both in flow so they can never collide */}
      <div className="mb-8 flex items-end justify-between gap-6 border-b hairline pb-5 md:mb-10">
        <div className="flex items-center gap-3 pb-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              p.status === "LIVE" ? "live-dot bg-live" : "bg-signal"
            }`}
          />
          <span className="mono-label">{p.status}</span>
        </div>
        <span className="text-outline-num pointer-events-none select-none font-sans text-[clamp(4rem,8vw,7rem)] font-black leading-[0.78]">
          {p.index}
        </span>
      </div>

      <span className="pointer-events-none absolute bottom-6 right-6 hidden select-none font-mono text-xs tracking-widest text-bone-dim md:block">
        {p.index} / 04
      </span>

      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="relative max-w-2xl">
          <h3 className="font-sans text-4xl font-black tracking-tight md:text-6xl">
            {p.title}
          </h3>
          <p className="font-serif-italic mt-2 text-lg text-signal-soft md:text-xl">
            {p.kicker}
          </p>

          <p className="mt-6 leading-relaxed text-bone-dim">{p.description}</p>

          <ul className="mt-6 space-y-2.5">
            {p.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-bone-dim/90">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="border hairline px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-bone-dim"
              >
                {s}
              </span>
            ))}
          </div>

          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-sm text-bone transition-colors hover:text-signal"
            >
              <span className="underline decoration-signal/50 underline-offset-8 group-hover:decoration-signal">
                {p.linkLabel}
              </span>
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          )}
        </div>

        <BrowserFrame p={p} />
      </div>
    </article>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // desktop: pin & scroll the track horizontally
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const getDistance = () => el.scrollWidth - window.innerWidth;

        gsap.to(el, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      // mobile: cards slide in staggered as the carousel enters view
      mm.add("(max-width: 767px)", () => {
        gsap.from(".project-card", {
          opacity: 0,
          x: 60,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: track.current, start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className="overflow-hidden border-t hairline">
      <div className="px-5 pt-24 md:px-10 md:pt-28">
        <SectionHeading index="03" label="Selected Builds" />
        <p className="mono-label mb-8 hidden md:block">
          Keep scrolling ↳ the gallery moves sideways
        </p>
        <p className="mono-label mb-8 md:hidden">Swipe the cards →</p>
      </div>

      <div
        ref={track}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto md:h-[calc(100vh-190px)] md:w-max md:snap-none md:overflow-visible"
      >
        {projects.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}

        {/* end card */}
        <div className="flex w-[70vw] shrink-0 snap-center items-center justify-center border-l hairline px-10 py-20 md:w-[38vw]">
          <a
            href="https://github.com/jeetsoni"
            target="_blank"
            rel="noreferrer"
            className="group text-center"
          >
            <p className="font-sans text-3xl font-black tracking-tight transition-colors group-hover:text-signal md:text-4xl">
              More on
              <br />
              GitHub
            </p>
            <p className="mono-label mt-4">github.com/jeetsoni ↗</p>
          </a>
        </div>
      </div>
    </section>
  );
}
