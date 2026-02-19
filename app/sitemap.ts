import { getAllBlogs, getAllCategories, getBlogsByCategory } from './blog/lib/getBlogs'
import { defaultBlogImage } from './blog/lib/categoryImages'
import { MetadataRoute } from 'next'

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
  
  // Get all blog posts and categories
  const blogs = await getAllBlogs()
  const categories = await getAllCategories()

  // Most recent blog date for /blog lastModified
  const latestBlogDate = blogs.length > 0
    ? new Date(blogs[0].meta.publishedDate)
    : new Date()

  // Static pages - Main pages (updated recently for better crawling)
  const now = new Date()
  const staticPages = [
    createSitemapEntry('/', now, 'weekly', 1.0), // Homepage updated more frequently
    createSitemapEntry('/blog', latestBlogDate, 'daily', 0.9), // Blog: lastModified = latest post
    createSitemapEntry('/contact', now, 'monthly', 0.8),
    createSitemapEntry('/free-session', now, 'weekly', 0.9),
    createSitemapEntry('/early-access', now, 'weekly', 0.8),
    createSitemapEntry('/about', now, 'monthly', 0.8),
  ]

  // Static pages - Legal/Policy pages
  const legalPages = [
    createSitemapEntry('/terms', new Date(), 'yearly', 0.5),
    createSitemapEntry('/privacy', new Date(), 'yearly', 0.5),
    createSitemapEntry('/shipping', new Date(), 'yearly', 0.5),
    createSitemapEntry('/cancellation-refunds', new Date(), 'yearly', 0.5),
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

