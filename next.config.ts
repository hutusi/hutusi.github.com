import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hutusi.com",
        pathname: "/images/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
