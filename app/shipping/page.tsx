import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Digital Service Delivery & Shipping Policy | GuruForU Online Tutoring',
  description: 'GuruForU digital service delivery policy for online tutoring. Learn how to access online classes, technical requirements, account activation timelines, and service availability.',
  keywords: [
    'GuruForU service delivery',
    'online tutoring access',
    'digital education delivery',
    'online class activation',
    'tutoring platform access',
    'virtual learning service delivery',
    'online education technical requirements',
    'how to access online tutoring'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Digital Service Delivery & Shipping Policy | GuruForU Online Tutoring',
    description: 'GuruForU digital service delivery policy for online tutoring. Learn how to access online classes, technical requirements, account activation timelines, and service availability.',
    url: 'https://www.guruforu.com/shipping',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Shipping Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Service Delivery & Shipping Policy | GuruForU',
    description: 'Learn about GuruForU digital service delivery and access timelines.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/shipping',
  },
}

export default function ShippingPolicy() {
  // WebPage and FAQPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Shipping Policy | GuruForU',
    'description': 'GuruForU digital service delivery policy for online tutoring. Learn how to access online classes, technical requirements, account activation timelines, and service availability.',
    'url': 'https://www.guruforu.com/shipping',
    'dateModified': '2026-01-01',
    'inLanguage': 'en-US',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'GuruForU',
      'url': 'https://www.guruforu.com'
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do I access my online tutoring classes?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Once your payment is confirmed, you\'ll receive an email with login credentials and instructions to access your account. Classes are delivered digitally through our online platform, accessible immediately after account activation.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What are the technical requirements for online classes?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You need a stable internet connection, a computer or tablet, and a web browser (Chrome, Firefox, Safari, or Edge). Some classes may require a microphone and webcam for interactive sessions. We recommend a minimum internet speed of 5 Mbps for optimal experience.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How quickly can I start my online tutoring sessions?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Digital service delivery is instant. Once your account is activated and payment is confirmed, you can immediately access your online classes and schedule sessions with tutors. Account activation typically takes less than 24 hours.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you ship physical materials for online tutoring?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'GuruForU operates as a digital-only platform. All learning materials, class recordings, and resources are delivered electronically through our online platform. No physical shipping is required for our services.'
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="shipping-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="shipping-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
          <h1 className={styles.title}>Shipping Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 1, {new Date().getFullYear()}</p>
          <p className={styles.text}>
            At <strong>GuruForU</strong>, we provide <strong>digital educational services</strong> and content through our online platform. 
            This Shipping Policy outlines how we deliver our services, including online classes, learning materials, progress reports, 
            and educational resources. Since we operate as a digital-only platform, there are no physical products that require shipping. 
            All services are delivered instantly through our secure online platform, ensuring immediate access to educational content and resources.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Digital Services</h2>
            <p className={styles.text}>
              <strong>GuruForU</strong> provides <strong>digital educational services</strong> and content. As such, there are no physical 
              products that require shipping. All services, including <Link href="/" className={styles.link}>online classes</Link>, learning materials, 
              and progress reports, are delivered digitally through our platform. Explore our <Link href="/blog" className={styles.link}>learning resources</Link> for more information.
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

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I access my online tutoring classes?</h3>
              <p className={styles.text}>
                Once your payment is confirmed, you&apos;ll receive an email with login credentials and instructions 
                to access your account. Classes are delivered digitally through our online platform, accessible 
                immediately after account activation.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What are the technical requirements for online classes?</h3>
              <p className={styles.text}>
                You need a stable internet connection, a computer or tablet, and a web browser (Chrome, Firefox, 
                Safari, or Edge). Some classes may require a microphone and webcam for interactive sessions. 
                We recommend a minimum internet speed of 5 Mbps for optimal experience.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How quickly can I start my online tutoring sessions?</h3>
              <p className={styles.text}>
                Digital service delivery is instant. Once your account is activated and payment is confirmed, 
                you can immediately access your online classes and schedule sessions with tutors. Account 
                activation typically takes less than 24 hours.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Do you ship physical materials for online tutoring?</h3>
              <p className={styles.text}>
                GuruForU operates as a digital-only platform. All learning materials, class recordings, and 
                resources are delivered electronically through our online platform. No physical shipping is 
                required for our services.
              </p>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  )
}
