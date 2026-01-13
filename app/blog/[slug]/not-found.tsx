import Link from 'next/link'
import styles from './not-found.module.css'

export default function BlogNotFound() {
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

        <div className={styles.notFoundContent}>
          <h1 className={styles.title}>Blog Post Not Found</h1>
          <p className={styles.message}>
            The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className={styles.actions}>
            <Link href="/blog" className={styles.button}>
              View All Blogs
            </Link>
            <Link href="/" className={styles.buttonSecondary}>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
