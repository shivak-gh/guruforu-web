import styles from './page.module.css'
import Link from 'next/link'
import Script from 'next/script'
import type { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { detectLocale, getSEOContent, localizeText, generateHreflangLinks } from '../lib/locale'
import { getAllCategories, getAllBlogs } from './blog/lib/getBlogs'
import BlogImage from './components/BlogImage'
import BlogCategories from './components/BlogCategories'

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamic(() => import('./components/NavMenu'), {
  ssr: true, // Keep SSR for SEO and initial render
})

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const seoContent = getSEOContent(localeInfo.region)
  const baseUrl = 'https://www.guruforu.com'
  const currentPath = '/'

  // Generate hreflang links for this page (all locales point to same URL for single-URL site)
  const hreflangLinks = generateHreflangLinks(baseUrl, currentPath)
  const languagesMap = hreflangLinks.reduce((acc, link) => {
    acc[link.hreflang] = link.href
    return acc
  }, {} as Record<string, string>)

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
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
      title: seoContent.openGraphTitle,
      description: seoContent.openGraphDescription,
      url: baseUrl,
      siteName: 'GuruForU',
      images: [
        {
          url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: 'GuruForU - AI-Powered Online Education Platform',
        },
      ],
      type: 'website',
      locale: localeInfo.openGraphLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoContent.openGraphTitle,
      description: seoContent.openGraphDescription,
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: baseUrl,
      languages: languagesMap,
    },
  }
}

export default async function ComingSoon() {
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const localized = (text: string) => localizeText(text, localeInfo.region)
  const [categories, allBlogs] = await Promise.all([getAllCategories(), getAllBlogs()])
  const latestBlogs = allBlogs.slice(0, 5)

  // Enhanced Organization Schema for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
      width: 1200,
      height: 630,
    },
    description: localized('Premium Online Tutoring enhanced with AI-powered personalized learning and real-time mastery reports.'),
    sameAs: [
      'https://twitter.com/guruforu_official',
      'https://www.instagram.com/guruforu_official/'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@guruforu.com',
      availableLanguage: 'English',
      areaServed: 'Worldwide',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Global',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    foundingDate: '2024', // Update with actual founding date
    knowsAbout: [
      'Online Education',
      'AI-Powered Learning',
      'Personalized Tutoring',
      'Student Progress Tracking',
      'K-12 Education',
    ],
  }

  // WebSite Schema with SearchAction for better SEO
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    description: localized('Premium Online Tutoring enhanced with AI-powered personalized learning and real-time mastery reports.'),
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.guruforu.com/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Service Schema for better SEO - Region-specific for all supported countries
  // areaServed is set based on detected locale (US, UK, CA, AU, NZ, QA, AE, or Worldwide for DEFAULT)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Online Tutoring Services',
    description: 'AI-powered online tutoring with personalized learning, expert tutors, and real-time student progress tracking for K-12 students.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'GuruForU',
      url: 'https://www.guruforu.com',
    },
    areaServed: localeInfo.countryCode ? {
      '@type': 'Place',
      name: localeInfo.countryName,
      addressCountry: localeInfo.countryCode,
    } : {
      '@type': 'Place',
      name: 'Worldwide',
    },
    serviceType: 'Online Education',
    category: 'Educational Services',
    offers: {
      '@type': 'Offer',
      description: 'Online tutoring classes with AI-powered learning and progress tracking',
      availabilityStarts: '2024-01-01',
    },
    // Removed aggregateRating - no actual reviews on Google Business Profile to avoid misleading search engines
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
      {
        '@type': 'Question',
        name: 'What subjects does GuruForU offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU offers online tutoring for Math, Science, and other K-12 subjects with curriculum support for US, UK, Canada, Australia, New Zealand, Qatar, and UAE.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get started with online tutoring?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Getting started is easy! Book a free consultation session to discuss your child\'s learning needs. Our AI diagnostics will identify learning gaps and create a personalized roadmap.',
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
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
          {/* Reduced particle count for better mobile performance: 50 on desktop, ~15 visible on mobile via CSS */}
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle} data-particle-index={i}></div>
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
            sizes="(max-width: 768px) 120px, 200px"
            quality={85}
          />
        </div>
        <div className={styles.comingSoonBadge} aria-label="Now accepting early access">{localized('Now Accepting Early Access')}</div>
        <div className={styles.earlyAccessLink}>
          <Link href="/early-access" className={styles.notifyButton}>
            {localized('Notify Me')}
          </Link>
        </div>
        <main id="main-content">
          <h1 className={styles.title}>AI-Powered Online Classes</h1>
        <p className={styles.subtitle}>
          The <strong>best online classes</strong> for your child, enhanced with <strong>AI-powered {localized('Personalized Learning')}</strong>. 
          Get <strong>real-time student progress tracking</strong> and mastery reports that show exactly how your child is advancing.
        </p>
        <p className={styles.subtitle}>
          GuruForU combines live online tutoring with AI-powered progress tracking. Our platform helps parents see exactly how their child is doing in math, science, and other subjects, while expert tutors provide personalized support. Whether you need help with homework, exam preparation, or building long-term skills, we tailor learning to your child&apos;s pace and goals.
        </p>
        <div className={styles.heroImageWrap}>
          <Image
            src="/homepage-hero.jpg"
            alt="AI-powered online tutoring and personalized learning for your child"
            width={800}
            height={500}
            className={styles.heroImage}
            sizes="(max-width: 768px) 100vw, 800px"
            priority={false}
          />
        </div>
        <div className={styles.divider}></div>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className={styles.featuresHeading}>Why Choose GuruForU for Your Child&apos;s Education?</h2>
          <div className={styles.features} role="list">
            <article className={styles.feature} role="listitem">
              <div className={styles.featureImageWrap}>
                <Image src="/blog-images/math-category.jpg" alt="AI mastery tracking and progress reports" width={400} height={250} className={styles.featureImage} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>AI Mastery Tracking</h3>
                <p className={styles.featureDescription}><strong>Comprehensive student progress tracker</strong> that monitors your child&apos;s learning journey in real-time, providing detailed insights into their academic performance.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureImageWrap}>
                <Image src="/blog-images/learning-strategies-category.jpg" alt="Personalized learning paths for your child" width={400} height={250} className={styles.featureImage} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{localized('Personalized Learning')}</h3>
                <p className={styles.featureDescription}><strong>AI-driven {localized('personalized learning paths')}</strong> tailored to your child&apos;s unique strengths and learning style, ensuring optimal educational outcomes.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureImageWrap}>
                <Image src="/blog-images/technology-category.jpg" alt="Expert online tutors and live classes" width={400} height={250} className={styles.featureImage} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
              <div className={styles.featureIcon} aria-hidden="true">✓</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Expert Online Tutors</h3>
                <p className={styles.featureDescription}><strong>Connect with qualified independent teachers</strong> dedicated to your child&apos;s academic success, carefully selected for their expertise and teaching excellence.</p>
              </div>
            </article>
            <article className={styles.feature} role="listitem">
              <div className={styles.featureImageWrap}>
                <Image src="/blog-images/online-education-category.jpg" alt="Interactive learning sessions and live classes" width={400} height={250} className={styles.featureImage} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
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
            <li><strong>{localized('Personalized attention')}</strong> - One-on-one or small group sessions</li>
            <li><strong>Real-time progress tracking</strong> - See your child&apos;s improvement instantly</li>
            <li><strong>Expert guidance</strong> - Qualified tutors with proven track records</li>
            <li><strong>Comprehensive reports</strong> - Detailed analytics and mastery insights</li>
            <li><strong>Safe learning environment</strong> - Secure platform with parental controls</li>
          </ul>
        </section>

        <section aria-labelledby="cta-heading" className={styles.ctaSection}>
          <h2 id="cta-heading" className={styles.ctaHeading}>Ready to Transform Your Child&apos;s Learning?</h2>
          <p className={styles.message}>
            {localized('Join thousands of parents who trust GuruForU for their children\'s online education journey. Learn more about our')} <Link href="/blog" className={styles.notifyButton}>{localized('educational resources')}</Link>, <Link href="/free-session" className={styles.notifyButton}>{localized('book a free session')}</Link>, {localized('or')} <Link href="/contact" className={styles.notifyButton}>{localized('contact us')}</Link> {localized('for more information.')}
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/free-session" className={styles.primaryButton} prefetch={false}>
              {localized('Book Free Consultation')}
            </Link>
            <Link href="/blog" className={styles.secondaryButton} prefetch={false}>
              {localized('Read Education Blog')}
            </Link>
          </div>
        </section>

        {latestBlogs.length > 0 && (
          <section aria-labelledby="latest-blog-heading" className={styles.benefitsList}>
            <h2 id="latest-blog-heading" className={styles.benefitsHeading}>{localized('Latest from the blog')}</h2>
            <ul className={styles.benefitsUl}>
              {latestBlogs.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.categorySlug}/${post.slug}`} className={styles.footerLink} prefetch={false}>
                    {post.title}
                  </Link>
                  <span className={styles.latestBlogMeta}> — {post.category}</span>
                </li>
              ))}
            </ul>
            <p>
              <Link href="/blog" className={styles.notifyButton} prefetch={false}>{localized('View all articles')}</Link>
            </p>
          </section>
        )}

        <section aria-label={localized('Explore by topic')} className={styles.exploreSection}>
          <BlogCategories categories={categories} />
        </section>
        </main>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.footerLinks}>
          <Link href="/about" className={styles.footerLink} prefetch={false}>{localized('About Us')}</Link>
          <Link href="/blog" className={styles.footerLink} prefetch={false}>{localized('Education Blog')}</Link>
          <Link href="/contact" className={styles.footerLink} prefetch={false}>{localized('Contact Us')}</Link>
          <Link href="/free-session" className={styles.footerLink} prefetch={false}>{localized('Free Session')}</Link>
          <a href="mailto:support@guruforu.com" className={styles.footerLink}>{localized('Email Support')}</a>
          <Link href="/terms" className={styles.footerLink} prefetch={false}>{localized('Terms and Conditions')}</Link>
          <Link href="/privacy" className={styles.footerLink} prefetch={false}>{localized('Privacy Policy')}</Link>
          <Link href="/shipping" className={styles.footerLink} prefetch={false}>{localized('Shipping Policy')}</Link>
          <Link href="/cancellation-refunds" className={styles.footerLink} prefetch={false}>{localized('Cancellation and Refunds')}</Link>
        </nav>
        <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. {localized('All rights reserved.')}</p>
      </footer>
    </div>
    </>
  )
}
