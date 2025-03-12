/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGO_URI: process.env.MONGO_URIi,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
  },
  images: {
    domains: ['source.unsplash.com'],
  },
}

module.exports = nextConfig;