import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // fully static site: export to /out and serve with a tiny static server
  output: "export",
  images: {
    // static export has no image server to run the optimization API on;
    // next/image still gives us lazy loading, blur placeholders (for
    // statically imported assets) and layout-shift prevention without it.
    unoptimized: true,
  },
};

export default nextConfig;
