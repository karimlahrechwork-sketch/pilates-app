/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.EXPORT_STATIC === 'true' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
