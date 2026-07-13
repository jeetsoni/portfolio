# Jeet Adeshara — Portfolio

Personal portfolio for **Jeet Adeshara** — AI Engineer (Agentic Systems, RAG, Full-Stack).

Dark editorial design ("Signal & Ink"): warm charcoal, bone type, signal-orange accent.
A WebGL neural particle field morphs through three formations as you scroll the hero,
with smooth-scroll storytelling everywhere else.

## Stack

- **Next.js 15** (App Router, fully static) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Three.js + @react-three/fiber** — custom GLSL point-shader hero (6k particles, mouse-reactive, scroll-morphing)
- **GSAP + ScrollTrigger** — word reveals, scrubbed timelines, pinned horizontal project gallery, counters
- **Lenis** — smooth scrolling

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (static)
```

## Content

All copy lives in [`lib/data.ts`](lib/data.ts) — experience, projects, stats,
channels, skills. Edit that one file to update the site.

### Optional photo

Drop a portrait at `public/jeet.jpg` and wire it into `components/About.tsx`
if you want a photo in the About section.

## Deploy

Static output — deploys anywhere (Vercel recommended: `vercel deploy`).
