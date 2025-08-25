import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    ignoreDuringBuilds: true, // 🚀 disables ESLint check at build time
  },
  typescript: {
    ignoreBuildErrors: true, // 🚀 disables TypeScript type checking at build time
  },
};

export default nextConfig;
