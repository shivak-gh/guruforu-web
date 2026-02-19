import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogBySlug, getAllBlogs, getRelatedBlogs, getBlogModifiedDate } from '../../lib/getBlogs'
import { defaultBlogImage } from '../../lib/categoryImages'
import BlogImage from '../../../components/BlogImage'
import { getAuthor } from '../../../../lib/authors'
import dynamicImport from 'next/dynamic'
import styles from './page.module.css'
import Script from 'next/script'
import { generateHreflangLinks } from '../../../../lib/locale'

// Descriptive anchor text for external links (SEO: avoid URL-only anchor text)
function getAnchorTextForUrl(url: string): string {
  try {
    const normalized = url.startsWith('http') ? url : 'https://' + url
    const u = new URL(normalized)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname.toLowerCase()

    if (host.includes('khanacademy.org')) {
      if (path.includes('fraction') || path.includes('arith-review-fractions')) return 'Khan Academy fractions'
      if (path.includes('decimal') || path.includes('arith-decimals')) return 'Khan Academy decimals'
      if (path.includes('algebra')) return 'Khan Academy algebra'
      if (path.includes('geometry') || path.includes('area-perimeter') || path.includes('volume')) return 'Khan Academy geometry'
      if (path.includes('order-of-operations') || path.includes('exponents-and-order')) return 'Khan Academy order of operations'
      if (path.includes('fifth-grade') || path.includes('cc-fifth-grade')) return 'Khan Academy Grade 5 math'
      if (path.includes('sixth-grade') || path.includes('cc-sixth-grade')) return 'Khan Academy Grade 6 math'
      if (path.includes('seventh-grade') || path.includes('cc-seventh-grade')) return 'Khan Academy Grade 7 math'
      if (path.includes('eighth-grade') || path.includes('cc-eighth-grade')) return 'Khan Academy Grade 8 math'
      if (path.includes('third-grade') || path.includes('cc-third-grade')) return 'Khan Academy Grade 3 math'
      if (path.includes('fourth-grade') || path.includes('cc-fourth-grade')) return 'Khan Academy Grade 4 math'
      if (path.includes('k-8-grades') || path.includes('k-8')) return 'Khan Academy K–8 math'
      if (path.includes('measurement-and-data') || path.includes('imp-measurement')) return 'Khan Academy measurement and data'
      if (path.includes('multiply') || path.includes('multi-digit')) return 'Khan Academy multiplication and division'
      if (path.includes('long-division') || path.includes('remainder')) return 'Khan Academy long division'
      if (path.includes('multiplying-fractions')) return 'Khan Academy multiplying fractions'
      if (path.includes('unlike-denominators') || path.includes('add-sub-fractions')) return 'Khan Academy adding fractions with unlike denominators'
      if (path.includes('place-value') || path.includes('decimals-intro')) return 'Khan Academy decimal place value'
      if (path.includes('adding-decimals') || path.includes('add-decimals')) return 'Khan Academy adding and subtracting decimals'
      if (path.includes('perimeter-and-area') || path.includes('area-basics')) return 'Khan Academy area and perimeter'
      if (path.includes('rectangular-prism') || path.includes('volume-of-a-rectangular')) return 'Khan Academy volume'
      if (path.includes('order-of-operations')) return 'Khan Academy order of operations'
      return 'Khan Academy math'
    }

    // Other domains: use hostname as descriptive text
    return `Open on ${host}`
  } catch {
    return 'Learn more'
  }
}

// Helper function to convert URLs in text to clickable links (with descriptive anchor text for SEO)
function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+|khanacademy\.org[^\s)]*)/gi
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match

  urlRegex.lastIndex = 0

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    let url = match[0]
    const trailing = url.match(/[.,;:!?)]+$/)
    if (trailing) url = url.slice(0, -trailing[0].length)
    if (url.startsWith('www.') || url.startsWith('khanacademy.org')) {
      url = 'https://' + url
    }

    const anchorText = getAnchorTextForUrl(url)
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.externalLink}
        title={url}
      >
        {anchorText}
      </a>
    )
    if (trailing) parts.push(trailing[0])

    lastIndex = match.index + match[0].length
  }

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

  // Extract and enhance keywords from title and lead; use optional blog.keywords for SEO
  const titleWords = blog.title.toLowerCase().split(' ').filter((word: string) => word.length > 3)
  const categoryKeywords = blog.category.toLowerCase() === 'math' 
    ? ['online math tutoring', 'math tutoring online', 'math help online']
    : blog.category.toLowerCase() === 'science'
    ? ['online science tutoring', 'science tutoring online', 'science help online']
    : blog.category.toLowerCase() === 'technology'
    ? ['online technology tutoring', 'coding tutoring online', 'SQL tutoring', 'programming for students']
    : []
  const blogKeywords = (blog as { keywords?: string[] }).keywords || []
  const keywords = [
    `${blog.category.toLowerCase()} online tutoring`,
    `online ${blog.category.toLowerCase()} classes`,
    `${blog.category.toLowerCase()} learning tips`,
    'online tutoring blog',
    'AI-powered learning',
    'student progress tracking',
    'personalized learning',
    'online education',
    ...titleWords,
    ...categoryKeywords,
    ...blogKeywords,
  ]

  // Use optional CTR-focused meta overrides; otherwise optimize defaults
  const metaTitle = (blog as { metaTitle?: string }).metaTitle
  const metaDescription = (blog as { metaDescription?: string }).metaDescription
  const optimizedTitle = metaTitle
    ? (metaTitle.length > 55 ? `${metaTitle.substring(0, 52)}... | GuruForU` : `${metaTitle} | GuruForU`)
    : blog.title.length > 55
      ? `${blog.title.substring(0, 52)}... | GuruForU`
      : `${blog.title} | GuruForU`
  const optimizedDescription = metaDescription
    ? (metaDescription.length > 160 ? `${metaDescription.substring(0, 157)}...` : metaDescription)
    : blog.lead.length > 160
      ? `${blog.lead.substring(0, 157)}...`
      : blog.lead

  // Generate hreflang links for this page (all locales point to same URL for single-URL site)
  const baseUrl = 'https://www.guruforu.com'
  const currentPath = `/blog/${categorySlug}/${slug}`
  const hreflangLinks = generateHreflangLinks(baseUrl, currentPath)
  const languagesMap = hreflangLinks.reduce((acc, link) => {
    acc[link.hreflang] = link.href
    return acc
  }, {} as Record<string, string>)

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
      authors: [getAuthor((blog as { author?: string }).author).name],
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
      languages: languagesMap,
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
  const relatedBlogs = await getRelatedBlogs(slug, categorySlug, 4)

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

  // Generate comprehensive JSON-LD structured data for BlogPosting/Article schema
  const blogFeaturedImage = (blog as { image?: string }).image || defaultBlogImage
  const dateModified = (await getBlogModifiedDate(slug)) || blog.meta.publishedDate
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.lead,
    image: {
      '@type': 'ImageObject',
      url: `https://www.guruforu.com${blogFeaturedImage}`,
      width: 1200,
      height: 630,
    },
    datePublished: blog.meta.publishedDate,
    dateModified,
    author: (() => {
      const a = getAuthor((blog as { author?: string }).author)
      return {
        '@type': 'Organization' as const,
        name: a.name,
        ...(a.url && { url: a.url }),
      }
    })(),
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
    },
    url: `https://www.guruforu.com/blog/${categorySlug}/${slug}`,
    ...(articleBody && { articleBody: articleBody }),
    ...(wordCount > 0 && { wordCount: wordCount }),
    keywords: keywords.join(', '),
    inLanguage: 'en-US',
    articleSection: blog.category,
  }

  // Related articles ItemList schema for SEO
  const relatedArticlesSchema = relatedBlogs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Related Articles',
    itemListElement: relatedBlogs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Article',
        name: b.title,
        url: `https://www.guruforu.com/blog/${b.categorySlug}/${b.slug}`,
      },
    })),
  } : null

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

  // FAQPage structured data for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `How can GuruForU help with ${blog.category.toLowerCase()} learning?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `GuruForU provides AI-powered online tutoring for ${blog.category.toLowerCase()} with personalized learning paths, real-time progress tracking, and expert tutors. Our platform adapts to your child's learning style and provides detailed mastery reports to identify strengths and areas for improvement.`
        }
      },
      {
        '@type': 'Question',
        'name': 'What makes GuruForU different from other online tutoring platforms?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'GuruForU combines expert human tutors with AI-powered learning analytics. Our platform provides comprehensive student progress tracking, personalized learning paths tailored to each student\'s needs, and detailed mastery reports that help parents and students understand learning progress in real-time.'
        }
      },
      {
        '@type': 'Question',
        'name': `Can I track my child's progress in ${blog.category.toLowerCase()}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes! GuruForU's AI-powered student progress tracker monitors your child's learning journey in real-time. You'll receive detailed insights into their academic performance, mastery levels, and areas that need additional support. Our comprehensive reports help you stay informed about your child's educational progress.`
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I get started with GuruForU online tutoring?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Getting started is easy! Book a free consultation session to discuss your child\'s learning needs. Our AI diagnostics will identify learning gaps and create a personalized roadmap. You can also contact us for more information about our online tutoring services.'
        }
      }
    ]
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
      {relatedArticlesSchema && (
        <Script
          id="related-articles-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedArticlesSchema) }}
        />
      )}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

          <div className={styles.featuredImageWrapper}>
            <BlogImage
              src={(blog as { image?: string }).image || defaultBlogImage}
              alt={blog.title}
              width={1200}
              height={630}
              className={styles.featuredImage}
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              fallbackSrc="/blog-images/online-education-category.jpg"
            />
          </div>

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

            {/* Author box for EEAT */}
            {(() => {
              const author = getAuthor((blog as { author?: string }).author)
              return (
                <section className={styles.authorBox} aria-label="About the author">
                  <div className={styles.authorBoxInner}>
                    <p className={styles.authorRole}>{author.role}</p>
                    <h3 className={styles.authorName}>{author.name}</h3>
                    <p className={styles.authorBio}>{author.bio}</p>
                    {author.url && (
                      <Link href={author.url} className={styles.authorLink} prefetch={false}>
                        Learn more about our team
                      </Link>
                    )}
                  </div>
                </section>
              )
            })()}

            {/* FAQ Section */}
            <section className={styles.faqSection}>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How can GuruForU help with {blog.category.toLowerCase()} learning?</h3>
                <p className={styles.text}>
                  GuruForU provides AI-powered online tutoring for {blog.category.toLowerCase()} with personalized learning paths, 
                  real-time progress tracking, and expert tutors. Our platform adapts to your child&apos;s learning style and 
                  provides detailed mastery reports to identify strengths and areas for improvement.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What makes GuruForU different from other online tutoring platforms?</h3>
                <p className={styles.text}>
                  GuruForU combines expert human tutors with AI-powered learning analytics. Our platform provides 
                  comprehensive student progress tracking, personalized learning paths tailored to each student&apos;s needs, 
                  and detailed mastery reports that help parents and students understand learning progress in real-time.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I track my child&apos;s progress in {blog.category.toLowerCase()}?</h3>
                <p className={styles.text}>
                  Yes! GuruForU&apos;s AI-powered student progress tracker monitors your child&apos;s learning journey in real-time. 
                  You&apos;ll receive detailed insights into their academic performance, mastery levels, and areas that need 
                  additional support. Our comprehensive reports help you stay informed about your child&apos;s educational progress.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I get started with GuruForU online tutoring?</h3>
                <p className={styles.text}>
                  Getting started is easy! <Link href="/free-session" className={styles.link}>Book a free consultation session</Link> to 
                  discuss your child&apos;s learning needs. Our AI diagnostics will identify learning gaps and create a personalized 
                  roadmap. You can also <Link href="/contact" className={styles.link}>contact us</Link> for more information about our 
                  online tutoring services.
                </p>
              </div>
            </section>

            {blog.cta && (
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaTitle}>{blog.cta.title}</h3>
                <p className={styles.ctaText}>{blog.cta.text}</p>
                <Link href={blog.cta.buttonLink} className={styles.ctaButton} prefetch={false}>
                  {blog.cta.buttonText}
                </Link>
              </div>
            )}

            {relatedBlogs.length > 0 && (
              <section className={styles.relatedArticles} aria-label="Related articles">
                <h2 className={styles.sectionTitle}>Related Articles</h2>
                <ul className={styles.relatedArticlesList}>
                  {relatedBlogs.map((related) => {
                    const relatedImage = (related as { image?: string }).image || defaultBlogImage
                    return (
                      <li key={related.slug} className={styles.relatedArticleCard}>
                        <Link href={`/blog/${related.categorySlug}/${related.slug}`} className={styles.relatedArticleCardLink} prefetch={false}>
                          <span className={styles.relatedArticleImageWrap}>
                            <BlogImage
                              src={relatedImage}
                              alt=""
                              width={280}
                              height={160}
                              className={styles.relatedArticleImage}
                              sizes="(max-width: 600px) 100vw, 280px"
                            />
                          </span>
                          <span className={styles.relatedArticleCardContent}>
                            <span className={styles.relatedArticleCardTitle}>{related.title}</span>
                            <span className={styles.relatedArticleCardMeta}>{related.meta.readTime}</span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
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
