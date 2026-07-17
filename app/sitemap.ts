import { getAllBlogs, getAllCategories, getBlogsByCategory, getBlogModifiedDate } from './blog/lib/getBlogs'
import { defaultBlogImage } from './blog/lib/categoryImages'
import { MetadataRoute } from 'next'

// Last significant content update per static page. Update these when page
// content meaningfully changes. Do NOT derive from file mtime — CI builds
// reset mtimes on every deploy, which made every URL claim it changed today
// and taught Google to distrust our lastmod values entirely.
const STATIC_PAGE_DATES: Record<string, string> = {
  '/': '2026-07-17',
  '/blog': '2026-07-17',
  '/contact': '2026-07-02',
  '/free-session': '2026-07-02',
  '/about': '2026-07-17',
  '/how-it-works': '2026-07-17',
  '/site-map': '2026-03-27',
  '/terms': '2026-07-02',
  '/privacy': '2026-07-02',
  '/shipping': '2026-07-02',
  '/cancellation-refunds': '2026-07-02',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guruforu.com'

  // Helper function to create sitemap entry
  const createSitemapEntry = (
    path: string,
    lastModified: Date,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: number,
    images?: string[]
  ): MetadataRoute.Sitemap[0] => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
    ...(images && images.length > 0 ? { images } : {}),
  })

  const staticDate = (path: string) => new Date(STATIC_PAGE_DATES[path])

  // Only include indexable posts — stubs are noindexed until expanded, and
  // listing noindexed URLs in the sitemap sends contradictory signals.
  const allBlogs = await getAllBlogs()
  const blogs = allBlogs.filter((blog) => blog.indexable)
  const categories = await getAllCategories()

  // Most recent indexable blog date for /blog lastModified
  const latestBlogDate = blogs.length > 0
    ? new Date(blogs[0].meta.publishedDate)
    : staticDate('/blog')

  const blogListingDate = staticDate('/blog')

  const staticPages = [
    createSitemapEntry('/', staticDate('/'), 'weekly', 1.0),
    createSitemapEntry('/blog', latestBlogDate > blogListingDate ? latestBlogDate : blogListingDate, 'daily', 0.9),
    createSitemapEntry('/contact', staticDate('/contact'), 'monthly', 0.8),
    createSitemapEntry('/free-session', staticDate('/free-session'), 'weekly', 0.9),
    createSitemapEntry('/about', staticDate('/about'), 'monthly', 0.8),
    createSitemapEntry('/how-it-works', staticDate('/how-it-works'), 'monthly', 0.8),
    createSitemapEntry('/site-map', staticDate('/site-map'), 'weekly', 0.7),
  ]

  // Static pages - Legal/Policy pages
  const legalPages = [
    createSitemapEntry('/terms', staticDate('/terms'), 'yearly', 0.5),
    createSitemapEntry('/privacy', staticDate('/privacy'), 'yearly', 0.5),
    createSitemapEntry('/shipping', staticDate('/shipping'), 'yearly', 0.5),
    createSitemapEntry('/cancellation-refunds', staticDate('/cancellation-refunds'), 'yearly', 0.5),
  ]

  // Create blog category URLs (lastModified = latest indexable post in that category)
  const categoryUrls = await Promise.all(
    categories.map(async (category) => {
      const catBlogs = (await getBlogsByCategory(category.slug)).filter((blog) => blog.indexable)
      const latestInCategory = catBlogs.length > 0
        ? new Date(catBlogs[0].meta.publishedDate)
        : staticDate('/blog')
      return createSitemapEntry(`/blog/${category.slug}`, latestInCategory, 'daily', 0.8)
    })
  )

  // Create blog post URLs with featured image for image sitemap
  const blogUrls = await Promise.all(
    blogs.map(async (blog) => {
      const imagePath = (blog as { image?: string }).image || defaultBlogImage
      const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`
      const modified = await getBlogModifiedDate(blog.slug)
      const lastModified = modified ? new Date(modified) : new Date(blog.meta.publishedDate)
      return createSitemapEntry(
        `/blog/${blog.categorySlug}/${blog.slug}`,
        lastModified,
        'monthly',
        0.8,
        [imageUrl]
      )
    })
  )

  // Combine all URLs in order: static pages, legal pages, categories, blog posts
  return [
    ...staticPages,
    ...legalPages,
    ...categoryUrls,
    ...blogUrls,
  ]
}
