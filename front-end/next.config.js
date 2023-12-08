/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com', 'localhost', 'storage.googleapis.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**',
        },
      ],
    },
    webpack: (config, { dev }) => {
      if (!dev) {
        config.stats = {
          warningsFilter: /serializing big strings/,
        };
      }
      return config;
    },
  };

  module.exports = nextConfig;
  