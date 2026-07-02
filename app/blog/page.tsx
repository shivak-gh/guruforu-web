import Link from 'next/link'
import { getAllBlogs } from './lib/getBlogs'
import { defaultBlogImage } from './lib/categoryImages'
import BlogImage from '../components/BlogImage'
import dynamicImport from 'next/dynamic'
import Script from 'next/script'
import { headers } from 'next/headers'
import { detectLocale, localizeText } from '../../lib/locale'
import type { Metadata } from 'next'
import PageFooter from '../components/PageFooter'

const BlogCategoriesWrapper = dynamicImport(() => import('../components/BlogCategoriesWrapper'), {
  ssr: true,
})
const NavMenu = dynamicImport(() => import('../components/NavMenu'), {
  ssr: true,
})

export const revalidate = 3600

const RESOURCE_CARDS = [
  {
    icon: '📚',
    title: 'Study strategies',
    text: 'Proven techniques for homework, exams, and building lasting study habits at home.',
    variant: '',
  },
  {
    icon: '📐',
    title: 'Math & Science tips',
    text: 'Subject-specific guides to help students grasp concepts and parents support learning.',
    variant: 'amber',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Parent guides',
    text: 'Practical advice on tutoring choices, progress tracking, and online learning.',
    variant: 'green',
  },
]

const iconClass = (variant?: string) => {
  if (variant === 'amber') return 'about-card-icon about-card-icon-amber'
  if (variant === 'green') return 'about-card-icon about-card-icon-green'
  return 'about-card-icon'
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'GuruForU Blog | Practical Learning Guides for Parents & Students',
    description:
      'Explore practical guides on online learning, study strategies, and Math & Science tutoring. Actionable tips for parents and students from GuruForU experts.',
    keywords: [
      'online learning resources',
      'online learning for students',
      'online learning tips',
      'student progress tracking guide',
      'AI-powered learning articles',
      'personalized learning strategies',
      'online tutoring advice',
      'online education resources',
      'homeschooling tips',
      'online class best practices',
      'student success strategies',
      'online education articles',
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
      title: 'GuruForU Blog | Learning Guides for Parents & Students',
      description:
        'Practical articles on study habits, online tutoring, and student progress for K-12 learners.',
      url: 'https://www.guruforu.com/blog',
      siteName: 'GuruForU',
      type: 'website',
      images: [
        {
          url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: 'GuruForU Blog',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GuruForU Blog | Learning Guides for Parents & Students',
      description: 'Practical tips on study strategies, online tutoring, and K-12 learning progress.',
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: 'https://www.guruforu.com/blog',
      types: {
        'application/rss+xml': 'https://www.guruforu.com/feed.xml',
      },
    },
  }
}

export default async function BlogListing() {
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const localized = (text: string) => localizeText(text, localeInfo.region)
  const blogs = await getAllBlogs()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    sameAs: [
      'https://twitter.com/guruforu_official',
      'https://www.instagram.com/guruforu_official/',
    ],
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'GuruForU Learning Resources',
    description:
      'Expert articles and guides on online learning, tutoring strategies, and AI-powered personalized education from GuruForU.',
    url: 'https://www.guruforu.com/blog',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
      url: 'https://www.guruforu.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
      },
    },
    blogPost: blogs.map((blog) => {
      const imagePath = blog.image || defaultBlogImage
      const imageUrl = imagePath.startsWith('http')
        ? imagePath
        : `https://www.guruforu.com${imagePath}`
      return {
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.lead,
        url: `https://www.guruforu.com/blog/${blog.categorySlug}/${blog.slug}`,
        datePublished: blog.meta.publishedDate,
        image: imageUrl,
      }
    }),
  }

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.guruforu.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Resources',
        item: 'https://www.guruforu.com/blog',
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
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <NavMenu />

      <main className="blog">
        {/* Hero */}
        <section className="about-hero" aria-labelledby="resources-heading">
          <div className="gf-container about-hero-inner">
            <div className="gf-badge">
              <span className="gf-badge-dot" aria-hidden="true" />
              {localized('Parent & Student Guides')}
            </div>
            <h1 id="resources-heading" className="about-hero-title">
              {localized('Learning')} <span className="gf-text-primary">{localized('Resources')}</span>
            </h1>
            <p className="about-hero-lead">
              {localized('Expert insights on')}{' '}
              <strong>{localized('child education')}</strong>,{' '}
              <strong>{localized('learning strategies')}</strong>, {localized('and')}{' '}
              <strong>{localized('AI-powered personalized learning')}</strong> — practical articles
              for parents and students.
            </p>
            <div className="about-hero-ctas">
              <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                {localized('Book Free Session')}
              </Link>
              <Link href="/how-it-works" className="gf-btn-outline" prefetch={false}>
                {localized('How It Works')}
              </Link>
            </div>
          </div>
        </section>

        {/* What you'll find */}
        <section className="about-section" aria-labelledby="resource-types-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="resource-types-heading" className="about-section-title">
                What you&apos;ll find here
              </h2>
              <p className="about-section-desc">
                Actionable guides written for parents and K-12 students — not generic blog filler.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {RESOURCE_CARDS.map((card) => (
                <article key={card.title} className="about-card">
                  <div className={iconClass(card.variant)} aria-hidden="true">
                    {card.icon}
                  </div>
                  <h3 className="about-card-title">{localized(card.title)}</h3>
                  <p className="about-card-text">{localized(card.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="about-section about-section-alt blog-topics-section" aria-label="Browse by topic">
          <div className="gf-container">
            <BlogCategoriesWrapper />
            <p className="blog-rss">
              <a href="/feed.xml">Subscribe via RSS</a>
            </p>
          </div>
        </section>

        {/* Latest articles */}
        <section className="blog-articles-section about-section-alt" aria-labelledby="latest-heading">
          <div className="gf-container">
            <div className="blog-articles-head">
              <h2 id="latest-heading" className="blog-articles-title">
                {localized('Latest articles')}
              </h2>
              <p className="blog-articles-desc">
                {localized('New guides on tutoring, study skills, and helping your child succeed online.')}
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="blog-empty">
                <p>{localized('No blog posts available yet. Check back soon!')}</p>
              </div>
            ) : (
              <div className="blog-articles-grid">
                {blogs.map((blog) => {
                  const blogImage = blog.image || '/blog-images/online-education-category.jpg'
                  return (
                    <article key={blog.slug} className="blog-card">
                      <Link
                        href={`/blog/${blog.categorySlug}/${blog.slug}`}
                        className="blog-card-link"
                        prefetch={false}
                      >
                        <div className="blog-card-image-wrap">
                          <BlogImage
                            src={blogImage}
                            alt=""
                            width={400}
                            height={250}
                            className="blog-card-image"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            fallbackSrc="/blog-images/online-education-category.jpg"
                          />
                        </div>
                        <div className="blog-card-body">
                          <span className="blog-card-category">{blog.category}</span>
                          <h3 className="blog-card-title">{blog.title}</h3>
                          <p className="blog-card-lead">{blog.lead}</p>
                          <div className="blog-card-footer">
                            <span>
                              {formatDate(blog.meta.publishedDate)} · {blog.meta.readTime}
                            </span>
                            <span className="blog-card-read" aria-hidden="true">
                              Read →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="about-section" aria-labelledby="resources-cta-heading">
          <div className="gf-container">
            <div className="about-cta">
              <h2 id="resources-cta-heading" className="about-cta-title">
                Ready to go beyond reading?
              </h2>
              <p className="about-cta-desc">
                Book a free tutoring session and see how live 1-on-1 classes plus AI reports work for
                your child.
              </p>
              <div className="about-cta-actions">
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  {localized('Book Free Session')}
                </Link>
                <Link href="/contact" className="gf-btn-outline" prefetch={false}>
                  {localized('Contact Us')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PageFooter localized={localized} />
      </main>
    </>
  )
}
