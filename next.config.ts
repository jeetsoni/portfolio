import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // fully static site: export to /out and serve with a tiny static server
  output: "export",
};

export default nextConfig;
