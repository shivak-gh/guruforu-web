/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Reduce JavaScript bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for static generation
  experimental: {
    optimizePackageImports: ['next'],
    // Reduce RSC payload size
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Allow external scripts for reCAPTCHA
  async headers() {
    return [
      {
        // Security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://*.google.com https://www.gstatic.com https://*.gstatic.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://ssl.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google.com https://*.google.com; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com;",
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // HTML pages: CDN cache for 1 hour, browser cache for 5 minutes, stale-while-revalidate
        // Note: Next.js handles HTML caching via revalidate, but we add headers for CDN/browser
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/contact',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/terms',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/privacy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/shipping',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/cancellation-refunds',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Static assets: Long-term caching (1 year, immutable)
        source: '/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // CSS/JS bundles: Long-term caching (1 year, immutable)
        source: '/:path*\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.js static files (_next/static): Long-term caching
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

