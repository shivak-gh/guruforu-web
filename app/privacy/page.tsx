import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection | GuruForU Online Tutoring',
  description: 'GuruForU privacy policy for online tutoring. Learn how we protect student data, handle personal information, comply with COPPA and GDPR, and ensure secure online learning.',
  keywords: [
    'GuruForU privacy policy',
    'online tutoring privacy',
    'student data protection',
    'COPPA compliance online education',
    'GDPR student privacy',
    'online learning data security',
    'tutoring platform privacy policy',
    'children online privacy protection'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy & Data Protection | GuruForU Online Tutoring',
    description: 'GuruForU privacy policy for online tutoring. Learn how we protect student data, handle personal information, comply with COPPA and GDPR, and ensure secure online learning.',
    url: 'https://www.guruforu.com/privacy',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Data Protection | GuruForU',
    description: 'Learn how GuruForU protects your data and ensures secure online learning.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/privacy',
  },
}

export default function PrivacyPolicy() {
  // WebPage and FAQPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Privacy Policy | GuruForU',
    'description': 'GuruForU privacy policy for online tutoring. Learn how we protect student data, handle personal information, comply with COPPA and GDPR, and ensure secure online learning.',
    'url': 'https://www.guruforu.com/privacy',
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
        'name': 'How does GuruForU protect student privacy?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'GuruForU implements comprehensive data protection measures including encryption, secure servers, and compliance with COPPA (Children\'s Online Privacy Protection Act) and GDPR. We never sell student data and only use it to provide educational services.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What student information does GuruForU collect?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We collect information necessary to provide online tutoring services, including name, email, grade level, learning progress data, and class participation records. Payment information is processed securely through third-party payment processors.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is GuruForU COPPA compliant?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, GuruForU is fully compliant with COPPA regulations. We obtain parental consent before collecting information from children under 13 and provide parents with access to review, delete, or refuse further collection of their child\'s information.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I delete my child\'s data from GuruForU?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, parents can request deletion of their child\'s data at any time by contacting us. We will process deletion requests within 30 days in accordance with applicable privacy laws.'
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="privacy-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="privacy-faq-schema"
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
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 1, {new Date().getFullYear()}</p>
          <p className={styles.text}>
            At <strong>GuruForU</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            <strong> online education platform</strong>. We understand the importance of privacy, especially when it comes to student data, 
            and we take our responsibility to protect your information seriously. This policy applies to all users of our services, 
            including students, parents, and educators.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.text}>
              At <strong>GuruForU</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our <strong>online education platform</strong>. 
              For questions, visit our <Link href="/contact" className={styles.link}>contact page</Link>.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
            <p className={styles.text}>We collect information that you provide directly to us, including:</p>
            <ul className={styles.list}>
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Account credentials and profile information</li>
              <li>Payment information (processed through secure third-party payment processors)</li>
              <li>Educational data and student progress information</li>
              <li>Communication data when you contact us</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p className={styles.text}>We use the collected information for various purposes:</p>
            <ul className={styles.list}>
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To respond to your comments and questions</li>
              <li>To provide personalized learning experiences and progress tracking</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Information Sharing and Disclosure</h2>
            <p className={styles.text}>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>
            <ul className={styles.list}>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights or property</li>
              <li>With service providers who assist us in operating our platform</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Security</h2>
            <p className={styles.text}>
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the internet is 100% secure.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies and Tracking Technologies</h2>
            <p className={styles.text}>
              We use <strong>cookies and similar tracking technologies</strong> to track activity on our platform and hold certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
              being sent. Our cookie consent banner allows you to control your preferences. Learn more about our 
              <Link href="/terms" className={styles.link}> terms of service</Link>.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Your Rights</h2>
            <p className={styles.text}>You have the right to:</p>
            <ul className={styles.list}>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Children&apos;s Privacy</h2>
            <p className={styles.text}>
              Our services are intended for users of all ages. We take special care to protect the privacy of 
              minors. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to This Privacy Policy</h2>
            <p className={styles.text}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Us</h2>
            <p className={styles.text}>
              If you have any questions about this Privacy Policy, please contact us through our 
              <Link href="/contact" className={styles.link}> Contact Us</Link> page.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How does GuruForU protect student privacy?</h3>
              <p className={styles.text}>
                GuruForU implements comprehensive data protection measures including encryption, secure servers, 
                and compliance with COPPA (Children&apos;s Online Privacy Protection Act) and GDPR. We never sell 
                student data and only use it to provide educational services.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What student information does GuruForU collect?</h3>
              <p className={styles.text}>
                We collect information necessary to provide online tutoring services, including name, email, 
                grade level, learning progress data, and class participation records. Payment information is 
                processed securely through third-party payment processors.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is GuruForU COPPA compliant?</h3>
              <p className={styles.text}>
                Yes, GuruForU is fully compliant with COPPA regulations. We obtain parental consent before 
                collecting information from children under 13 and provide parents with access to review, delete, 
                or refuse further collection of their child&apos;s information.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I delete my child&apos;s data from GuruForU?</h3>
              <p className={styles.text}>
                Yes, parents can request deletion of their child&apos;s data at any time by contacting us through 
                our <Link href="/contact" className={styles.link}>Contact Us</Link> page. We will process 
                deletion requests within 30 days in accordance with applicable privacy laws.
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
