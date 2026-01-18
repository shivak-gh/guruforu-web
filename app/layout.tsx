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
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
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
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            (function() {
              try {
                if (typeof window === 'undefined') return;
                
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Check for existing consent before setting default
                let existingConsent = null;
                try {
                  existingConsent = localStorage.getItem('cookie-consent');
                } catch (e) {
                  // localStorage might not be available
                  console.warn('localStorage not available:', e);
                }
                
                const analyticsStorage = existingConsent === 'accepted' ? 'granted' : 'denied';
                
                // Set default consent state (required for Consent Mode v2)
                gtag('consent', 'default', {
                  'analytics_storage': analyticsStorage,
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'wait_for_update': existingConsent ? 0 : 500,
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
              try {
                if (typeof window === 'undefined' || typeof gtag === 'undefined') {
                  return;
                }
                
                gtag('js', new Date());
                
                // Get current consent state with error handling
                let consent = null;
                try {
                  consent = localStorage.getItem('cookie-consent');
                } catch (e) {
                  console.warn('localStorage not available:', e);
                }
                
                const analyticsStorage = consent === 'accepted' ? 'granted' : 'denied';
                
                // Configure GA with consent parameters included (required for Consent Mode v2)
                // Note: send_page_view is false here - we'll track it manually on route changes
                gtag('config', 'G-ZGXL6MTDYY', {
                  'anonymize_ip': true,
                  'send_page_view': false, // Disable auto pageview - we track manually
                  // Include consent parameters in config (ensures signals are sent)
                  'analytics_storage': analyticsStorage,
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                });
                
                // Send initial pageview if consent is granted
                if (consent === 'accepted' && window.location) {
                  try {
                    gtag('consent', 'update', {
                      'analytics_storage': 'granted',
                      'ad_storage': 'denied',
                      'ad_user_data': 'denied',
                      'ad_personalization': 'denied',
                    });
                    
                    // Send initial pageview using config (more reliable)
                    gtag('config', 'G-ZGXL6MTDYY', {
                      'page_path': window.location.pathname + window.location.search,
                      'page_location': window.location.href,
                      'analytics_storage': 'granted',
                      'ad_storage': 'denied',
                      'ad_user_data': 'denied',
                      'ad_personalization': 'denied',
                    });
                  } catch (e) {
                    console.error('Error sending initial pageview:', e);
                  }
                }
                
                // Debug logging (only in development)
                if (window.location && window.location.hostname === 'localhost') {
                  console.log('Google Analytics initialized with consent:', analyticsStorage);
                }
              } catch (error) {
                console.error('Error initializing Google Analytics:', error);
              }
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

