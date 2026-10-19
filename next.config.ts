import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve resized WebP via sharp instead of originals (e.g. the 8.8 MB
    // max.png becomes a ~100 KB thumbnail per card).
    minimumCacheTTL: 3600,
    // Admins can paste external image URLs into settings, gallery, etc.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // The public newsletters page lives at /newsletters — send the
      // singular spelling there instead of a 404.
      { source: "/newsletter", destination: "/newsletters", permanent: false },
    ];
  },
};

export default nextConfig;
