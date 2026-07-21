import type { Metadata } from "next";
import { Archivo, Big_Shoulders, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { site } from "@/lib/data";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  display: "swap",
  // this Next release has no CLS-override metrics for the consolidated
  // "Big Shoulders" family; --font-display falls back to Archivo instead
  adjustFontFallback: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = "https://jeetsoni.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jeet Soni · AI Engineer · Agentic Systems & RAG",
  description:
    "AI Engineer with 5+ years across full-stack and applied AI. Founding engineer of an enterprise agent platform; 10+ production GenAI agents across finance, legal, media, real estate and travel. Next.js · TypeScript · Python · MCP · RAG.",
  keywords: [
    "Jeet Soni",
    "Jeet Adeshara",
    "Jeet Soni Ahmedabad",
    "Jeet Soni AI Engineer",
    "Jeet Soni AvestaLabs",
    "AI Engineer",
    "LLM",
    "AI Agents",
    "RAG",
    "MCP",
    "Next.js",
  ],
  authors: [{ name: "Jeet Soni", url: SITE_URL }],
  creator: "Jeet Soni",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Jeet Soni · AI Engineer",
    description:
      "I build AI agents that survive production. 5+ years · 10+ production GenAI agents · founding engineer of an enterprise agent platform.",
    type: "website",
    url: SITE_URL,
    siteName: "Jeet Soni",
    locale: "en_US",
    images: [{ url: "/jeet.jpg", width: 1200, height: 1200, alt: "Jeet Soni" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeet Soni · AI Engineer",
    description:
      "I build AI agents that survive production. 5+ years · 10+ production GenAI agents.",
    images: ["/jeet.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: SITE_URL,
  image: `${SITE_URL}/jeet.jpg`,
  jobTitle: site.role,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "AvestaLabs",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Marwadi University",
  },
  sameAs: [
    site.socials.github,
    site.socials.linkedin,
    site.socials.instagram,
    site.socials.synapbyte,
    site.socials.youtube,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${bigShoulders.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="grain">{children}</body>
      {/* production-only so local dev sessions don't pollute visitor data */}
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-GWRS9013P5" />
      )}
    </html>
  );
}
