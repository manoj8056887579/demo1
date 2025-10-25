/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // If APP_URL isn't set (e.g. during local dev without a .env), fall back to localhost
    domains: [process.env.APP_URL ? new URL(process.env.APP_URL).hostname : 'localhost'],
   
  },
  devIndicators: false,
}

export default nextConfig
