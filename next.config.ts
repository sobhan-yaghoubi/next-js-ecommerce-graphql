import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.jensetjoor.com",
        pathname: "/media/**",
      },
    ],
  },
}

export default nextConfig
