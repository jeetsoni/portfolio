"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { educator } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import BroadcastDeck from "./BroadcastDeck";
import InstagramReels from "./InstagramReels";

/** The one inverted section: bone paper, ink text. */
export default function Educator() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".edu-head", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".edu-head", start: "top 82%" },
      });
      // the broadcast monitor rises in like the cards
      gsap.from(".edu-deck", {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".edu-deck", start: "top 82%" },
      });
      // cards unmask with a clip wipe
      gsap.utils.toArray<HTMLElement>(".edu-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: "inset(0 0 100% 0)", y: 24 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".edu-grid", start: "top 80%" },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="channel" className="section-seam-in section-seam-out bg-bone text-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeading index="04" label="Building in Public" tone="light" />

        <h2 className="edu-head max-w-4xl font-sans text-[clamp(2rem,4.5vw,3.8rem)] font-extrabold leading-[1.08] tracking-tight">
          One concept. One animation.{" "}
          <span className="font-serif-italic font-normal text-signal">
            One minute.
          </span>
        </h2>
        <p className="edu-head mt-6 max-w-2xl leading-relaxed text-ink/65">
          {educator.body}
        </p>

        <BroadcastDeck />
        <InstagramReels />

        <div className="edu-grid mt-14 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
          {educator.channels.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="edu-card group bg-bone p-8 transition-[background-color,transform] duration-300 hover:bg-[#f5f1e6] active:scale-[0.985]"
            >
              <p className="font-mono text-[0.675rem] uppercase tracking-[0.22em] text-ink/50">
                {c.platform}
              </p>
              <p className="mt-6 font-sans text-5xl font-black tracking-tight text-ink transition-colors group-hover:text-signal">
                {c.stat}
              </p>
              <p className="mt-1 font-mono text-[0.675rem] uppercase tracking-[0.22em] text-ink/50">
                {c.statLabel}
              </p>
              <p className="mt-6 font-mono text-sm text-ink">{c.name} ↗</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{c.desc}</p>
            </a>
          ))}
        </div>

        <ul className="mt-12 space-y-3">
          {educator.extras.map((e, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink/65">
              <span className="text-signal">✳</span>
              {e.href ? (
                <a
                  href={e.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  {e.text} ↗
                </a>
              ) : (
                e.text
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
