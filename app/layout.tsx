import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeet Adeshara · AI Engineer · Agentic Systems & RAG",
  description:
    "AI Engineer with 5+ years across full-stack and applied AI. Founding engineer of an enterprise agent platform; 10+ production GenAI agents across finance, legal, media, real estate and travel. Next.js · TypeScript · Python · MCP · RAG.",
  keywords: [
    "AI Engineer",
    "LLM",
    "AI Agents",
    "RAG",
    "MCP",
    "Next.js",
    "Jeet Adeshara",
    "Jeet Soni",
  ],
  openGraph: {
    title: "Jeet Adeshara · AI Engineer",
    description:
      "I build AI agents that survive production. 5+ years · 10+ production GenAI agents · founding engineer of an enterprise agent platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
