/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['getpcsofts.info', 'www.vegrecipesofindia.com' ,'img.clerk.com','aljannat.s3.ap-south-1.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
