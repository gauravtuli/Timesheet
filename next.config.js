/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
