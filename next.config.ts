import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Node server on Railway (next start): pages stay statically prerendered,
  // and /api/agent runs server-side so the AI Gateway key never ships to
  // the browser. trailingSlash preserves the URL shape of the old static
  // export (/work/idea-to-motion/) for canonicals, sitemap and inbound links.
  trailingSlash: true,
  images: {
    // keep images unoptimized as under the static export: no sharp
    // dependency, and next/image still provides lazy loading and
    // layout-shift prevention.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        // The product shipped as KalpanaAI and was renamed to Idea to Motion
        // (ideatomotion.com) in Aug 2026. /work/kalpana-ai/ is indexed and
        // linked from elsewhere, so it redirects permanently rather than 404s.
        source: "/work/kalpana-ai",
        destination: "/work/idea-to-motion/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
