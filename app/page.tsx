import styles from './page.module.css'
import Link from 'next/link'
import Script from 'next/script'
import type { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamic(() => import('./components/NavMenu'), {
  ssr: true, // Keep SSR for SEO and initial render
})

export const metadata: Metadata = {
  title: 'GuruForU - AI-Powered Online Classes & Student Progress Tracker',
  description: 'Best online classes for children with AI-powered personalized learning. Expert tutors, real-time progress tracking, and mastery reports. Start your child\'s success journey today.',
  keywords: [
    'Best Online Classes',
    'AI Student Progress Tracker',
    'Online Tuitions',
    'Personalized Learning',
    'Online Classes for Kids',
    'AI-Powered Education',
    'GuruForU'
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
    title: 'GuruForU - AI-Powered Online Classes & Student Progress Tracker',
    description: 'Best online classes for children with AI-powered personalized learning. Expert tutors, real-time progress tracking, and mastery reports.',
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
    title: 'GuruForU - AI-Powered Online Classes & Student Progress Tracker',
    description: 'Best online classes for children with AI-powered personalized learning. Expert tutors, real-time progress tracking.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com',
  },
}

export default function ComingSoon() {
  // Organization Schema for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'GuruForU',
    'url': 'https://www.guruforu.com',
    'logo': 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
    'description': 'Premium Online Tuitions enhanced with AI-powered personalized learning and real-time mastery reports.',
    'sameAs': [
      'https://twitter.com/guruforu_official',
      'https://www.instagram.com/guruforu_official/'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Service',
      'email': 'support@guruforu.com',
      'availableLanguage': 'English'
    },
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'Global'
    },
    'areaServed': 'Global'
  }

  // FAQ Schema for SEO (minimized for better text-to-HTML ratio)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is GuruForU?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU is an AI-powered online education platform providing personalized learning for children with expert tutors and comprehensive progress tracking.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does AI-powered learning work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI adapts to each child\'s learning style and pace, providing real-time tracking and personalized learning paths for success.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes GuruForU different?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU combines expert tutors with AI technology for comprehensive progress tracking, mastery reports, and personalized learning experiences.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I track my child\'s progress?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Parents receive detailed progress reports through our AI-powered dashboard with real-time analytics and learning insights.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the tutors qualified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all tutors are qualified independent teachers who are carefully vetted with profiles and qualifications available for review.',
        },
      },
    ],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <NavMenu />
      <div className={styles.container}>
      
      
      <div className={styles.background}>
        <div className={styles.gradient}></div>
        <div className={styles.particles}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
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
        <div className={styles.comingSoonBadge} aria-label="Now accepting early access">Now Accepting Early Access</div>
        <div className={styles.earlyAccessLink}>
          <Link href="/early-access" className={styles.notifyButton}>
            Notify Me
          </Link>
        </div>
        <main id="main-content">
          <h1 className={styles.title}>AI-Powered Online Classes</h1>
        <p className={styles.subtitle}>
          The best online classes for your child, enhanced with AI-powered personalized learning. 
          Get real-time student progress tracking and mastery reports that show exactly how your child is advancing.
        </p>
        <div className={styles.divider}></div>
        
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className={styles.featuresHeading}>Why Choose GuruForU for Your Child&apos;s Education?</h2>
          <div className={styles.features} role="list">
            <article className={styles.feature} role="listitem">
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>AI Mastery Tracking</h3>
                <p className={styles.featureDescription}><strong>Comprehensive student progress tracker</strong> that monitors your child&apos;s learning journey in real-time, providing detailed insights into their academic performance.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Personalized Learning</h3>
                <p className={styles.featureDescription}><strong>AI-driven personalized learning paths</strong> tailored to your child&apos;s unique strengths and learning style, ensuring optimal educational outcomes.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Expert Online Tutors</h3>
                <p className={styles.featureDescription}><strong>Connect with qualified independent teachers</strong> dedicated to your child&apos;s academic success, carefully selected for their expertise and teaching excellence.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Interactive Learning Sessions</h3>
                <p className={styles.featureDescription}><strong>Engaging live classes</strong> with interactive tools and multimedia content to keep your child motivated and learning effectively.</p>
              </div>
            </article>
          </div>
        </section>
        
        <section aria-labelledby="benefits-heading" className={styles.benefitsList}>
          <h2 id="benefits-heading" className={styles.benefitsHeading}>Key Benefits of Online Learning with GuruForU</h2>
          <ul className={styles.benefitsUl}>
            <li><strong>Flexible scheduling</strong> - Learn at your own pace and convenience</li>
            <li><strong>Personalized attention</strong> - One-on-one or small group sessions</li>
            <li><strong>Real-time progress tracking</strong> - See your child&apos;s improvement instantly</li>
            <li><strong>Expert guidance</strong> - Qualified tutors with proven track records</li>
            <li><strong>Comprehensive reports</strong> - Detailed analytics and mastery insights</li>
            <li><strong>Safe learning environment</strong> - Secure platform with parental controls</li>
          </ul>
        </section>

        <p className={styles.message}>
          Join thousands of parents who trust GuruForU for their children&apos;s online education journey. Learn more about our <Link href="/blog" className={styles.notifyButton}>educational resources</Link>, <Link href="/free-session" className={styles.notifyButton}>book a free session</Link>, or <Link href="/contact" className={styles.notifyButton}>contact us</Link> for more information.
        </p>
        </main>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.footerLinks}>
          <Link href="/blog" className={styles.footerLink} prefetch={false}>Education Blog</Link>
          <Link href="/contact" className={styles.footerLink} prefetch={false}>Contact Us</Link>
          <a href="mailto:support@guruforu.com" className={styles.footerLink}>Email Support</a>
          <Link href="/terms" className={styles.footerLink} prefetch={false}>Terms and Conditions</Link>
          <Link href="/privacy" className={styles.footerLink} prefetch={false}>Privacy Policy</Link>
          <Link href="/shipping" className={styles.footerLink} prefetch={false}>Shipping Policy</Link>
          <Link href="/cancellation-refunds" className={styles.footerLink} prefetch={false}>Cancellation and Refunds</Link>
        </nav>
        <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
      </footer>
    </div>
    </>
  )
}
