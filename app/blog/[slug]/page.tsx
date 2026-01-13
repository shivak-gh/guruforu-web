import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogBySlug, getAllBlogs } from '../lib/getBlogs'
import styles from './page.module.css'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
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
    ...blog.title.toLowerCase().split(' ').filter(word => word.length > 3),
  ]

  return {
    title: `${blog.title} | GuruForU Blog`,
    description: blog.lead,
    keywords: keywords,
    openGraph: {
      title: `${blog.title} | GuruForU Blog`,
      description: blog.lead,
      url: `https://guruforu.com/blog/${blog.slug}`,
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
      canonical: `https://guruforu.com/blog/${blog.slug}`,
    },
  }
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradient}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.homeLink}>
            <img src="/guruforu-ai-education-logo.png" alt="GuruForU Logo" className={styles.logoImage} />
          </Link>
          <Link href="/blog" className={styles.backLink}>← Back to Blog</Link>
        </div>

        <article className={styles.article}>
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

            {blog.sections.map((section: any, index: number) => (
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

            <div className={styles.ctaBox}>
              <h3 className={styles.ctaTitle}>{blog.cta.title}</h3>
              <p className={styles.ctaText}>{blog.cta.text}</p>
              <Link href={blog.cta.buttonLink} className={styles.ctaButton}>
                {blog.cta.buttonText}
              </Link>
            </div>
          </div>
        </article>

        <footer className={styles.footer}>
          <nav className={styles.footerLinks}>
            <Link href="/blog" className={styles.footerLink}>All Blogs</Link>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
          </nav>
          <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
