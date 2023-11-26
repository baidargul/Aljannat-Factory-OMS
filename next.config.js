/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.vegrecipesofindia.com', 'img.clerk.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
