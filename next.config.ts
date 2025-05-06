/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Necessário para rodar em contêineres Docker
};

module.exports = nextConfig;
