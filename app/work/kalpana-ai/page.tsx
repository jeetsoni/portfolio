import type { Metadata } from "next";
import KalpanaCaseStudy from "@/components/work/KalpanaCaseStudy";

export const metadata: Metadata = {
  title: "KalpanaAI Case Study · Jeet Soni",
  description:
    "How Jeet Soni designed KalpanaAI as a durable AI video production system: layered architecture, queued orchestration, replayable progress, generated-code validation, and failure recovery.",
  alternates: {
    canonical: "/work/kalpana-ai/",
  },
  openGraph: {
    title: "KalpanaAI · Production AI Video System",
    description:
      "An evidence-based engineering case study covering product decisions, layered architecture, reliability, generated-code safety, and repository evolution.",
    type: "article",
    url: "/work/kalpana-ai/",
    images: [
      {
        url: "/projects/kalpana.jpg",
        alt: "KalpanaAI video creation studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KalpanaAI · Production AI Video System",
    description:
      "From one prompt to a recoverable AI video pipeline—architecture, tradeoffs, and implementation evidence.",
    images: ["/projects/kalpana.jpg"],
  },
};

export default function KalpanaAIPage() {
  return <KalpanaCaseStudy />;
}
