import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Bound explicitly prefetched pages to a short browser-only reuse window.
    staleTimes: {dynamic: 0, static: 30},
  },
};

export default nextConfig;
