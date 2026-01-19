import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogBySlug, getAllBlogs } from '../../lib/getBlogs'
import dynamicImport from 'next/dynamic'
import styles from './page.module.css'
import Script from 'next/script'

// Helper function to convert URLs in text to clickable links
function linkify(text: string) {
  // Match URLs (http, https, www, or khanacademy.org)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|khanacademy\.org[^\s]*)/gi
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match
  
  // Reset regex lastIndex
  urlRegex.lastIndex = 0
  
  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Process the URL match
    let url = match[0]
    // Add https:// if URL starts with www or khanacademy.org
    if (url.startsWith('www.') || url.startsWith('khanacademy.org')) {
      url = 'https://' + url
    }
    
    parts.push(
      <a 
        key={match.index}
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.externalLink}
      >
        {match[0]}
      </a>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
}

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamicImport(() => import('../../../components/NavMenu'), {
  ssr: true,
})

// Optimize RSC caching to reduce duplicate requests
// Disable caching during development/stabilization
// Set DISABLE_CACHE=false in environment to enable caching (revalidate=3600, dynamic='force-static')
export const revalidate = 0 // Disabled for stability - set to 3600 when ready
export const dynamic = 'force-dynamic' // Force dynamic rendering - set to 'force-static' when ready

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map((blog) => ({
    categorySlug: blog.categorySlug,
    slug: blog.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; slug: string }> }) {
  const { categorySlug, slug } = await params
  const blog = await getBlogBySlug(slug)
  
  if (!blog || blog.categorySlug !== categorySlug) {
    return {
      title: 'Blog Post Not Found | GuruForU',
      description: 'The requested blog post could not be found.',
    }
  }

  // Extract keywords from title and lead
  const keywords = [
    'GuruForU',
    'Online Classes',
    'Online Tuitions',
    'AI-Powered Learning',
    'Student Progress Tracker',
    'Personalized Learning',
    ...blog.title.toLowerCase().split(' ').filter((word: string) => word.length > 3),
  ]

  // Optimize title length (max 60 chars recommended)
  const optimizedTitle = blog.title.length > 55 
    ? `${blog.title.substring(0, 52)}... | GuruForU`
    : `${blog.title} | GuruForU`
  
  // Optimize description length (150-160 chars recommended)
  const optimizedDescription = blog.lead.length > 160
    ? `${blog.lead.substring(0, 157)}...`
    : blog.lead

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywords,
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
      title: optimizedTitle,
      description: optimizedDescription,
      url: `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
      siteName: 'GuruForU',
      type: 'article',
      publishedTime: blog.meta.publishedDate,
      modifiedTime: blog.meta.publishedDate,
      authors: ['GuruForU'],
      images: [
        {
          url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title.length > 70 ? `${blog.title.substring(0, 67)}...` : blog.title,
      description: optimizedDescription,
      images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
      creator: '@guruforu_official',
      site: '@guruforu_official',
    },
    alternates: {
      canonical: `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
    },
  }
}

export default async function BlogDetail({ params }: { params: Promise<{ categorySlug: string; slug: string }> }) {
  const { categorySlug, slug } = await params
  const blog = await getBlogBySlug(slug)
  const allBlogs = await getAllBlogs()

  if (!blog || blog.categorySlug !== categorySlug) {
    notFound()
  }

  // Get related posts (same category, excluding current post, limit to 3)
  const relatedPosts = allBlogs
    .filter(b => b.categorySlug === categorySlug && b.slug !== slug)
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Extract keywords from title and lead for structured data
  const keywords = [
    'GuruForU',
    'Online Classes',
    'Online Tuitions',
    'AI-Powered Learning',
    'Student Progress Tracker',
    'Personalized Learning',
    ...blog.title.toLowerCase().split(' ').filter((word: string) => word.length > 3),
  ]

  // Calculate word count from blog content
  const calculateWordCount = () => {
    if (!blog.lead) return 0
    let text = blog.lead + ' '
    if (blog.sections && Array.isArray(blog.sections)) {
      blog.sections.forEach((section: any) => {
        if (section.content && Array.isArray(section.content)) {
          text += section.content.join(' ') + ' '
        }
        if (section.highlights && Array.isArray(section.highlights)) {
          section.highlights.forEach((h: any) => {
            if (h.title) text += h.title + ' '
            if (h.text) text += h.text + ' '
          })
        }
        if (section.strategies && Array.isArray(section.strategies)) {
          section.strategies.forEach((s: any) => {
            if (s.title) text += s.title + ' '
            if (s.text) text += s.text + ' '
          })
        }
        if (section.list && Array.isArray(section.list)) {
          section.list.forEach((l: any) => {
            if (l.item) text += l.item + ' '
          })
        }
      })
    }
    return text.trim().split(/\s+/).filter((word: string) => word.length > 0).length
  }

  // Generate full article body text for schema
  const generateArticleBody = () => {
    if (!blog.lead) return ''
    let body = blog.lead + '\n\n'
    if (blog.sections && Array.isArray(blog.sections)) {
      blog.sections.forEach((section: any) => {
        if (section.title) body += section.title + '\n\n'
        if (section.content && Array.isArray(section.content)) {
          body += section.content.join('\n\n') + '\n\n'
        }
        if (section.highlights && Array.isArray(section.highlights)) {
          section.highlights.forEach((h: any) => {
            if (h.title && h.text) {
              body += h.title + ': ' + h.text + '\n\n'
            }
          })
        }
        if (section.strategies && Array.isArray(section.strategies)) {
          section.strategies.forEach((s: any) => {
            if (s.title && s.text) {
              body += s.title + ': ' + s.text + '\n\n'
            }
          })
        }
        if (section.list && Array.isArray(section.list)) {
          section.list.forEach((l: any) => {
            if (l.item) body += '• ' + l.item + '\n'
          })
          body += '\n'
        }
      })
    }
    return body.trim()
  }

  const wordCount = calculateWordCount()
  const articleBody = generateArticleBody()

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

  // Generate JSON-LD structured data for BlogPosting schema (minimized for better text-to-HTML ratio)
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.lead,
    datePublished: blog.meta.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'GuruForU',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
    },
    url: `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.category,
        item: `https://www.guruforu.com/blog/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: blog.title,
        item: `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
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
        id="blog-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
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
        <article className={styles.article}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink} prefetch={false}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog" className={styles.breadcrumbLink} prefetch={false}>Blog</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href={`/blog/${categorySlug}`} className={styles.breadcrumbLink} prefetch={false}>{blog.category}</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{blog.title}</span>
          </nav>
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>{blog.title}</h1>
            <p className={styles.meta}>
              Published on {formatDate(blog.meta.publishedDate)} | 
              <span className={styles.readTime}> {blog.meta.readTime}</span>
            </p>
          </header>

          <div className={styles.articleContent}>
            <section className={styles.section}>
              <p className={styles.lead}>{linkify(blog.lead)}</p>
            </section>

            {blog.sections && blog.sections.map((section: any, index: number) => (
              <section key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                
                {section.content && section.content.map((paragraph: string, pIndex: number) => (
                  <p key={pIndex} className={styles.text}>{linkify(paragraph)}</p>
                ))}

                {section.highlights && section.highlights.map((highlight: any, hIndex: number) => (
                  <div key={hIndex} className={styles.highlightBox}>
                    <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                    <p className={styles.highlightText}>{linkify(highlight.text)}</p>
                  </div>
                ))}

                {section.strategies && section.strategies.map((strategy: any, sIndex: number) => (
                  <div key={sIndex} className={styles.strategyBox}>
                    <h3 className={styles.strategyTitle}>{strategy.title}</h3>
                    <p className={styles.strategyText}>{linkify(strategy.text)}</p>
                  </div>
                ))}

                {section.list && (
                  <ul className={styles.list}>
                    {section.list.map((item: any, lIndex: number) => {
                      const parts = item.item.split(':')
                      if (parts.length > 1) {
                        return (
                          <li key={lIndex}>
                            <strong>{parts[0]}:</strong> {linkify(parts.slice(1).join(':'))}
                          </li>
                        )
                      }
                      return <li key={lIndex}>{linkify(item.item)}</li>
                    })}
                  </ul>
                )}
              </section>
            ))}

            {blog.cta && (
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaTitle}>{blog.cta.title}</h3>
                <p className={styles.ctaText}>{blog.cta.text}</p>
                <Link href={blog.cta.buttonLink} className={styles.ctaButton} prefetch={false}>
                  {blog.cta.buttonText}
                </Link>
              </div>
            )}
          </div>
        </article>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink} prefetch={false}>GuruForU Home</Link>
            <Link href="/blog" className={styles.footerLink} prefetch={false}>Education Blog</Link>
            <Link href={`/blog/${categorySlug}`} className={styles.footerLink} prefetch={false}>{blog.category}</Link>
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
