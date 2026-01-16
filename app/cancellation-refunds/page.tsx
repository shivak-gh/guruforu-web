import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Cancellation and Refunds | GuruForU',
  description: 'GuruForU cancellation and refund policy. Learn about refund eligibility, processing times, and how to cancel online tutoring subscriptions.',
  keywords: ['Refund Policy', 'Cancellation Policy', 'Online Tutoring Refunds', 'Subscription Cancellation'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Cancellation and Refunds | GuruForU',
    description: 'Learn about GuruForU refund eligibility, processing times, and subscription cancellation policies.',
    url: 'https://www.guruforu.com/cancellation-refunds',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Cancellation and Refunds Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cancellation and Refunds | GuruForU',
    description: 'Learn about GuruForU refund eligibility and cancellation policies.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/cancellation-refunds',
  },
}

export default function CancellationAndRefunds() {
  // WebPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Cancellation and Refunds | GuruForU',
    'description': 'GuruForU cancellation and refund policy. Learn about refund eligibility, processing times, and how to cancel online tutoring subscriptions.',
    'url': 'https://www.guruforu.com/cancellation-refunds',
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
        id="cancellation-refunds-webpage-schema"
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
          <h1 className={styles.title}>Cancellation and Refunds</h1>
          <p className={styles.lastUpdated}>Last Updated: January 1, 2026</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Cancellation Policy</h2>
            <p className={styles.text}>
              You may <strong>cancel your subscription or service enrollment</strong> at any time. Cancellations can be 
              requested through your account settings or by contacting our support team through our 
              <Link href="/contact" className={styles.link}> Contact Us</Link> page. For questions about our services, visit our <Link href="/" className={styles.link}>home page</Link>.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Refund Eligibility</h2>
            <p className={styles.text}>
              Refunds are processed based on the following criteria:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Full Refund:</strong> Cancellations made within <strong>7 days</strong> of initial purchase are 
                eligible for a full refund, provided no substantial services have been utilized.
              </li>
              <li>
                <strong>Partial Refund:</strong> Cancellations made after 7 days but within <strong>30 days</strong> may 
                receive a prorated refund based on unused services.
              </li>
              <li>
                <strong>No Refund:</strong> Cancellations made after 30 days or after <strong>substantial service 
                utilization</strong> may not be eligible for a refund.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Refund Processing Time</h2>
            <p className={styles.text}>
              Approved refunds will be processed within 7-14 business days. The refund will be credited 
              to the original payment method used for the purchase. Please note that processing times may 
              vary depending on your bank or payment provider.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Subscription Cancellations</h2>
            <p className={styles.text}>
              For recurring subscriptions:
            </p>
            <ul className={styles.list}>
              <li>You can cancel your subscription at any time from your account settings</li>
              <li>Cancellation will take effect at the end of the current billing period</li>
              <li>You will continue to have access to services until the end of your paid period</li>
              <li>No refunds are provided for the current billing period unless specifically requested 
                  within the refund eligibility window</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Class or Session Cancellations</h2>
            <p className={styles.text}>
              Individual class or session cancellations:
            </p>
            <ul className={styles.list}>
              <li>Classes canceled at least 24 hours in advance may be rescheduled without penalty</li>
              <li>Classes canceled less than 24 hours in advance may be subject to a cancellation fee</li>
              <li>No-shows without prior cancellation are not eligible for refunds or credits</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Special Circumstances</h2>
            <p className={styles.text}>
              We understand that exceptional circumstances may arise. In cases of medical emergencies, 
              family emergencies, or other significant life events, please contact us to discuss your 
              situation. We will review each case individually and work to find a fair solution.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Refund Request Process</h2>
            <p className={styles.text}>
              To request a refund:
            </p>
            <ol className={styles.orderedList}>
              <li>Contact our support team through our <Link href="/contact" className={styles.link}>Contact Us</Link> page</li>
              <li>Provide your account information and purchase details</li>
              <li>State the reason for your refund request</li>
              <li>Our team will review your request and respond within 48 hours</li>
              <li>If approved, the refund will be processed as outlined in this policy</li>
            </ol>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Non-Refundable Items</h2>
            <p className={styles.text}>
              The following items are generally non-refundable:
            </p>
            <ul className={styles.list}>
              <li>Completed one-on-one tutoring sessions</li>
              <li>Downloaded or accessed digital materials</li>
              <li>Services that have been substantially utilized</li>
              <li>Third-party service fees (if applicable)</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Chargebacks</h2>
            <p className={styles.text}>
              If you have concerns about a charge, we encourage you to contact us directly before 
              initiating a chargeback with your payment provider. Chargebacks may result in immediate 
              account suspension. We are committed to resolving all billing issues amicably.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Policy Changes</h2>
            <p className={styles.text}>
              We reserve the right to modify this Cancellation and Refunds Policy at any time. Any 
              changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued 
              use of our services after policy changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contact Information</h2>
            <p className={styles.text}>
              For questions about cancellations and refunds, please contact us through our 
              <Link href="/contact" className={styles.link}> Contact Us</Link> page. Our support team 
              is available to assist you with any inquiries.
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
