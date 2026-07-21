import type { Metadata } from "next";
import DicomCaseStudy from "@/components/work/DicomCaseStudy";

export const metadata: Metadata = {
  title: "DICOM Viewer + PACS Case Study · Jeet Soni",
  description:
    "How Jeet Soni built a complete radiology imaging chain solo: an offline-first edge gateway, a multi-tenant DICOMweb PACS, a GPU-adaptive browser viewer, and an agentic AI reader that drives the viewer itself.",
  alternates: {
    canonical: "/work/dicom-viewer/",
  },
  openGraph: {
    title: "DICOM Viewer + PACS · From the scanner to the signed report",
    description:
      "An evidence-based engineering case study: edge gateway, pure-DICOMweb archive, device-adaptive rendering, and an AI agent whose tools execute in the browser.",
    type: "article",
    url: "/work/dicom-viewer/",
    images: [
      {
        url: "/projects/dicom.jpg",
        alt: "DICOM viewer 3D workspace with MPR slices and a volume-rendered head CT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DICOM Viewer + PACS · Engineering case study",
    description:
      "From the scanner to the signed report: one system owns the chain. Verified architecture, reliability mechanisms and code receipts.",
    images: ["/projects/dicom.jpg"],
  },
};

export default function DicomViewerPage() {
  return <DicomCaseStudy />;
}
