import Link from 'next/link'
import { headers } from 'next/headers'
import { detectLocale, localizeText } from '../../lib/locale'
import { getCategoryImage } from '../blog/lib/categoryImages'
import CategoryImage from './CategoryImage'
import styles from './BlogCategories.module.css'

interface BlogCategoriesProps {
  categories: Array<{
    name: string
    slug: string
    count: number
  }>
}

export default async function BlogCategories({ categories }: BlogCategoriesProps) {
  const headersList = await headers()
  const localeInfo = detectLocale(headersList)
  const localized = (text: string) => localizeText(text, localeInfo.region)
  
  if (categories.length === 0) {
    return null
  }

  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.categoriesTitle}>{localized('Explore Our Blog Categories')}</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/${category.slug}`}
            className={styles.categoryCard}
            prefetch={false}
          >
            <div className={styles.categoryImageWrapper}>
              <CategoryImage
                src={getCategoryImage(category.slug)}
                alt={`${category.name} category`}
                width={400}
                height={250}
                className={styles.categoryImage}
              />
            </div>
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.categoryCount}>{category.count} {category.count === 1 ? localized('article') : localized('articles')}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
