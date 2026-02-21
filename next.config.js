/** @type {import('next').NextConfig} */
// Cache control: enabled by default so JS/CSS and static assets are cached (fixes uncached asset issues).
// Set DISABLE_CACHE=true in environment to disable caching (e.g. for debugging).
const DISABLE_CACHE = process.env.DISABLE_CACHE === 'true'

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
    // Enable image optimization
    minimumCacheTTL: 60,
    // Lazy load images by default
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configure allowed image qualities
    qualities: [75, 85],
    // Allow local images for Core Web Vitals optimization
    localPatterns: [{ pathname: '/**', search: '' }],
  },
  // Reduce JavaScript bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for static generation
  experimental: {
    // Optimize package imports to reduce bundle size (tree-shaking)
    optimizePackageImports: [
      'next',
      'react',
      'react-dom',
      '@getbrevo/brevo', // Only import what's needed
    ],
    // Reduce RSC payload size
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Allow external scripts for reCAPTCHA
  async headers() {
    const headers = [
      {
        // Security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://*.google.com https://www.gstatic.com https://*.gstatic.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://ssl.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google.com https://*.google.com https://*.gstatic.com; img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google.com; frame-src 'self' https://www.google.com https://*.google.com https://www.gstatic.com https://*.gstatic.com https://www.googletagmanager.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline' https://*.google.com https://*.gstatic.com; font-src 'self' data: https://*.google.com https://*.gstatic.com;",
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]

    // Add cache headers only if caching is enabled
    if (!DISABLE_CACHE) {
      const oneHour = 'public, s-maxage=3600, max-age=3600, stale-while-revalidate=86400'
      headers.push(
        {
          // HTML pages: cache for 1 hour (CDN and browser)
          source: '/',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/blog/:path*',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/contact',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/terms',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/privacy',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/shipping',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/cancellation-refunds',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/about',
          headers: [{ key: 'Cache-Control', value: oneHour }],
        },
        {
          source: '/free-session',
          headers: [{ key: 'Cache-Control', value: oneHour }],
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
        }
      )
    } else {
      // Disable caching - no-cache, no-store, must-revalidate for all routes
      const noCacheHeaders = [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        },
      ]

      // Apply no-cache to all HTML pages (caching disabled for all routes)
      headers.push(
        {
          source: '/',
          headers: noCacheHeaders,
        },
        {
          source: '/blog/:path*',
          headers: noCacheHeaders,
        },
        {
          source: '/contact',
          headers: noCacheHeaders,
        },
        {
          source: '/free-session',
          headers: noCacheHeaders,
        },
        {
          source: '/terms',
          headers: noCacheHeaders,
        },
        {
          source: '/privacy',
          headers: noCacheHeaders,
        },
        {
          source: '/shipping',
          headers: noCacheHeaders,
        },
        {
          source: '/cancellation-refunds',
          headers: noCacheHeaders,
        },
        {
          // Also disable caching for static assets when cache is disabled
          source: '/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate, max-age=0',
            },
          ],
        },
        {
          source: '/:path*\\.(css|js)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate, max-age=0',
            },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate, max-age=0',
            },
          ],
        }
      )
    }

    return headers
  },
  async redirects() {
    return [
      {
        source: '/free-consultation',
        destination: '/free-session',
        permanent: true,
      },
      {
        source: '/early-access',
        destination: '/free-session',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

