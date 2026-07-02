import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import BlogImage from '../../components/BlogImage'
import { getAllCategories, getBlogsByCategory, getAllBlogs } from '../lib/getBlogs'
import dynamicImport from 'next/dynamic'
import Script from 'next/script'
import PageFooter from '../../components/PageFooter'

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
    const blogs = await getAllBlogs()
    const post = blogs.find((b) => b.slug === categorySlug)
    if (post) {
      return {
        title: `${post.title} | GuruForU`,
        description: post.lead,
        alternates: {
          canonical: `https://www.guruforu.com/blog/${post.categorySlug}/${post.slug}`,
        },
      }
    }
    return {
      title: 'Category Not Found | GuruForU',
      description: 'The requested blog category could not be found.',
      robots: { index: false, follow: false },
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

  if (!category) {
    const blogs = await getAllBlogs()
    const post = blogs.find((b) => b.slug === categorySlug)
    if (post) {
      redirect(`/blog/${post.categorySlug}/${post.slug}`)
    }
    notFound()
  }

  const blogs = getBlogsByCategory(categorySlug)

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
      <div className="ip-layout">
<div className="ip-content">
        <div className="ip-category-listing">
          <nav className="ip-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="ip-link" prefetch={false}>Home</Link>
            <span className="ip-breadcrumb-separator">/</span>
            <Link href="/blog" className="ip-link" prefetch={false}>Resources</Link>
            <span className="ip-breadcrumb-separator">/</span>
            <span className="ip-breadcrumb-current">{category.name}</span>
          </nav>
          <header className="ip-header">
            <h1 className="ip-title">{category.name}</h1>
            <p className="ip-lead">
              <strong>{category.count}</strong> {category.count === 1 ? 'article' : 'articles'} in this category covering <strong>educational topics and learning strategies</strong>
            </p>
            <p className="ip-lead">
              Articles in this category offer practical advice and insights for parents and students. Read on for expert tips, curriculum guides, and strategies to support your child&apos;s learning.
            </p>
          </header>

          <div className="ip-blog-grid">
            {blogsList.map((blog) => {
              const blogImage = blog.image || `/blog-images/online-education-category.jpg`
              return (
                <article key={blog.slug} className="ip-blog-card">
                  <Link href={`/blog/${categorySlug}/${blog.slug}`} className="ip-blog-card-link" prefetch={false}>
                    <div className="ip-blog-card-image-wrapper">
                      <BlogImage
                        src={blogImage}
                        alt={blog.title}
                        width={400}
                        height={250}
                        className="ip-blog-card-image"
                        sizes="(max-width: 768px) 100vw, 400px"
                        fallbackSrc="/blog-images/online-education-category.jpg"
                      />
                    </div>
                    <div className="ip-blog-card-content">
                      <div className="ip-blog-card-category">{blog.category}</div>
                      <h2 className="ip-blog-card-title">{blog.title}</h2>
                      <p className="ip-blog-card-lead">{blog.lead}</p>
                      <div className="ip-blog-card-meta">
                        <span className="ip-blog-date">
                          {formatDate(blog.meta.publishedDate)}
                        </span>
                        <span className="ip-blog-read-time">{blog.meta.readTime}</span>
                      </div>
                    </div>
                    <div className="ip-blog-card-arrow">→</div>
                  </Link>
                </article>
              )
            })}
          </div>
        </div>

        <PageFooter />
      </div>
    </div>
    </>
  )
}
