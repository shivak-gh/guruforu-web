import { getAllBlogs, getAllCategories } from './blog/lib/getBlogs'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.guruforu.com'
  
  // Get all blog posts and categories
  const blogs = await getAllBlogs()
  const categories = await getAllCategories()
  
  // Static pages - Main pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/free-session`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/early-access`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Static pages - Legal/Policy pages
  const legalPages = [
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cancellation-refunds`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Create blog category URLs
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blog/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Create blog post URLs
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.categorySlug}/${blog.slug}`,
    lastModified: new Date(blog.meta.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Combine all URLs in order: static pages, legal pages, categories, blog posts
  return [
    ...staticPages,
    ...legalPages,
    ...categoryUrls,
    ...blogUrls,
  ]
}

