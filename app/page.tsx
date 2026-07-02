import Link from 'next/link'
import Script from 'next/script'
import type { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { detectLocale, getSEOContent, localizeText } from '../lib/locale'
import { getAllCategories, getAllBlogs } from './blog/lib/getBlogs'
import BlogCategories from './components/BlogCategories'
import PageFooter from './components/PageFooter'

const NavMenu = dynamic(() => import('./components/NavMenu'), { ssr: true })

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.guruforu.com'
  const title = 'Online Math & Science Tutoring with AI Progress Tracking | GuruForU'
  const description =
    'Live 1-on-1 online tutoring for K-12 Math and Science. Expert tutors, personalized learning plans, and AI-powered progress reports for parents. Book a free session.'

  return {
    title,
    description,
    keywords: getSEOContent('DEFAULT').keywords,
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
      title: 'GuruForU | Online Math & Science Tutoring for K-12',
      description,
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
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GuruForU | Online Math & Science Tutoring for K-12',
      description:
        'Expert tutors + AI progress tracking for K-12 Math and Science. Book a free session with GuruForU.',
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

export default async function HomePage() {
  const localeInfo = detectLocale()
  const localized = (text: string) => localizeText(text, localeInfo.region)
  const [categories, allBlogs] = await Promise.all([getAllCategories(), getAllBlogs()])
  const latestBlogs = allBlogs.slice(0, 3)

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
      'https://www.instagram.com/guruforu_official/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@guruforu.com',
      availableLanguage: 'English',
      areaServed: 'Worldwide',
    },
    address: { '@type': 'PostalAddress', addressCountry: 'Global' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    foundingDate: '2024',
    knowsAbout: [
      'Online Education',
      'AI-Powered Learning',
      'Personalized Tutoring',
      'Student Progress Tracking',
      'K-12 Education',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    description: localized('Premium Online Tutoring enhanced with AI-powered personalized learning and real-time mastery reports.'),
    publisher: { '@type': 'Organization', name: 'GuruForU' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.guruforu.com/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Online Tutoring Services',
    description:
      'AI-powered online tutoring with personalized learning, expert tutors, and real-time student progress tracking for K-12 students.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'GuruForU',
      url: 'https://www.guruforu.com',
    },
    areaServed: localeInfo.countryCode
      ? { '@type': 'Place', name: localeInfo.countryName, addressCountry: localeInfo.countryCode }
      : { '@type': 'Place', name: 'Worldwide' },
    serviceType: 'Online Education',
    category: 'Educational Services',
    offers: {
      '@type': 'Offer',
      description: 'Online tutoring classes with AI-powered learning and progress tracking',
      availabilityStarts: '2024-01-01',
    },
  }

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
          text: "Our AI adapts to each child's learning style and pace, providing real-time tracking and personalized learning paths for success.",
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
        name: "How do I track my child's progress?",
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
          text: "Getting started is easy! Book a free consultation session to discuss your child's learning needs. Our AI diagnostics will identify learning gaps and create a personalized roadmap.",
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

      <main className="home">
        {/* Hero */}
        <section className="home-hero" aria-labelledby="hero-heading">
          <div className="gf-container home-hero-inner">
            <div className="home-hero-copy">
              <div className="gf-badge">
                <span className="gf-badge-dot" aria-hidden="true" />
                AI-Powered Session Insights
              </div>
              <h1 id="hero-heading" className="home-hero-title">
                The Future of <span className="gf-text-primary">Live Learning</span> for Your Child
              </h1>
              <p className="home-hero-lead">
                Live 1-on-1 tutoring with expert teachers, an interactive whiteboard, and AI that
                tracks every session — so you always know how your child is progressing.
              </p>
              <div className="home-hero-pills">
                <span className="gf-pill">Live Interactive Classroom</span>
                <span className="gf-pill">Video + Whiteboard + AI</span>
              </div>
              <div className="home-hero-ctas">
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  {localized('Book Free Consultation')}
                </Link>
                <Link href="/how-it-works" className="gf-btn-outline" prefetch={false}>
                  {localized('How It Works')}
                </Link>
              </div>
            </div>
            <div className="home-hero-media">
              <div className="home-hero-glow" aria-hidden="true" />
              <div className="home-hero-frame">
                <Image
                  src="/homepage-hero.jpg"
                  alt="Student learning online with GuruForU live tutoring"
                  width={800}
                  height={600}
                  className="home-hero-img"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="home-trust" aria-label="Why parents choose GuruForU">
          <div className="gf-container">
            <div className="home-trust-grid">
              <div className="home-trust-item">
                <span className="home-trust-value">K-12</span>
                <span className="home-trust-label">Math &amp; Science</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">1-on-1</span>
                <span className="home-trust-label">Live Sessions</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">AI</span>
                <span className="home-trust-label">Progress Reports</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">Global</span>
                <span className="home-trust-label">US · UK · CA · IN</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="home-section" aria-labelledby="features-heading">
          <div className="gf-container">
            <div className="home-section-head">
              <h2 id="features-heading" className="home-section-title">
                Everything you need to excel
              </h2>
              <p className="home-section-desc">
                A complete ecosystem for online education, powered by expert tutors and advanced AI.
              </p>
            </div>
            <div className="home-features">
              <article className="home-feature">
                <div className="home-feature-icon" aria-hidden="true">✏️</div>
                <h3 className="home-feature-title">Interactive Whiteboard</h3>
                <p className="home-feature-text">
                  Real-time collaboration with drawing tools, math equations, and an infinite canvas.
                </p>
              </article>
              <article className="home-feature">
                <div className="home-feature-icon home-feature-icon-amber" aria-hidden="true">✨</div>
                <h3 className="home-feature-title">AI Session Insights</h3>
                <p className="home-feature-text">
                  Automatic summaries, strength analysis, and personalized improvement plans after
                  every class.
                </p>
              </article>
              <article className="home-feature">
                <div className="home-feature-icon home-feature-icon-green" aria-hidden="true">📈</div>
                <h3 className="home-feature-title">Progress Tracking</h3>
                <p className="home-feature-text">
                  Visual analytics and mastery reports so parents see exactly where their child is
                  improving.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="home-section home-section-alt" aria-labelledby="steps-heading">
          <div className="gf-container">
            <div className="home-section-head">
              <h2 id="steps-heading" className="home-section-title">
                How GuruForU works
              </h2>
              <p className="home-section-desc">
                From free consultation to measurable progress — a simple path for busy parents.
              </p>
            </div>
            <div className="home-steps">
              <div className="home-step">
                <div className="home-step-num">1</div>
                <h3 className="home-step-title">Book a free session</h3>
                <p className="home-step-text">
                  Tell us about your child&apos;s goals. We match them with the right tutor and
                  learning plan.
                </p>
              </div>
              <div className="home-step">
                <div className="home-step-num">2</div>
                <h3 className="home-step-title">Learn live online</h3>
                <p className="home-step-text">
                  Interactive video classes with whiteboard, screen share, and engaging 1-on-1
                  instruction.
                </p>
              </div>
              <div className="home-step">
                <div className="home-step-num">3</div>
                <h3 className="home-step-title">Track progress with AI</h3>
                <p className="home-step-text">
                  Receive session summaries and mastery reports — know what your child learned each
                  week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Classroom portal */}
        <section className="home-portal" aria-labelledby="portal-heading">
          <div className="gf-container">
            <h2 id="portal-heading" className="home-section-title">
              Already have an account?
            </h2>
            <p className="home-section-desc">
              Sign in to the GuruForU classroom for live sessions, whiteboard, and AI-powered
              insights.
            </p>
            <div className="home-ctas-center">
              <a
                href="https://learn.guruforu.com/"
                className="gf-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Teacher / Parent Sign In
              </a>
              <a
                href="https://learn.guruforu.com/"
                className="gf-btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Student Login
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-section" aria-labelledby="cta-heading">
          <div className="gf-container">
            <div className="home-cta-panel">
              <h2 id="cta-heading" className="home-section-title">
                Ready to get started?
              </h2>
              <p className="home-section-desc">
                Book a free consultation — no commitment. See how GuruForU can help your child
                succeed in math and science.
              </p>
              <div className="home-ctas-center">
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  {localized('Book Free Consultation')}
                </Link>
                <Link href="/about" className="gf-btn-outline" prefetch={false}>
                  {localized('About Us')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest articles */}
        {latestBlogs.length > 0 && (
          <section className="home-section home-section-alt" aria-labelledby="blog-heading">
            <div className="gf-container">
              <div className="home-section-head">
                <h2 id="blog-heading" className="home-section-title">
                  {localized('Latest Articles')}
                </h2>
                <p className="home-section-desc">
                  {localized('Practical guides for parents and students.')}
                </p>
              </div>
              <ul className="home-blog-grid">
                {latestBlogs.map((post) => (
                  <li key={post.slug} className="home-blog-card">
                    <Link
                      href={`/blog/${post.categorySlug}/${post.slug}`}
                      className="home-blog-link"
                      prefetch={false}
                    >
                      <div className="home-blog-thumb">
                        <Image
                          src={post.image || '/blog-images/online-education-category.jpg'}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="home-blog-body">
                        <p className="home-blog-cat">{post.category}</p>
                        <h3 className="home-blog-title">{post.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className="home-view-all" prefetch={false}>
                {localized('View all articles')} →
              </Link>
            </div>
          </section>
        )}

        {/* Topics */}
        <section className="home-section home-section-alt" aria-label={localized('Explore by topic')}>
          <div className="gf-container">
            <BlogCategories categories={categories} />
          </div>
        </section>

        {/* Footer */}
        <PageFooter localized={localized} />
      </main>
    </>
  )
}
