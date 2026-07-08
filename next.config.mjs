/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  devIndicators: false,
  basePath: '/3d-portfolio',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: import.meta.dirname,
  },
}

export default nextConfig
