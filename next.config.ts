import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "artegani.ro",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
        pathname: "/plus-assets/img/logos/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
        pathname: "/plus-assets/img/ecommerce-images/**",
      },
    ],
  },
};

export default nextConfig;
