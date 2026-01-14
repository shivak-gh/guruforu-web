import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllCategories, getBlogsByCategory, categoryToSlug } from '../lib/getBlogs'
import styles from './page.module.css'
import Script from 'next/script'

// Optimize RSC caching to reduce duplicate requests
export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-static' // Force static generation

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
      title: 'Category Not Found | GuruForU Blog',
      description: 'The requested blog category could not be found.',
    }
  }

  return {
    title: `${category.name} | GuruForU Blog`,
    description: `Explore ${category.count} ${category.count === 1 ? 'article' : 'articles'} in ${category.name} category. Expert insights on child education and learning.`,
    keywords: [
      'GuruForU Blog',
      category.name,
      'Education Blog',
      'Online Learning',
      'Child Education',
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
      title: `${category.name} | GuruForU Blog`,
      description: `Explore ${category.count} ${category.count === 1 ? 'article' : 'articles'} in ${category.name} category. Expert insights on child education and learning.`,
      url: `https://guruforu.com/blog/${categorySlug}`,
      siteName: 'GuruForU',
      type: 'website',
      images: [
        {
          url: '/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: `${category.name} Category`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | GuruForU Blog`,
      description: `Explore ${category.count} ${category.count === 1 ? 'article' : 'articles'} in ${category.name} category.`,
      images: ['/guruforu-ai-education-logo-dark.png'],
    },
    alternates: {
      canonical: `https://guruforu.com/blog/${categorySlug}`,
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

  // Organization schema for better entity recognition
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GuruForU',
    url: 'https://guruforu.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://guruforu.com/guruforu-ai-education-logo-dark.png',
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://guruforu.com',
    ],
    description: 'Best Online Classes with AI-Powered Student Progress Tracker. Expert online tutors with AI-driven insights for personalized learning.',
  }

  // Generate JSON-LD structured data for CollectionPage
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} | GuruForU Blog`,
    description: `Explore ${category.count} ${category.count === 1 ? 'article' : 'articles'} in ${category.name} category. Expert insights on child education and learning.`,
    url: `https://guruforu.com/blog/${categorySlug}`,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
      logo: {
        '@type': 'ImageObject',
        url: 'https://guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 512,
        height: 512,
      },
    },
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
          url: `https://guruforu.com/blog/${categorySlug}/${blog.slug}`,
          datePublished: blog.meta.publishedDate,
          author: {
            '@type': 'Organization',
            name: 'GuruForU',
          },
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
        item: 'https://guruforu.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://guruforu.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://guruforu.com/blog/${categorySlug}`,
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
          <div className={styles.navLinks}>
            <Link href="/blog" className={styles.backLink} prefetch={false}>← All Blogs</Link>
            <Link href="/" className={styles.backLink} prefetch={false}>Home</Link>
          </div>
        </div>

        <div className={styles.categoryListing}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink} prefetch={false}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog" className={styles.breadcrumbLink} prefetch={false}>Blog</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{category.name}</span>
          </nav>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{category.name}</h1>
            <p className={styles.pageSubtitle}>
              {category.count} {category.count === 1 ? 'article' : 'articles'} in this category
            </p>
          </header>

          <div className={styles.blogGrid}>
            {blogsList.map((blog) => (
              <article key={blog.slug} className={styles.blogCard}>
                <Link href={`/blog/${categorySlug}/${blog.slug}`} className={styles.blogCardLink} prefetch={false}>
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
        </div>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/blog" className={styles.footerLink} prefetch={false}>All Blogs</Link>
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
