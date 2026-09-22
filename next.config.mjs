/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ISR: every 6 hours rebuild server data
  experimental: {
    // keeps build small
  },
  // Use plain Node fetch (Node 18+ has global fetch)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;