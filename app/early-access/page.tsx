import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { detectLocale, localizeText } from '../../lib/locale'

// Lazy load client components to reduce initial bundle size
const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})
const EarlyAccessForm = dynamic(() => import('../components/EarlyAccessForm'), {
  ssr: true,
})

export const metadata: Metadata = {
  title: 'Early Access - GuruForU | Get Notified When We Launch',
  description: 'Join GuruForU early access program. Be the first to experience AI-powered online classes with personalized learning and student progress tracking.',
  keywords: [
    'GuruForU Early Access',
    'Early Access Signup',
    'AI-Powered Education',
    'Online Classes Early Access',
    'Student Progress Tracker',
  ],
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
    title: 'Early Access - GuruForU | Get Notified When We Launch',
    description: 'Join GuruForU early access program. Be the first to experience AI-powered online classes.',
    url: 'https://www.guruforu.com/early-access',
    siteName: 'GuruForU',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Early Access',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Early Access - GuruForU | Get Notified When We Launch',
    description: 'Join GuruForU early access program. Be the first to experience AI-powered online classes.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/early-access',
  },
}

export default async function EarlyAccessPage() {
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const localized = (text: string) => localizeText(text, localeInfo.region)
  
  // WebPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Early Access - GuruForU',
    'description': 'Join GuruForU early access program. Be the first to experience AI-powered online classes with personalized learning and student progress tracking.',
    'url': 'https://www.guruforu.com/early-access',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'GuruForU',
      'url': 'https://www.guruforu.com'
    }
  }

  // FAQ schema for early access page
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is GuruForU early access?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Early access lets you join the waitlist and be notified when GuruForU launches. Early access members get priority onboarding, special launch pricing, and exclusive support as we roll out AI-powered online tuitions and student progress tracking.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I get early access?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sign up using the form on this page with your email. We will notify you as soon as GuruForU is ready to launch.'
        }
      },
      {
        '@type': 'Question',
        name: 'What benefits do early access members get?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Early access members receive priority access to the platform, special launch pricing for early adopters, exclusive onboarding support from our team, and early feature previews before public release.'
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="early-access-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="early-access-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <NavMenu />
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>

        <div className={styles.content}>
          <div className={styles.logo}>
            <Image 
              src="/guruforu-ai-education-logo.png" 
              alt="GuruForU - AI-Powered Online Education Platform Logo" 
              width={200}
              height={200}
              className={styles.logoImage}
              priority
            />
          </div>
          
          <div className={styles.badge} aria-label="Now accepting early access">
            {localized('Now Accepting Early Access')}
          </div>

          <main id="main-content">
            <h1 className={styles.title}>{localized('Get Early Access to GuruForU')}</h1>
            <p className={styles.subtitle}>
              {localized('Be among the first to experience')} <strong>{localized('premium online tuitions powered by AI')}</strong>. 
              {localized('Get notified when we launch and receive')} <strong>{localized('exclusive early access benefits')}</strong>.
            </p>
            <p className={styles.subtitle}>
              Join our waitlist to be notified at launch. Early access members get priority onboarding, special pricing, and direct support from our team as we roll out new features for AI-powered tutoring and student progress tracking.
            </p>

            <div className={styles.formSection}>
              <EarlyAccessForm />
            </div>

            <div className={styles.benefits}>
              <h2 className={styles.benefitsTitle}>{localized('Early Access Benefits')}</h2>
              <ul className={styles.benefitsList}>
                <li>✓ <strong>{localized('Priority access')}</strong> {localized('to the platform')}</li>
                <li>✓ <strong>{localized('Special launch pricing')}</strong> {localized('for early adopters')}</li>
                <li>✓ <strong>{localized('Exclusive onboarding support')}</strong> {localized('from our team')}</li>
                <li>✓ <strong>{localized('Early feature previews')}</strong> {localized('before public release')}</li>
              </ul>
            </div>

            <div className={styles.backLink}>
              <Link href="/" className={styles.link}>
                ← {localized('Back to Home')}
              </Link>
            </div>
          </main>
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>{localized('GuruForU Home')}</Link>
            <Link href="/blog" className={styles.footerLink} prefetch={false}>{localized('Resources')}</Link>
            <Link href="/contact" className={styles.footerLink} prefetch={false}>{localized('Contact Us')}</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>{localized('Email Support')}</a>
            <Link href="/terms" className={styles.footerLink} prefetch={false}>{localized('Terms and Conditions')}</Link>
            <Link href="/privacy" className={styles.footerLink} prefetch={false}>{localized('Privacy Policy')}</Link>
          </nav>
          <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. {localized('All rights reserved.')}</p>
        </footer>
      </div>
    </>
  )
}
