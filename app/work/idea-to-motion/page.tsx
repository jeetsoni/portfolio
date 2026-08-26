import type { Metadata } from "next";
import IdeaToMotionCaseStudy from "@/components/work/IdeaToMotionCaseStudy";
import { caseStudyJsonLd, JsonLd } from "@/lib/case-study-jsonld";

const PATH = "/work/idea-to-motion/";
const IMAGE = "/projects/idea-to-motion.jpg";

export const metadata: Metadata = {
  title: "Idea to Motion Case Study · Jeet Soni",
  description:
    "How Jeet Soni designed Idea to Motion as a durable AI video production system: layered architecture, queued orchestration, replayable progress, generated-code validation, and failure recovery.",
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: "Idea to Motion · Production AI Video System",
    description:
      "An evidence-based engineering case study covering product decisions, layered architecture, reliability, generated-code safety, and repository evolution.",
    type: "article",
    url: PATH,
    publishedTime: "2026-07-22T00:00:00.000Z",
    modifiedTime: "2026-08-27T00:00:00.000Z",
    authors: ["Jeet Soni"],
    images: [
      {
        url: IMAGE,
        width: 1600,
        height: 1000,
        alt: "Idea to Motion video creation studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Idea to Motion · Production AI Video System",
    description:
      "From one prompt to a recoverable AI video pipeline: architecture, tradeoffs, and implementation evidence.",
    images: [IMAGE],
  },
};

const jsonLd = caseStudyJsonLd({
  path: PATH,
  headline: "Idea to Motion",
  description:
    "A prompt-to-video production system built solo: a checkpointed eleven-stage pipeline, AI-written motion-graphics code behind validation gates, and the whole factory exposed over MCP.",
  image: IMAGE,
  datePublished: "2026-07-22",
  dateModified: "2026-08-27",
  keywords: [
    "AI video generation",
    "Remotion",
    "Model Context Protocol",
    "BullMQ",
    "Clean Architecture",
    "state machine",
    "generated code validation",
  ],
});

export default function IdeaToMotionPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <IdeaToMotionCaseStudy />
    </>
  );
}
