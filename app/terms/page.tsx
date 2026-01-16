import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Terms and Conditions | GuruForU',
  description: 'Read GuruForU terms and conditions. Learn about our service agreement, user responsibilities, and platform policies for online education services.',
  keywords: ['Terms and Conditions', 'GuruForU Terms', 'Service Agreement', 'Online Education Terms'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms and Conditions | GuruForU',
    description: 'Read GuruForU terms and conditions. Learn about our service agreement and platform policies.',
    url: 'https://www.guruforu.com/terms',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Terms and Conditions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions | GuruForU',
    description: 'Read GuruForU terms and conditions and service agreement.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/terms',
  },
}

export default function TermsAndConditions() {
  // WebPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Terms and Conditions | GuruForU',
    'description': 'Read GuruForU terms and conditions. Learn about our service agreement, user responsibilities, and platform policies for online education services.',
    'url': 'https://www.guruforu.com/terms',
    'dateModified': '2026-01-01',
    'inLanguage': 'en-US',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'GuruForU',
      'url': 'https://www.guruforu.com'
    }
  }

  return (
    <>
      <Script
        id="terms-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradient}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.homeLink}>
            <Image 
              src="/guruforu-ai-education-logo.png" 
              alt="GuruForU Logo" 
              width={120}
              height={60}
              className={styles.logoImage}
            />
          </Link>
        </div>

        <div className={styles.pageContent}>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.lastUpdated}>Last Updated: January 1, 2026</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
              By accessing and using <strong>GuruForU</strong>, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to these Terms and Conditions, please do not use our services. For questions about our terms, visit our <Link href="/contact" className={styles.link}>contact page</Link>.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Use License</h2>
            <p className={styles.text}>
              Permission is granted to temporarily use GuruForU for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className={styles.list}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on GuruForU</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Service Description</h2>
            <p className={styles.text}>
              <strong>GuruForU</strong> provides an online platform connecting students with independent teachers for personalized 
              learning experiences. We offer <strong>AI-powered tools</strong> to track student progress and provide insights. 
              Learn more about our <Link href="/" className={styles.link}>online classes</Link> and <Link href="/blog" className={styles.link}>educational resources</Link>.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. User Accounts</h2>
            <p className={styles.text}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to 
              accept responsibility for all activities that occur under your account.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Payment Terms</h2>
            <p className={styles.text}>
              Payments for services are processed through our secure payment gateway. By making a payment, 
              you agree to our pricing terms and refund policy as outlined in our Cancellation and Refunds policy.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Intellectual Property</h2>
            <p className={styles.text}>
              All content, features, and functionality of GuruForU, including but not limited to text, graphics, 
              logos, and software, are the exclusive property of GuruForU and are protected by copyright, 
              trademark, and other laws.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
            <p className={styles.text}>
              In no event shall GuruForU or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or 
              inability to use the materials on GuruForU.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Modifications</h2>
            <p className={styles.text}>
              GuruForU may revise these terms of service at any time without notice. By using this service, 
              you are agreeing to be bound by the then current version of these Terms and Conditions.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Contact Information</h2>
            <p className={styles.text}>
              If you have any questions about these Terms and Conditions, please contact us through our 
              <Link href="/contact" className={styles.link}> Contact Us</Link> page.
            </p>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  )
}
