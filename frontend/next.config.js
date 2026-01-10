/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports
  trailingSlash: true, // Add trailing slashes to URLs
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // For GitHub Pages project sites, we need to set the asset prefix
  assetPrefix: '/todo-full-stack-web-application-with-neon-db',
};

module.exports = nextConfig;