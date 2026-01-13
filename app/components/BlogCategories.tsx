import Link from 'next/link'
import styles from './BlogCategories.module.css'

interface BlogCategoriesProps {
  categories: Array<{
    name: string
    slug: string
    count: number
  }>
}

export default function BlogCategories({ categories }: BlogCategoriesProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.categoriesTitle}>Explore Our Blog Categories</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/${category.slug}`}
            className={styles.categoryCard}
          >
            <h3 className={styles.categoryName}>{category.name}</h3>
            <p className={styles.categoryCount}>{category.count} {category.count === 1 ? 'article' : 'articles'}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
