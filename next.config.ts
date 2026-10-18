import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve resized WebP via sharp instead of originals (e.g. the 8.8 MB
    // max.png becomes a ~100 KB thumbnail per card).
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
