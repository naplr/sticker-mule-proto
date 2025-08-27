import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['stickermule.com', 'press.stickermule.com', 'storage.googleapis.com'],
  },
  output: 'standalone',
};

export default nextConfig;
