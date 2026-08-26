import type { Metadata } from "next";
import DicomCaseStudy from "@/components/work/DicomCaseStudy";
import { caseStudyJsonLd, JsonLd } from "@/lib/case-study-jsonld";

const PATH = "/work/dicom-viewer/";
const IMAGE = "/projects/dicom.jpg";

export const metadata: Metadata = {
  title: "DICOM Viewer + PACS Case Study · Jeet Soni",
  description:
    "How Jeet Soni built a complete radiology imaging chain solo: an offline-first edge gateway, a multi-tenant DICOMweb PACS, a GPU-adaptive browser viewer, and an agentic AI reader that drives the viewer itself.",
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: "DICOM Viewer + PACS · From the scanner to the signed report",
    description:
      "An evidence-based engineering case study: edge gateway, pure-DICOMweb archive, device-adaptive rendering, and an AI agent whose tools execute in the browser.",
    type: "article",
    url: PATH,
    publishedTime: "2026-07-22T00:00:00.000Z",
    modifiedTime: "2026-07-22T00:00:00.000Z",
    authors: ["Jeet Soni"],
    images: [
      {
        url: IMAGE,
        width: 1400,
        height: 875,
        alt: "DICOM viewer 3D workspace with MPR slices and a volume-rendered head CT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DICOM Viewer + PACS · Engineering case study",
    description:
      "From the scanner to the signed report: one system owns the chain. Verified architecture, reliability mechanisms and code receipts.",
    images: [IMAGE],
  },
};

const jsonLd = caseStudyJsonLd({
  path: PATH,
  headline: "DICOM Viewer + PACS",
  description:
    "A complete radiology imaging chain built solo: scanners push to an offline-first edge gateway, studies land in a multi-tenant DICOMweb PACS, and an AI agent reads scans by driving the viewer itself.",
  image: IMAGE,
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  keywords: [
    "DICOM",
    "PACS",
    "DICOMweb",
    "Cornerstone3D",
    "medical imaging",
    "radiology",
    "agentic AI",
    "WebGL",
  ],
});

export default function DicomViewerPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <DicomCaseStudy />
    </>
  );
}
