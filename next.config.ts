module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Necessário para rodar em contêineres Docker
  experimental: {
    outputFileTracing: true,
  },
};
