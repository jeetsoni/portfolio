"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/data";
import Magnetic from "./Magnetic";

/**
 * The screenshot leans toward the cursor in 3D, like the card is a pane of
 * glass tracking your position — subtle, resets to flat on leave.
 */
function ProjectFigure({ p }: { p: Project }) {
  const frame = useRef<HTMLElement>(null);

  if (!p.image) return null;

  const onMove = (e: React.MouseEvent) => {
    const el = frame.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 8,
      rotateX: py * -8,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const onLeave = () => {
    gsap.to(frame.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <figure
      ref={frame}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group/frame relative self-center overflow-hidden border hairline bg-ink-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] will-change-transform lg:rotate-[1.2deg]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={p.image}
          alt={p.imageAlt ?? p.title}
          fill
          sizes="(max-width: 1024px) 90vw, 45vw"
          className="object-cover object-top transition-transform duration-700 group-hover/frame:scale-[1.04]"
        />
      </div>
    </figure>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const panel = useRef<HTMLDivElement>(null);

  // Lenis swallows wheel events page-wide, so the text panel can't be
  // wheel-scrolled when it overflows on short screens. data-lenis-prevent
  // fixes that, but only toggled on while overflowing — kept permanently it
  // would dead-zone page scrolling under the cursor on tall screens.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const sync = () =>
      el.toggleAttribute("data-lenis-prevent", el.scrollHeight > el.clientHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <article className="project-card relative flex h-full w-[87vw] shrink-0 snap-center flex-col border-l hairline px-5 py-14 md:w-[88vw] md:snap-align-none md:px-14 md:py-6 lg:w-[80vw] xl:w-[74vw]">
      {/* header band: status left, index right, both in flow so they can never collide */}
      <div className="mb-6 flex items-end justify-between gap-6 border-b hairline pb-4 md:mb-8">
        <div className="flex items-center gap-3 pb-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              p.status === "LIVE" ? "live-dot bg-live" : "bg-signal"
            }`}
          />
          <span className="mono-label">{p.status}</span>
        </div>
        <span className="text-outline-num pointer-events-none select-none font-display text-[clamp(4rem,7.5vw,8.5rem)] font-extrabold leading-[0.78]">
          {p.index}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div ref={panel} className="card-scroll relative min-h-0 max-w-2xl self-stretch overflow-y-auto pr-3">
          <h3 className="font-sans text-4xl font-black tracking-tight md:text-5xl">
            {p.title}
          </h3>
          <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-signal-soft">
            {p.kicker}
          </p>

          <p className="mt-3 leading-snug text-bone-dim">{p.description}</p>

          <ul className="mt-3 space-y-1">
            {p.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm leading-snug text-bone-dim/90">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="border hairline px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-bone-dim"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            {p.caseStudyHref && (
              <Magnetic strength={0.18}>
                <a
                  href={p.caseStudyHref}
                  data-cursor-label="READ"
                  className="group inline-flex items-center gap-4 bg-signal px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bone"
                >
                  Read case study
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
            )}

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                data-cursor-label="OPEN"
                className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-bone-dim transition-colors hover:text-signal"
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
        </div>

        <ProjectFigure p={p} />
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
    <section ref={root} id="work" className="section-bleed overflow-hidden border-t hairline md:flex md:h-[100svh] md:flex-col">
      <div className="shrink-0 px-5 pt-24 md:px-10 md:pt-16">
        <h2 className="sr-only">Selected Builds</h2>
        <p className="mono-label mb-8 md:hidden">Swipe the cards →</p>
      </div>

      <div
        ref={track}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto md:min-h-0 md:w-max md:flex-1 md:snap-none md:overflow-visible"
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
            data-cursor-label="OPEN"
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
