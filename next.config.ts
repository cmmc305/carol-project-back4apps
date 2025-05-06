/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Necessário para rodar em contêineres Docker
  experimental: {
    // outputFileTracing: true,
  },
};

module.exports = nextConfig;
