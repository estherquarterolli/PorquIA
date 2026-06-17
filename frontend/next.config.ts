import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Build estático para Firebase Hosting
  reactStrictMode: true,
  images: {
    unoptimized: true, // Necessário para export estático
  },
};

export default nextConfig;
