/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { dev }) => {
      if (!dev) {
        config.stats = {
          warningsFilter: /serializing big strings/,
        };
      }
      return config;
    },
    reactStrictMode: true,
    distDir: 'dist',
  };

  module.exports = nextConfig;
  