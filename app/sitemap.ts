import { getAllBlogs, getAllCategories } from './blog/lib/getBlogs'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guruforu.com'
  
  // Helper function to create sitemap entry
  const createSitemapEntry = (
    path: string,
    lastModified: Date,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: number
  ): MetadataRoute.Sitemap[0] => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  })
  
  // Get all blog posts and categories
  const blogs = await getAllBlogs()
  const categories = await getAllCategories()
  
  // Static pages - Main pages
  const staticPages = [
    createSitemapEntry('/', new Date(), 'monthly', 1.0),
    createSitemapEntry('/blog', new Date(), 'weekly', 0.9),
    createSitemapEntry('/contact', new Date(), 'monthly', 0.8),
    createSitemapEntry('/free-session', new Date(), 'weekly', 0.9),
    createSitemapEntry('/early-access', new Date(), 'monthly', 0.8),
  ]

  // Static pages - Legal/Policy pages
  const legalPages = [
    createSitemapEntry('/terms', new Date(), 'yearly', 0.5),
    createSitemapEntry('/privacy', new Date(), 'yearly', 0.5),
    createSitemapEntry('/shipping', new Date(), 'yearly', 0.5),
    createSitemapEntry('/cancellation-refunds', new Date(), 'yearly', 0.5),
  ]

  // Create blog category URLs
  const categoryUrls = categories.map((category) =>
    createSitemapEntry(`/blog/${category.slug}`, new Date(), 'weekly', 0.7)
  )

  // Create blog post URLs
  const blogUrls = blogs.map((blog) =>
    createSitemapEntry(
      `/blog/${blog.categorySlug}/${blog.slug}`,
      new Date(blog.meta.publishedDate),
      'monthly',
      0.8
    )
  )

  // Combine all URLs in order: static pages, legal pages, categories, blog posts
  return [
    ...staticPages,
    ...legalPages,
    ...categoryUrls,
    ...blogUrls,
  ]
}

