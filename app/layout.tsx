import type { Metadata } from "next";
import { Archivo, Big_Shoulders, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { site } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import PaletteLauncher from "@/components/palette/PaletteLauncher";
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
    // 1.91:1, the ratio every large social card crops to. jeet.jpg is square,
    // so sharing it as a large card cropped the frame down to his torso.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Jeet Soni, AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeet Soni · AI Engineer",
    description:
      "I build AI agents that survive production. 5+ years · 10+ production GenAI agents.",
    images: ["/og.jpg"],
  },
};

/*
 * One @graph rather than three loose blobs: the nodes cross-reference by @id,
 * so a crawler reads "this site is about this person, and this page is their
 * profile" instead of three unrelated assertions that happen to share a page.
 */
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  url: SITE_URL,
  image: absoluteUrl("/jeet.jpg"),
  jobTitle: site.role,
  description: site.headline,
  knowsAbout: [
    "AI agents",
    "Large language models",
    "Retrieval-augmented generation",
    "Model Context Protocol",
    "Agent orchestration",
    "TypeScript",
    "Next.js",
    "Python",
  ],
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
    site.socials.vlogs,
  ],
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    personNode,
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: `${site.name} · ${site.role}`,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      primaryImageOfPage: absoluteUrl("/og.jpg"),
    },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="grain">
        {children}
        <PaletteLauncher />
      </body>
      {/* production-only so local dev sessions don't pollute visitor data */}
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-GWRS9013P5" />
      )}
    </html>
  );
}
