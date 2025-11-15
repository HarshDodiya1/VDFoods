/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*", // match all /auth routes
        destination: "http://localhost:5000/auth/:path*", // your backend server
      },
    ];
  },
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "random-image-pepebigotes.vercel.app",
        pathname: "/api/random-image",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: ".next",
  output: 'standalone',
};

module.exports = nextConfig;
