import Link from 'next/link'
import { localizeText } from '../../lib/locale'
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

const CATEGORY_ICONS: Record<string, string> = {
  math: '📐',
  science: '🔬',
  technology: '💻',
  'learning-strategies': '🎯',
  'study-tips': '📚',
  'parenting-guide': '👨‍👩‍👧',
  'online-education': '🌐',
  'computer-science': '⌨️',
}

function getCategoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] ?? '📖'
}

export default async function BlogCategories({ categories }: BlogCategoriesProps) {
  const localized = (text: string) => localizeText(text, 'DEFAULT')

  if (categories.length === 0) {
    return null
  }

  return (
    <section className={styles.categoriesSection} aria-labelledby="topics-heading">
      <div className={styles.categoriesHead}>
        <h2 id="topics-heading" className={styles.categoriesTitle}>
          {localized('Explore by Topic')}
        </h2>
        <p className={styles.categoriesDesc}>
          {localized('Browse practical guides by subject — for parents and students.')}
        </p>
      </div>
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
                alt={`${category.name} — education articles and resources`}
                className={styles.categoryImage}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className={styles.categoryIcon} aria-hidden="true">
                {getCategoryIcon(category.slug)}
              </span>
            </div>
            <div className={styles.categoryContent}>
              <div className={styles.categoryText}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <span className={styles.categoryCount}>
                  {category.count}{' '}
                  {category.count === 1 ? localized('article') : localized('articles')}
                </span>
              </div>
              <span className={styles.categoryArrow} aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
