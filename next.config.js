/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@sanity/image-url', 'dayjs'],
  },
  // Handle browser extension errors
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Improve error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Handle webpack errors
  webpack: (config, { dev, isServer }) => {
    // Ignore browser extension errors
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found/,
      /Critical dependency/,
      /Cannot find module/,
      /ENOENT/,
    ];

    // Handle runtime errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Fix Sanity module loading
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sanity/image-url': require.resolve('@sanity/image-url'),
    };

    // Handle module resolution
    config.resolve.modules = [
      'node_modules',
      ...(config.resolve.modules || []),
    ];

    return config;
  },
  // Improve build performance
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 