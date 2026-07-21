"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/data";
import Magnetic from "./Magnetic";

const NeuralField = dynamic(() => import("@/components/three/NeuralField"), {
  ssr: false,
});

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  useGSAP(
    () => {
      // drive the particle morph with scroll across hero + the section after it
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=250%",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // headline rises as the particle-name disperses into the field.
      // Mobile skips most of the cinematic hold: the headline is the LCP,
      // and budget phones already pay a JS-arrival tax before this runs.
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const wordDelay = reduced ? 0.3 : mobile ? 0.9 : 3.1;

      gsap.to(".hero-word > span", {
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay: wordDelay,
      });

      gsap.to(".hero-fade", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: wordDelay + 0.5,
      });

      // content drifts up & fades as you leave the hero
      gsap.to(".hero-content", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 25%",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <NeuralField scrollRef={scrollProgress} />
      </div>

      {/* vignette so type stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-ink)_92%)]" />

      <div className="hero-content relative z-10 flex h-full flex-col px-5 pb-8 pt-24 md:px-10">
        <div className="my-auto select-none">
          <p className="hero-fade will-reveal mono-label mb-5 translate-y-3 text-signal">
            AI ENGINEER · AGENTIC SYSTEMS
          </p>
          <h1 className="font-sans text-[clamp(3.2rem,12.5vw,11.5rem)] font-black uppercase leading-[0.86] tracking-[-0.02em]">
            <span className="hero-word split-word"><span>Jeet</span></span>{" "}
            <span className="hero-word split-word text-outline"><span>Soni</span></span>
          </h1>
          <p className="hero-fade will-reveal mt-7 max-w-xl translate-y-3 text-lg leading-relaxed text-bone-dim md:text-xl">
            I build <span className="font-semibold text-bone">AI agents</span> that
            survive production, and the{" "}
            <span className="font-semibold text-bone">platforms</span> they run on.
          </p>
        </div>

        <div className="hero-fade will-reveal flex translate-y-3 gap-6">
          <Magnetic strength={0.4}>
            <a href={site.socials.github} target="_blank" rel="noreferrer" className="mono-label transition-colors hover:text-signal">GitHub</a>
          </Magnetic>
          <Magnetic strength={0.4}>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="mono-label transition-colors hover:text-signal">LinkedIn</a>
          </Magnetic>
          <Magnetic strength={0.4}>
            <a href={site.socials.youtube} target="_blank" rel="noreferrer" className="mono-label transition-colors hover:text-signal">YouTube</a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
