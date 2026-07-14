"use client";

import { gsap, useGSAP } from "@/lib/gsap";

const CINEMATIC_LAYOUT =
  "(min-width: 1100px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

export default function CaseStudyMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>(".case-study");
    const story = root?.querySelector<HTMLElement>(".k2-story");
    if (!root || !story) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".case-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });

    mm.add(CINEMATIC_LAYOUT, () => {
      const createTimeline = (name: string, scrub: boolean | number = 0.55) => {
        const act = story.querySelector<HTMLElement>(`[data-k2-act="${name}"]`);
        if (!act) return null;
        return {
          q: gsap.utils.selector(act),
          timeline: gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: act,
              start: "top top",
              end: "bottom bottom",
              scrub,
            },
          }),
        };
      };

      const compose = createTimeline("compose");
      if (compose) {
        const { q, timeline } = compose;
        timeline
          .to(q(".k2-edge-signal span"), { scaleY: 1, duration: 1.8 }, 0)
          .to(q(".k2-composer-field i"), { x: 42, duration: 0.55, repeat: 1, yoyo: true }, 0.2)
          .to(q(".k2-create-action"), { backgroundColor: "#ff4d00", color: "#0d0c0a", duration: 0.35 }, 0.65)
          .from(q(".k2-job-created"), { y: 42, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 0.82)
          .to(q(".k2-composer"), { y: -24, scale: 0.98, duration: 0.75 }, 1.15);
      }

      const journey = createTimeline("journey", true);
      if (journey) {
        const { q, timeline } = journey;
        const phases = gsap.utils.toArray<HTMLElement>(q("[data-k2-phase]"));
        const stops = gsap.utils.toArray<HTMLElement>(q("[data-k2-phase-stop]"));

        gsap.set(phases.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(stops, { opacity: 0.3 });
        gsap.set(stops[0], { opacity: 1 });

        timeline.to(q(".k2-edge-signal span"), { scaleY: 1, duration: 4.5 }, 0);
        phases.forEach((phase, index) => {
          const at = index * 0.9;
          if (index > 0) {
            timeline
              .set(phases[index - 1], { autoAlpha: 0, y: 0 }, at)
              .set(phase, { autoAlpha: 1, y: 0 }, at);
          }
          timeline.to(stops[index], { opacity: 1, duration: 0.2 }, at + 0.06);
        });

        timeline
          .from(q(".k2-script-sheet > div"), { x: 30, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, 0.1)
          .from(q(".k2-claim"), { scale: 0.92, duration: 0.35 }, 0.95)
          .from(q(".k2-audio-line i"), { scaleY: 0.08, stagger: 0.012, duration: 0.55 }, 1.85)
          .from(q(".k2-scene-row > div"), { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.45 }, 1.9)
          .from(q(".k2-phone-preview"), { scale: 0.82, duration: 0.45 }, 2.75)
          .to(q(".k2-scene-progress i b"), { scaleX: 1, duration: 0.5 }, 2.85)
          .from(q(".k2-render-card"), { scale: 0.9, duration: 0.4 }, 3.62);
      }

      const recovery = createTimeline("recovery", true);
      if (recovery) {
        const { q, timeline } = recovery;
        const states = gsap.utils.toArray<HTMLElement>(q("[data-k2-recovery]"));
        gsap.set(states.slice(1), { autoAlpha: 0, scale: 0.94 });

        timeline.to(q(".k2-edge-signal span"), { scaleY: 1, duration: 3.4 }, 0);
        states.forEach((state, index) => {
          const at = index * 0.9;
          if (index > 0) {
            timeline
              .set(states[index - 1], { autoAlpha: 0, scale: 1 }, at)
              .set(state, { autoAlpha: 1, scale: 1 }, at);
          }
        });
        timeline
          .to(q(".k2-worker-core i"), { scaleX: 1, duration: 0.6 }, 0.15)
          .from(q(".k2-checkpoint-core div span"), { y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.36 }, 1.9)
          .to(q(".k2-resume-core i"), { scaleX: 1, duration: 0.55 }, 2.85);
      }

      const validation = createTimeline("validation");
      if (validation) {
        const { q, timeline } = validation;
        timeline
          .to(q(".k2-edge-signal span"), { scaleY: 1, duration: 2.3 }, 0)
          .from(q(".k2-path-node, .k2-path-arrow"), { x: -28, autoAlpha: 0, stagger: 0.16, duration: 0.42, ease: "power2.out" }, 0.15)
          .from(q(".k2-branch-line"), { scaleY: 0, transformOrigin: "top", duration: 0.42 }, 1.15)
          .from(q(".k2-mcp-branch > div"), { y: 22, autoAlpha: 0, duration: 0.38 }, 1.38)
          .from(q(".k2-three-frames i"), { scale: 0.65, autoAlpha: 0, stagger: 0.12, duration: 0.32 }, 1.55)
          .to(q(".k2-node-compose"), { borderColor: "#ff4d00", backgroundColor: "rgba(255,77,0,.12)", duration: 0.45 }, 2.05);
      }

      const output = createTimeline("output");
      if (output) {
        const { q, timeline } = output;
        timeline
          .to(q(".k2-edge-signal span"), { scaleY: 1, duration: 2.2 }, 0)
          .from(q(".k2-studio-frame"), { clipPath: "inset(8% 18% 8% 18%)", scale: 0.96, duration: 0.85, ease: "power3.out" }, 0.1)
          .from(q(".k2-studio-callouts span"), { y: 20, autoAlpha: 0, stagger: 0.18, duration: 0.42 }, 0.68)
          .to(q(".k2-render-progress span"), { scaleX: 1, duration: 0.75 }, 1.28)
          .from(q(".k2-output-action > *"), { y: 28, autoAlpha: 0, stagger: 0.12, duration: 0.45 }, 1.55);
      }
    });

    return () => mm.revert();
  }, []);

  return null;
}
