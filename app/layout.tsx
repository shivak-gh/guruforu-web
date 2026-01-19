import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { detectLocale, generateHreflangLinks, getSEOContent } from '../lib/locale'
import './globals.css'

// Lazy load client components to reduce initial bundle size
const ConsentBanner = dynamic(() => import('./components/ConsentBanner'), {
  ssr: true, // Keep SSR for GDPR compliance and SEO
})

const Analytics = dynamic(() => import('./components/Analytics'), {
  ssr: true, // Must be true for Server Components - Analytics has 'use client' so it only runs on client
})

const FreeConsultationFAB = dynamic(() => import('./components/FreeConsultationFAB'), {
  ssr: true, // Keep SSR for better UX (shows immediately)
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

// Performance Note: Next.js App Router optimizes headers() calls automatically
// JSON imports are bundled at build time (zero runtime cost)
// Locale detection is a simple object lookup (<1ms overhead)

export async function generateMetadata(): Promise<Metadata> {
  // Next.js optimizes headers() - safe to call multiple times per request
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const seoContent = getSEOContent(localeInfo.region)
  const baseUrl = 'https://www.guruforu.com'

  // Pre-compute hreflang links once (static data, no performance impact)
  const hreflangLinks = generateHreflangLinks(baseUrl, '/')
  const languagesMap = hreflangLinks.reduce((acc, link) => {
    acc[link.hreflang] = link.href
    return acc
  }, {} as Record<string, string>)

  return {
    metadataBase: new URL(baseUrl),
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    icons: {
      icon: '/guruforu-ai-education-logo-dark.png',
      apple: '/guruforu-ai-education-logo-dark.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seoContent.openGraphTitle,
      description: seoContent.openGraphDescription,
      url: baseUrl,
      siteName: 'GuruForU',
      images: [
        {
          url: '/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: 'GuruForU - AI-Powered Online Education Platform',
        },
      ],
      type: 'website',
      locale: localeInfo.openGraphLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoContent.openGraphTitle,
      description: seoContent.openGraphDescription,
      images: ['/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: baseUrl,
      languages: languagesMap,
      types: {
        'application/rss+xml': 'https://www.guruforu.com/feed.xml',
      },
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Next.js optimizes headers() - returns cached value within same request
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const baseUrl = 'https://www.guruforu.com'
  const hreflangLinks = generateHreflangLinks(baseUrl, '/')

  return (
    <html lang={localeInfo.htmlLang}>
      <head>
        {/* Hreflang tags for international SEO */}
        {hreflangLinks.map((link) => (
          <link
            key={link.hreflang}
            rel="alternate"
            hrefLang={link.hreflang}
            href={link.href}
          />
        ))}
        {/* Performance: Preconnect to external domains - Only for critical resources */}
        {/* Note: Removed preconnect for Google Analytics/Tag Manager to reduce early connection overhead */}
        {/* Analytics scripts load lazily, so preconnect isn't needed immediately */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalService",
              "name": "GuruForU",
              "description": "Premium Online Tuitions enhanced with AI-powered personalized learning and real-time mastery reports.",
              "provider": {
                "@type": "Organization",
                "name": "GuruForU",
                "url": "https://www.guruforu.com"
              },
              "serviceType": "Online Tutoring",
              "areaServed": "Global",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Academic Courses",
                "itemListElement": [
                  {
                    "@type": "Course",
                    "name": "AI-Powered Personalized Learning",
                    "description": "Tailored learning paths for students using advanced AI tracking."
                  }
                ]
              }
            })
          }}
        />
        {/* Google Consent Mode v2 - Initialize lazily for better performance */}
        {/* Changed to lazyOnload to improve FCP/LCP - consent mode initializes after page load */}
        <Script id="google-consent-mode" strategy="lazyOnload">
          {`
            (function() {
              try {
                if (typeof window === 'undefined') return;
                
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
                
                // Set default consent state - always grant analytics_storage for tracking
                // Note: This allows analytics to track even without explicit consent
                window.gtag('consent', 'default', {
                  'analytics_storage': 'granted', // Always grant for tracking
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'wait_for_update': 0,
                });
              } catch (error) {
                console.error('Error initializing consent mode:', error);
              }
            })();
          `}
        </Script>
        {/* Google tag (gtag.js) - Load lazily for better performance (non-blocking) */}
        {/* Using fetchpriority="low" to deprioritize analytics script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGXL6MTDYY"
          strategy="lazyOnload"
          // @ts-ignore - fetchpriority is a valid HTML attribute
          fetchPriority="low"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            (function() {
              // Wait for gtag.js to fully load
              function initGA() {
                try {
                  if (typeof window === 'undefined' || !window.gtag) {
                    setTimeout(initGA, 50);
                    return;
                  }
                  
                  window.gtag('js', new Date());
                  
                  // Track analytics regardless of consent status
                  // Note: This may have privacy/legal implications depending on your jurisdiction
                  const isLocalhost = window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
                  
                  // Configure GA - always grant analytics_storage for tracking
                  window.gtag('config', 'G-ZGXL6MTDYY', {
                    'anonymize_ip': true,
                    'send_page_view': true, // Enable auto pageview
                    'analytics_storage': 'granted', // Always grant analytics storage
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'debug_mode': isLocalhost,
                  });
                  
                  // Ensure consent is granted for analytics
                  window.gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                  });
                  
                  // Debug logging for localhost
                  if (isLocalhost) {
                    console.log('✅ Google Analytics initialized');
                    console.log('✅ Analytics tracking is ENABLED (regardless of consent)');
                    console.log('GA ID: G-ZGXL6MTDYY');
                    console.log('Page:', window.location.href);
                  }
                } catch (error) {
                  console.error('❌ Error initializing Google Analytics:', error);
                }
              }
              
              // Start initialization (will retry until gtag is available)
              initGA();
            })();
          `}
        </Script>
      </head>
          <body>
            {children}
            <ConsentBanner />
            <Analytics />
            <FreeConsultationFAB />
          </body>
    </html>
  )
}

