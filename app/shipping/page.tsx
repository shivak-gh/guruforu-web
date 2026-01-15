import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Shipping Policy | GuruForU',
  description: 'GuruForU shipping and delivery policy. Learn about our digital service delivery, access timelines, and technical requirements for online classes.',
  keywords: ['Shipping Policy', 'Digital Delivery', 'Online Service Access', 'Service Delivery'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Shipping Policy | GuruForU',
    description: 'Learn about GuruForU digital service delivery and access timelines for online classes.',
    url: 'https://www.guruforu.com/shipping',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Shipping Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Policy | GuruForU',
    description: 'Learn about GuruForU digital service delivery and access timelines.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu',
    site: '@guruforu',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/shipping',
  },
}

export default function ShippingPolicy() {
  return (
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
          <h1 className={styles.title}>Shipping Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 1, 2026</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Digital Services</h2>
            <p className={styles.text}>
              <strong>GuruForU</strong> provides <strong>digital educational services</strong> and content. As such, there are no physical 
              products that require shipping. All services, including <Link href="/" className={styles.link}>online classes</Link>, learning materials, 
              and progress reports, are delivered digitally through our platform. Explore our <Link href="/blog" className={styles.link}>education blog</Link> for more information.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Service Delivery</h2>
            <p className={styles.text}>
              Upon successful payment and account activation, you will gain immediate access to our services, 
              including:
            </p>
            <ul className={styles.list}>
              <li>Online class sessions and materials</li>
              <li>Student progress tracking and reports</li>
              <li>AI-powered learning insights</li>
              <li>Educational resources and content</li>
              <li>Communication tools with teachers</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Access Timeline</h2>
            <p className={styles.text}>
              Access to services is typically granted immediately after payment confirmation. In some cases, 
              it may take up to 24 hours for full access to be activated. You will receive a confirmation 
              email once your account is fully activated.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Geographic Availability</h2>
            <p className={styles.text}>
              Our digital services are available worldwide. There are no geographic restrictions on accessing 
              our platform, provided you have a stable internet connection.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Internet Requirements</h2>
            <p className={styles.text}>
              To access and use GuruForU services, you must have:
            </p>
            <ul className={styles.list}>
              <li>A stable internet connection</li>
              <li>A compatible device (computer, tablet, or smartphone)</li>
              <li>An up-to-date web browser</li>
              <li>Required bandwidth for live classes and video content</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Technical Support</h2>
            <p className={styles.text}>
              If you experience any issues accessing our services or require technical assistance, please 
              contact our support team through our 
              <Link href="/contact" className={styles.link}> Contact Us</Link> page. We are committed to 
              ensuring you have a smooth experience accessing our platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Updates and Notifications</h2>
            <p className={styles.text}>
              We will notify you via email about important updates, service changes, or maintenance schedules 
              that may affect your access to our platform. Please ensure your email address is kept up to date.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Physical Products (if applicable)</h2>
            <p className={styles.text}>
              Currently, GuruForU operates as a digital-only platform. If we introduce any physical products 
              in the future, this policy will be updated with specific shipping terms, delivery times, and 
              tracking information.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Contact Information</h2>
            <p className={styles.text}>
              If you have any questions about our shipping policy or service delivery, please contact us 
              through our <Link href="/contact" className={styles.link}> Contact Us</Link> page.
            </p>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
