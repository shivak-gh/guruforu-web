import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogImage from '../../components/BlogImage'
import { getAllCategories, getBlogsByCategory, categoryToSlug } from '../lib/getBlogs'
import dynamicImport from 'next/dynamic'
import styles from './page.module.css'
import Script from 'next/script'

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamicImport(() => import('../../components/NavMenu'), {
  ssr: true,
})

// Optimize RSC caching to reduce duplicate requests
// Use ISR for better crawl consistency and lower server cost.
export const revalidate = 3600
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    categorySlug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  const categories = await getAllCategories()
  const category = categories.find(cat => cat.slug === categorySlug)
  
  if (!category) {
    return {
      title: 'Category Not Found | GuruForU',
      description: 'The requested blog category could not be found.',
    }
  }

  return {
    title: `${category.name} Guides for Parents & Students | GuruForU Blog`,
    description: `Browse ${category.count} ${category.count === 1 ? 'practical guide' : 'practical guides'} on ${category.name}. Actionable learning tips and tutoring insights from GuruForU.`,
    keywords: [
      `${category.name} online tutoring`,
      `${category.name} online learning`,
      `${category.name} learning tips`,
      `${category.name} for students`,
      'online learning resources',
      'online learning articles',
      'learning strategies',
      'student success tips',
      category.name.toLowerCase()
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
      title: `${category.name} Guides | GuruForU Blog`,
      description: `Explore ${category.count} ${category.count === 1 ? 'guide' : 'guides'} on ${category.name} with practical tips for students and parents.`,
      url: `https://www.guruforu.com/blog/${categorySlug}`,
      siteName: 'GuruForU',
      type: 'website',
      images: [
        {
          url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: `${category.name} Category`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Guides | GuruForU Blog`,
      description: `Practical ${category.name} learning guides from GuruForU for students and parents.`,
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: `https://www.guruforu.com/blog/${categorySlug}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  const categories = await getAllCategories()
  const category = categories.find(cat => cat.slug === categorySlug)
  const blogs = getBlogsByCategory(categorySlug)

  if (!category) {
    notFound()
  }

  const blogsList = await blogs

  if (blogsList.length === 0) {
    notFound()
  }

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

  // Generate comprehensive JSON-LD structured data for CollectionPage
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} | GuruForU Learning Resources`,
    description: `Explore ${category.count} ${category.count === 1 ? 'article' : 'articles'} in ${category.name} category. Expert insights on child education and learning.`,
    url: `https://www.guruforu.com/blog/${categorySlug}`,
    inLanguage: 'en-US',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.count,
      itemListElement: blogsList.map((blog, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.lead,
          url: `https://www.guruforu.com/blog/${categorySlug}/${blog.slug}`,
          datePublished: blog.meta.publishedDate,
          image: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        },
      })),
    },
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
        name: 'Resources',
        item: 'https://www.guruforu.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://www.guruforu.com/blog/${categorySlug}`,
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
        id="collection-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
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
        <div className={styles.categoryListing}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink} prefetch={false}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog" className={styles.breadcrumbLink} prefetch={false}>Resources</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{category.name}</span>
          </nav>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{category.name}</h1>
            <p className={styles.pageSubtitle}>
              <strong>{category.count}</strong> {category.count === 1 ? 'article' : 'articles'} in this category covering <strong>educational topics and learning strategies</strong>
            </p>
            <p className={styles.pageSubtitle}>
              Articles in this category offer practical advice and insights for parents and students. Read on for expert tips, curriculum guides, and strategies to support your child&apos;s learning.
            </p>
          </header>

          <div className={styles.blogGrid}>
            {blogsList.map((blog) => {
              const blogImage = blog.image || `/blog-images/online-education-category.jpg`
              return (
                <article key={blog.slug} className={styles.blogCard}>
                  <Link href={`/blog/${categorySlug}/${blog.slug}`} className={styles.blogCardLink} prefetch={false}>
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
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>GuruForU Home</Link>
            <Link href="/blog" className={styles.footerLink} prefetch={false}>Resources</Link>
            <Link href="/contact" className={styles.footerLink} prefetch={false}>Contact Us</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>Email Support</a>
            <Link href="/terms" className={styles.footerLink} prefetch={false}>Terms and Conditions</Link>
            <Link href="/privacy" className={styles.footerLink} prefetch={false}>Privacy Policy</Link>
          </nav>
          <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  )
}
