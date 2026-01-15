import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogs } from './lib/getBlogs'
import BlogCategoriesWrapper from '../components/BlogCategoriesWrapper'
import styles from './page.module.css'
import Script from 'next/script'

// Optimize RSC caching to reduce duplicate requests
export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-static' // Force static generation

export const metadata = {
  title: 'Education Blog | GuruForU Learning Insights',
  description: 'Expert insights on child education, learning strategies, and AI-powered personalized learning. Latest articles on student progress tracking and academic success.',
  keywords: [
    'GuruForU Blog',
    'Education Blog',
    'Online Learning Tips',
    'Child Education',
    'AI-Powered Learning',
    'Student Progress Tracking',
    'Personalized Learning',
    'Online Tuitions',
    'Parenting Education',
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
    title: 'Education Blog | GuruForU Learning Insights',
    description: 'Expert insights on child education, learning strategies, and AI-powered personalized learning.',
    url: 'https://www.guruforu.com/blog',
    siteName: 'GuruForU',
    type: 'website',
    images: [
      {
        url: '/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Blog',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Blog | GuruForU Learning Insights',
    description: 'Expert insights on child education, learning strategies, and AI-powered personalized learning.',
    images: ['/guruforu-ai-education-logo-dark.png'],
  },
  alternates: {
    canonical: 'https://www.guruforu.com/blog',
    types: {
      'application/rss+xml': 'https://www.guruforu.com/feed.xml',
    },
  },
}

export default async function BlogListing() {
  const blogs = await getAllBlogs()

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
  }

  // Generate JSON-LD structured data for Blog schema (minimized)
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'GuruForU Blog',
    url: 'https://www.guruforu.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
    },
    blogPost: blogs.map((blog) => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      url: `https://www.guruforu.com/blog/${blog.categorySlug}/${blog.slug}`,
      datePublished: blog.meta.publishedDate,
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
              priority
            />
          </Link>
        </div>

        <div className={styles.blogListing}>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Our Blog</h1>
            <p className={styles.pageSubtitle}>
              Expert insights on child education, learning strategies, and AI-powered personalized learning
            </p>
          </header>

          <BlogCategoriesWrapper />

          {blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {blogs.map((blog) => (
                <article key={blog.slug} className={styles.blogCard}>
                  <Link href={`/blog/${blog.categorySlug}/${blog.slug}`} className={styles.blogCardLink} prefetch={false}>
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
              ))}
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>Home</Link>
            <Link href="/contact" className={styles.footerLink} prefetch={false}>Contact Us</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>Email Support</a>
            <Link href="/terms" className={styles.footerLink} prefetch={false}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink} prefetch={false}>Privacy</Link>
          </nav>
          <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  )
}
