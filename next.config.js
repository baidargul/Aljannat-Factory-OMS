/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['getpcsofts.info', 'www.vegrecipesofindia.com' ,'img.clerk.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
