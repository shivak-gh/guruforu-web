import Link from 'next/link'
import { getAllBlogs } from './lib/getBlogs'
import BlogImage from '../components/BlogImage'
import dynamicImport from 'next/dynamic'
import styles from './page.module.css'
import Script from 'next/script'
import { headers } from 'next/headers'
import { detectLocale, localizeText, generateHreflangLinks } from '../../lib/locale'
import type { Metadata } from 'next'

// Lazy load client components to reduce initial bundle size
const BlogCategoriesWrapper = dynamicImport(() => import('../components/BlogCategoriesWrapper'), {
  ssr: true,
})
const NavMenu = dynamicImport(() => import('../components/NavMenu'), {
  ssr: true,
})

// Optimize RSC caching to reduce duplicate requests
// Disable caching during development/stabilization
// Set DISABLE_CACHE=false in environment to enable caching (revalidate=3600, dynamic='force-static')
export const revalidate = 0 // Disabled for stability - set to 3600 when ready
export const dynamic = 'force-dynamic' // Force dynamic rendering - set to 'force-static' when ready

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.guruforu.com'
  const currentPath = '/blog'
  
  // Generate hreflang links for this page (all locales point to same URL for single-URL site)
  const hreflangLinks = generateHreflangLinks(baseUrl, currentPath)
  const languagesMap = hreflangLinks.reduce((acc, link) => {
    acc[link.hreflang] = link.href
    return acc
  }, {} as Record<string, string>)

  return {
    title: 'Education Blog | GuruForU - Online Tutoring & Learning Tips',
    description: 'Expert education blog with articles on online tutoring, AI-powered learning, student progress tracking, and personalized learning strategies. Tips for parents and students.',
    keywords: [
      'online tutoring blog',
      'education blog for parents',
      'online learning tips',
      'student progress tracking guide',
      'AI-powered learning articles',
      'personalized learning strategies',
      'online tutoring advice',
      'child education resources',
      'homeschooling tips',
      'online class best practices',
      'student success strategies',
      'parenting education blog'
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
      title: 'Education Blog | GuruForU - Online Tutoring & Learning Tips',
      description: 'Expert education blog with articles on online tutoring, AI-powered learning, student progress tracking, and personalized learning strategies. Tips for parents and students.',
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
      title: 'Education Blog | GuruForU - Online Tutoring & Learning Tips',
      description: 'Expert education blog with articles on online tutoring, AI-powered learning, student progress tracking, and personalized learning strategies.',
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: 'https://www.guruforu.com/blog',
      languages: languagesMap,
      types: {
        'application/rss+xml': 'https://www.guruforu.com/feed.xml',
      },
    },
  }
}

export default async function BlogListing() {
  const blogs = await getAllBlogs()
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const localized = (text: string) => localizeText(text, localeInfo.region)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Organization schema (minimized)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    sameAs: [
      'https://twitter.com/guruforu_official',
      'https://www.instagram.com/guruforu_official/'
    ],
  }

  // Generate comprehensive JSON-LD structured data for Blog schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'GuruForU Blog',
    description: 'Expert insights on child education, learning strategies, and AI-powered personalized learning.',
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
    blogPost: blogs.map((blog) => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.lead,
      url: `https://www.guruforu.com/blog/${blog.categorySlug}/${blog.slug}`,
      datePublished: blog.meta.publishedDate,
      image: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
    })),
  }

  // Breadcrumb structured data
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
        name: 'Blog',
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
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>

        <div className={styles.content}>
        <div className={styles.blogListing}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink} prefetch={false}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{localized('Blog')}</span>
          </nav>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{localized('Our Blog')}</h1>
            <p className={styles.pageSubtitle}>
              {localized('Expert insights on')} <strong>{localized('child education')}</strong>, <strong>{localized('learning strategies')}</strong>, {localized('and')} <strong>{localized('AI-powered personalized learning')}</strong>
            </p>
            <p className={styles.pageSubtitle}>
              We publish articles on online tutoring, math and science learning, study tips, and parenting guides. Browse by topic below or explore the latest posts to find practical advice for your child&apos;s education.
            </p>
          </header>

          <BlogCategoriesWrapper />

          {blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{localized('No blog posts available yet. Check back soon!')}</p>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {blogs.map((blog) => {
                const blogImage = blog.image || `/blog-images/online-education-category.jpg`
                return (
                  <article key={blog.slug} className={styles.blogCard}>
                    <Link href={`/blog/${blog.categorySlug}/${blog.slug}`} className={styles.blogCardLink} prefetch={false}>
                      <div className={styles.blogCardImageWrapper}>
                        <BlogImage
                          src={blogImage}
                          alt={blog.title}
                          width={400}
                          height={250}
                          className={styles.blogCardImage}
                          sizes="(max-width: 768px) 100vw, 400px"
                          fallbackSrc="/blog-images/online-education-category.jpg"
                        />
                      </div>
                      <div className={styles.blogCardContent}>
                        <div className={styles.blogCardCategory}>{blog.category}</div>
                        <h2 className={styles.blogCardTitle}>{blog.title}</h2>
                        <p className={styles.blogCardLead}>{blog.lead}</p>
                        <div className={styles.blogCardMeta}>
                          <span className={styles.blogDate}>
                            {formatDate(blog.meta.publishedDate)}
                          </span>
                          <span className={styles.blogReadTime}>{blog.meta.readTime}</span>
                        </div>
                      </div>
                      <div className={styles.blogCardArrow}>→</div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>{localized('GuruForU Home')}</Link>
            <Link href="/contact" className={styles.footerLink} prefetch={false}>{localized('Contact Us')}</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>{localized('Email Support')}</a>
            <Link href="/terms" className={styles.footerLink} prefetch={false}>{localized('Terms and Conditions')}</Link>
            <Link href="/privacy" className={styles.footerLink} prefetch={false}>{localized('Privacy Policy')}</Link>
          </nav>
          <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. {localized('All rights reserved.')}</p>
        </footer>
      </div>
    </div>
    </>
  )
}
