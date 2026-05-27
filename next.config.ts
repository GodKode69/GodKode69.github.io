import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  basePath: "/GodKode69.github.io",
  assetPrefix: "/GodKode69.github.io/",
};

export default nextConfig;