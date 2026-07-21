import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Node server on Railway (next start): pages stay statically prerendered,
  // and /api/agent runs server-side so the AI Gateway key never ships to
  // the browser. trailingSlash preserves the URL shape of the old static
  // export (/work/kalpana-ai/) for canonicals, sitemap and inbound links.
  trailingSlash: true,
  images: {
    // keep images unoptimized as under the static export: no sharp
    // dependency, and next/image still provides lazy loading and
    // layout-shift prevention.
    unoptimized: true,
  },
};

export default nextConfig;
