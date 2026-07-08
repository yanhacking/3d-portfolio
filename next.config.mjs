/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: import.meta.dirname,
  },
}

export default nextConfig
