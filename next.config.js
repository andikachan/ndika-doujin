/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // ✅ Tambahkan ini untuk proxy API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.ndikacunk.my.id/:path*',
      },
    ];
  },
};

module.exports = nextConfig;