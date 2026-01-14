import type { Metadata } from 'next'
import Script from 'next/script'
import ConsentBanner from './components/ConsentBanner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://guruforu.com'),
  title: 'GuruForU | Best Online Classes with AI-Powered Student Progress Tracker',
  description: 'Find the best online classes for your child with AI-powered personalized learning. Get comprehensive student progress tracking and mastery reports that show exactly how your child is advancing. Expert online tutors with AI-driven insights.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
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
    description: 'Premium online tuitions powered by AI. Get personalized learning with AI mastery tracking and expert online tutors. Comprehensive student progress reports for parents.',
    url: 'https://guruforu.com',
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
    creator: '@guruforu',
    site: '@guruforu',
  },
  alternates: {
    canonical: 'https://guruforu.com',
    types: {
      'application/rss+xml': 'https://guruforu.com/feed.xml',
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
        {/* Google Consent Mode - Initialize with denied by default */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Check for existing consent before setting default
            const existingConsent = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null;
            const analyticsStorage = existingConsent === 'accepted' ? 'granted' : 'denied';
            
            gtag('consent', 'default', {
              'analytics_storage': analyticsStorage,
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': existingConsent ? 0 : 500,
            });
          `}
        </Script>
        {/* Google tag (gtag.js) - Load but respect consent */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGXL6MTDYY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            
            // Configure GA with anonymize IP
            gtag('config', 'G-ZGXL6MTDYY', {
              'anonymize_ip': true,
              'send_page_view': true,
            });
            
            // Ensure consent is properly set after gtag loads
            if (typeof window !== 'undefined') {
              const consent = localStorage.getItem('cookie-consent');
              if (consent === 'accepted') {
                gtag('consent', 'update', {
                  'analytics_storage': 'granted',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                });
                // Send a pageview after consent is granted
                gtag('event', 'page_view', {
                  'send_to': 'G-ZGXL6MTDYY'
                });
              }
            }
          `}
        </Script>
      </head>
      <body>
        {children}
        <ConsentBanner />
      </body>
    </html>
  )
}

