import type { NextConfig } from "next"
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma", "puppeteer"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}
export default nextConfig
