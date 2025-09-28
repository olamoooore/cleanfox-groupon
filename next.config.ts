import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable asset optimization and cache control
  poweredByHeader: false,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // Compress responses
  compress: true,
  
  // Asset optimization
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Cache control headers
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images for 1 week
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache API routes for 5 minutes with revalidation
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        // HTML pages - cache for 1 hour with revalidation
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=300',
          },
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
  
  // Webpack configuration for better caching
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Add content hash to chunk names for better cache busting
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            ...config.optimization.splitChunks.cacheGroups.default,
            name: false,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
