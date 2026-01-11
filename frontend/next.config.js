/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports
  trailingSlash: true, // Add trailing slashes to URLs
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://todo-full-stack-web-application-with-neon-db-production.up.railway.app',
  },
  // For GitHub Pages project sites, we need to set the asset prefix and basePath
  basePath: '/todo-full-stack-web-application-with-neon-db',
  assetPrefix: '/todo-full-stack-web-application-with-neon-db',
};

module.exports = nextConfig;