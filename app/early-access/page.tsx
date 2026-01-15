import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import NavMenu from '../components/NavMenu'
import EarlyAccessForm from '../components/EarlyAccessForm'

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
        url: '/guruforu-ai-education-logo-dark.png',
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
    images: ['/guruforu-ai-education-logo-dark.png'],
  },
  alternates: {
    canonical: 'https://www.guruforu.com/early-access',
  },
}

export default function EarlyAccessPage() {
  return (
    <>
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
            Now Accepting Early Access
          </div>

          <main id="main-content">
            <h1 className={styles.title}>Get Early Access to GuruForU</h1>
            <p className={styles.subtitle}>
              Be among the first to experience premium online tuitions powered by AI. 
              Get notified when we launch and receive exclusive early access benefits.
            </p>

            <div className={styles.formSection}>
              <EarlyAccessForm />
            </div>

            <div className={styles.benefits}>
              <h2 className={styles.benefitsTitle}>Early Access Benefits</h2>
              <ul className={styles.benefitsList}>
                <li>✓ Priority access to the platform</li>
                <li>✓ Special launch pricing</li>
                <li>✓ Exclusive onboarding support</li>
                <li>✓ Early feature previews</li>
              </ul>
            </div>

            <div className={styles.backLink}>
              <Link href="/" className={styles.link}>
                ← Back to Home
              </Link>
            </div>
          </main>
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>Home</Link>
            <Link href="/blog" className={styles.footerLink} prefetch={false}>Blog</Link>
            <Link href="/contact" className={styles.footerLink} prefetch={false}>Contact Us</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>Email Support</a>
            <Link href="/terms" className={styles.footerLink} prefetch={false}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink} prefetch={false}>Privacy</Link>
          </nav>
          <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
