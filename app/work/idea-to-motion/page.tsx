import type { Metadata } from "next";
import IdeaToMotionCaseStudy from "@/components/work/IdeaToMotionCaseStudy";

export const metadata: Metadata = {
  title: "Idea to Motion Case Study · Jeet Soni",
  description:
    "How Jeet Soni designed Idea to Motion as a durable AI video production system: layered architecture, queued orchestration, replayable progress, generated-code validation, and failure recovery.",
  alternates: {
    canonical: "/work/idea-to-motion/",
  },
  openGraph: {
    title: "Idea to Motion · Production AI Video System",
    description:
      "An evidence-based engineering case study covering product decisions, layered architecture, reliability, generated-code safety, and repository evolution.",
    type: "article",
    url: "/work/idea-to-motion/",
    images: [
      {
        url: "/projects/idea-to-motion.jpg",
        alt: "Idea to Motion video creation studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Idea to Motion · Production AI Video System",
    description:
      "From one prompt to a recoverable AI video pipeline: architecture, tradeoffs, and implementation evidence.",
    images: ["/projects/idea-to-motion.jpg"],
  },
};

export default function IdeaToMotionPage() {
  return <IdeaToMotionCaseStudy />;
}
