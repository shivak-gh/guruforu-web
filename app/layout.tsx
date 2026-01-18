import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import ConsentBanner from './components/ConsentBanner'
import Analytics from './components/Analytics'
import FreeConsultationFAB from './components/FreeConsultationFAB'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.guruforu.com'),
  title: 'GuruForU | Best Online Classes with AI-Powered Student Progress Tracker',
  description: 'Best online classes with AI-powered personalized learning. Expert tutors, real-time student progress tracking, and mastery reports.',
  keywords: [
    'Best Online Classes',
    'Best Online Classes for Students',
    'Student Progress Tracker',
    'AI Student Progress Tracker',
    'Online Tuitions',
    'Online Tutoring',
    'Personalized Learning',
    'AI Mastery Tracking',
    'Online Classes for Kids',
    'Student Progress Monitoring',
    'AI-Powered Education',
    'Personalized Online Tutoring',
    'Home Schooling AI Assistant',
    'Online Coaching Mastery Reports',
    'Independent Teachers Platform',
    'GuruForU'
  ],
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
    title: 'GuruForU - Best Online Classes with AI Student Progress Tracker',
    description: 'Premium online tuitions powered by AI. Get personalized learning with AI mastery tracking and expert online tutors.',
    url: 'https://www.guruforu.com',
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
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GuruForU - Best Online Classes with AI Student Progress Tracker',
    description: 'Premium online tuitions powered by AI. Get personalized learning with AI mastery tracking and expert online tutors.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com',
    types: {
      'application/rss+xml': 'https://www.guruforu.com/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Performance: Preconnect to external domains - Critical for reducing latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
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
        {/* Google Consent Mode v2 - Initialize with denied by default */}
        {/* Changed to afterInteractive to improve FCP/LCP - consent mode will initialize quickly after hydration */}
        <Script id="google-consent-mode" strategy="afterInteractive">
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
        {/* Google tag (gtag.js) - Load after interactive for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGXL6MTDYY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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

