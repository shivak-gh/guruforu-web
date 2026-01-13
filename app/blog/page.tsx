import Link from 'next/link'
import { getAllBlogs } from './lib/getBlogs'
import styles from './page.module.css'

export const metadata = {
  title: 'Blog | GuruForU - Educational Insights and Learning Tips',
  description: 'Discover expert insights on child education, learning strategies, and AI-powered personalized learning. Read our latest blog posts on student progress tracking and academic success.',
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
  openGraph: {
    title: 'Blog | GuruForU - Educational Insights and Learning Tips',
    description: 'Discover expert insights on child education, learning strategies, and AI-powered personalized learning.',
    url: 'https://guruforu.com/blog',
    siteName: 'GuruForU',
    type: 'website',
  },
  alternates: {
    canonical: 'https://guruforu.com/blog',
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
        </div>

        <div className={styles.blogListing}>
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Our Blog</h1>
            <p className={styles.pageSubtitle}>
              Expert insights on child education, learning strategies, and AI-powered personalized learning
            </p>
          </header>

          {blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {blogs.map((blog) => (
                <article key={blog.slug} className={styles.blogCard}>
                  <Link href={`/blog/${blog.slug}`} className={styles.blogCardLink}>
                    <div className={styles.blogCardContent}>
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
