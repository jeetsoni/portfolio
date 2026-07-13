"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/data";
import Magnetic from "./Magnetic";
import LocalTime from "./LocalTime";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".contact-line > span", {
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".contact-fade", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.3,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contact" className="relative overflow-hidden border-t hairline">
      {/* signal glow anchored behind the headline */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,0,0.13),transparent_65%)]" />
      <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-between px-5 pb-10 pt-28 md:px-10 md:pt-40">
        <div>
          <div className="mb-12 flex items-baseline gap-4">
            <span className="font-mono text-lg font-bold text-signal">06</span>
            <span className="h-px w-10 self-center bg-signal/60" />
            <span className="mono-label">Signal</span>
          </div>

          <h2 className="font-sans text-[clamp(2.6rem,8vw,7.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
            <span className="contact-line split-word"><span>Let&apos;s ship</span></span>
            <br />
            <span className="contact-line split-word">
              <span>
                something <span className="font-serif-italic normal-case text-signal">real.</span>
              </span>
            </span>
          </h2>

          <p className="contact-fade mt-8 max-w-xl leading-relaxed text-bone-dim">
            Building an agent platform, wiring AI into a product, or hunting for an
            engineer who treats evals as seriously as demos? My inbox is open.
          </p>

          <div className="contact-fade mt-12">
            <Magnetic strength={0.2}>
              <a href={`mailto:${site.email}`} data-cursor className="group inline-block">
                <span className="font-sans text-[clamp(1.3rem,3.6vw,3rem)] font-bold tracking-tight text-bone transition-colors duration-300 group-hover:text-signal">
                  {site.email}
                </span>
                <span className="mt-2 block h-px w-full origin-left scale-x-100 bg-bone/25 transition-transform duration-500 group-hover:scale-x-0" />
              </a>
            </Magnetic>
          </div>
        </div>

        <footer className="mt-24 border-t hairline pt-8">
          <div className="mb-6">
            <LocalTime />
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["GitHub", site.socials.github],
                ["LinkedIn", site.socials.linkedin],
                ["Instagram", site.socials.instagram],
                ["SynapByte", site.socials.synapbyte],
                ["YouTube", site.socials.youtube],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="mono-label link-sweep transition-colors hover:text-signal"
                >
                  {label} ↗
                </a>
              ))}
            </div>
            <div className="text-right">
              <p className="mono-label">
                © {new Date().getFullYear()} {site.name}
              </p>
              <p className="mt-1 font-mono text-[0.6rem] tracking-widest text-muted">
                DESIGNED & ENGINEERED IN AHMEDABAD · NEXT.JS + THREE.JS + GSAP
              </p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
