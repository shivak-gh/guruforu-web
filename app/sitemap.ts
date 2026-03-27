import { getAllBlogs, getAllCategories, getBlogsByCategory } from './blog/lib/getBlogs'
import { defaultBlogImage } from './blog/lib/categoryImages'
import { MetadataRoute } from 'next'
import { stat } from 'fs/promises'
import { join } from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guruforu.com'

  const getLastModifiedFromAppFile = async (relativeFilePath: string): Promise<Date> => {
    try {
      const fullPath = join(process.cwd(), 'app', relativeFilePath)
      const stats = await stat(fullPath)
      return stats.mtime
    } catch {
      return new Date()
    }
  }
  
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
  
  // Get all blog posts and categories
  const blogs = await getAllBlogs()
  const categories = await getAllCategories()

  // Most recent blog date for /blog lastModified
  const latestBlogDate = blogs.length > 0
    ? new Date(blogs[0].meta.publishedDate)
    : new Date()

  // Static pages - Main pages with file-based lastModified values.
  const now = new Date()
  const [
    homeLastModified,
    blogLastModified,
    contactLastModified,
    freeSessionLastModified,
    aboutLastModified,
    howItWorksLastModified,
    termsLastModified,
    privacyLastModified,
    shippingLastModified,
    cancellationRefundsLastModified,
  ] = await Promise.all([
    getLastModifiedFromAppFile('page.tsx'),
    getLastModifiedFromAppFile('blog/page.tsx'),
    getLastModifiedFromAppFile('contact/page.tsx'),
    getLastModifiedFromAppFile('free-session/page.tsx'),
    getLastModifiedFromAppFile('about/page.tsx'),
    getLastModifiedFromAppFile('how-it-works/page.tsx'),
    getLastModifiedFromAppFile('terms/page.tsx'),
    getLastModifiedFromAppFile('privacy/page.tsx'),
    getLastModifiedFromAppFile('shipping/page.tsx'),
    getLastModifiedFromAppFile('cancellation-refunds/page.tsx'),
  ])

  const staticPages = [
    createSitemapEntry('/', homeLastModified, 'weekly', 1.0),
    createSitemapEntry('/blog', latestBlogDate > blogLastModified ? latestBlogDate : blogLastModified, 'daily', 0.9),
    createSitemapEntry('/contact', contactLastModified, 'monthly', 0.8),
    createSitemapEntry('/free-session', freeSessionLastModified, 'weekly', 0.9),
    createSitemapEntry('/about', aboutLastModified, 'monthly', 0.8),
    createSitemapEntry('/how-it-works', howItWorksLastModified, 'monthly', 0.8),
  ]

  // Static pages - Legal/Policy pages with file-based lastModified values.
  const legalPages = [
    createSitemapEntry('/terms', termsLastModified, 'yearly', 0.5),
    createSitemapEntry('/privacy', privacyLastModified, 'yearly', 0.5),
    createSitemapEntry('/shipping', shippingLastModified, 'yearly', 0.5),
    createSitemapEntry('/cancellation-refunds', cancellationRefundsLastModified, 'yearly', 0.5),
  ]

  // Create blog category URLs (lastModified = latest post in that category)
  const categoryUrls = await Promise.all(
    categories.map(async (category) => {
      const catBlogs = await getBlogsByCategory(category.slug)
      const latestInCategory = catBlogs.length > 0
        ? new Date(catBlogs[0].meta.publishedDate)
        : now
      return createSitemapEntry(`/blog/${category.slug}`, latestInCategory, 'daily', 0.8)
    })
  )

  // Create blog post URLs with featured image for image sitemap
  const blogUrls = blogs.map((blog) => {
    const imagePath = (blog as { image?: string }).image || defaultBlogImage
    const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`
    return createSitemapEntry(
      `/blog/${blog.categorySlug}/${blog.slug}`,
      new Date(blog.meta.publishedDate),
      'monthly',
      0.8,
      [imageUrl]
    )
  })

  // Combine all URLs in order: static pages, legal pages, categories, blog posts
  return [
    ...staticPages,
    ...legalPages,
    ...categoryUrls,
    ...blogUrls,
  ]
}

