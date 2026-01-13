import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogBySlug, getAllBlogs } from '../../lib/getBlogs'
import styles from './page.module.css'
import Script from 'next/script'

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

  return {
    title: `${blog.title} | GuruForU Blog`,
    description: blog.lead,
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
      title: `${blog.title} | GuruForU Blog`,
      description: blog.lead,
      url: `https://guruforu.com/blog/${categorySlug}/${slug}`,
      siteName: 'GuruForU',
      type: 'article',
      publishedTime: blog.meta.publishedDate,
      authors: ['GuruForU'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.lead,
    },
    alternates: {
      canonical: `https://guruforu.com/blog/${categorySlug}/${slug}`,
    },
  }
}

export default async function BlogDetail({ params }: { params: Promise<{ categorySlug: string; slug: string }> }) {
  const { categorySlug, slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog || blog.categorySlug !== categorySlug) {
    notFound()
  }

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

  // Organization schema for better entity recognition
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GuruForU',
    url: 'https://guruforu.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://guruforu.com/guruforu-ai-education-logo.png',
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://guruforu.com',
    ],
    description: 'Best Online Classes with AI-Powered Student Progress Tracker. Expert online tutors with AI-driven insights for personalized learning.',
  }

  // Generate JSON-LD structured data for BlogPosting schema (more specific than Article)
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.lead,
    image: [
      {
        '@type': 'ImageObject',
        url: 'https://guruforu.com/guruforu-ai-education-logo.png',
        width: 1200,
        height: 630,
      },
    ],
    datePublished: blog.meta.publishedDate,
    dateModified: blog.meta.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'GuruForU',
      url: 'https://guruforu.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GuruForU',
      logo: {
        '@type': 'ImageObject',
        url: 'https://guruforu.com/guruforu-ai-education-logo.png',
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://guruforu.com/blog/${categorySlug}/${slug}`,
    },
    articleSection: blog.category,
    keywords: keywords.join(', '),
    articleBody: articleBody,
    wordCount: wordCount,
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: blog.category,
    },
    url: `https://guruforu.com/blog/${categorySlug}/${slug}`,
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
        name: blog.category,
        item: `https://guruforu.com/blog/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: blog.title,
        item: `https://guruforu.com/blog/${categorySlug}/${slug}`,
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
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>

        <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.homeLink}>
            <img src="/guruforu-ai-education-logo.png" alt="GuruForU Logo" className={styles.logoImage} />
          </Link>
          <Link href={`/blog/${categorySlug}`} className={styles.backLink}>← Back to {blog.category}</Link>
        </div>

        <article className={styles.article}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog" className={styles.breadcrumbLink}>Blog</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href={`/blog/${categorySlug}`} className={styles.breadcrumbLink}>{blog.category}</Link>
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
              <p className={styles.lead}>{blog.lead}</p>
            </section>

            {blog.sections && blog.sections.map((section: any, index: number) => (
              <section key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                
                {section.content && section.content.map((paragraph: string, pIndex: number) => (
                  <p key={pIndex} className={styles.text}>{paragraph}</p>
                ))}

                {section.highlights && section.highlights.map((highlight: any, hIndex: number) => (
                  <div key={hIndex} className={styles.highlightBox}>
                    <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                    <p className={styles.highlightText}>{highlight.text}</p>
                  </div>
                ))}

                {section.strategies && section.strategies.map((strategy: any, sIndex: number) => (
                  <div key={sIndex} className={styles.strategyBox}>
                    <h3 className={styles.strategyTitle}>{strategy.title}</h3>
                    <p className={styles.strategyText}>{strategy.text}</p>
                  </div>
                ))}

                {section.list && (
                  <ul className={styles.list}>
                    {section.list.map((item: any, lIndex: number) => {
                      const parts = item.item.split(':')
                      if (parts.length > 1) {
                        return (
                          <li key={lIndex}>
                            <strong>{parts[0]}:</strong> {parts.slice(1).join(':')}
                          </li>
                        )
                      }
                      return <li key={lIndex}>{item.item}</li>
                    })}
                  </ul>
                )}
              </section>
            ))}

            {blog.cta && (
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaTitle}>{blog.cta.title}</h3>
                <p className={styles.ctaText}>{blog.cta.text}</p>
                <Link href={blog.cta.buttonLink} className={styles.ctaButton}>
                  {blog.cta.buttonText}
                </Link>
              </div>
            )}
          </div>
        </article>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href={`/blog/${categorySlug}`} className={styles.footerLink}>{blog.category}</Link>
            <Link href="/blog" className={styles.footerLink}>All Blogs</Link>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            <a href="mailto:support@guruforu.com" className={styles.footerLink}>Email Support</a>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
          </nav>
          <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  )
}
