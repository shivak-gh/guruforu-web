import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'

export interface BlogMeta {
  title: string
  slug: string
  category: string
  categorySlug: string
  meta: {
    readTime: string
    publishedDate: string
  }
  lead: string
  image?: string
}

// Helper function to convert category name to slug
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getAllBlogs(): Promise<BlogMeta[]> {
  try {
    const contentDir = join(process.cwd(), 'app', 'blog', 'content')
    const entries = await readdir(contentDir, { withFileTypes: true })
    
    const jsonFiles = entries
      .filter(entry => 
        entry.isFile() && 
        entry.name.endsWith('.json')
      )
      .map(entry => entry.name)

    const blogs: BlogMeta[] = []

    for (const file of jsonFiles) {
      try {
        const contentPath = join(contentDir, file)
        const fileContent = await readFile(contentPath, 'utf-8')
        const content = JSON.parse(fileContent)
        
        const category = content.category || 'General'
        blogs.push({
          title: content.title,
          slug: content.slug || file.replace('.json', ''),
          category: category,
          categorySlug: categoryToSlug(category),
          meta: content.meta,
          lead: content.lead,
          image: content.image
        })
      } catch (error) {
        // Skip invalid JSON files
        console.warn(`Skipping ${file}: invalid JSON`)
      }
    }

    // Sort by published date (newest first)
    blogs.sort((a, b) => {
      const dateA = new Date(a.meta.publishedDate).getTime()
      const dateB = new Date(b.meta.publishedDate).getTime()
      return dateB - dateA
    })

    return blogs
  } catch (error) {
    console.error('Error reading blogs:', error)
    return []
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const contentPath = join(process.cwd(), 'app', 'blog', 'content', `${slug}.json`)
    const fileContent = await readFile(contentPath, 'utf-8')
    const content = JSON.parse(fileContent)
    
    // Add categorySlug to the blog object for consistency
    const category = content.category || 'General'
    return {
      ...content,
      categorySlug: categoryToSlug(category),
    }
  } catch (error) {
    console.error(`Error reading blog ${slug}:`, error)
    return null
  }
}

export interface CategoryInfo {
  name: string
  slug: string
  count: number
}

export async function getAllCategories(): Promise<CategoryInfo[]> {
  const blogs = await getAllBlogs()
  const categoryMap = new Map<string, number>()
  
  blogs.forEach(blog => {
    const category = blog.category || 'General'
    const count = categoryMap.get(category) || 0
    categoryMap.set(category, count + 1)
  })
  
  const categories: CategoryInfo[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: categoryToSlug(name),
    count
  }))
  
  // Sort by name
  categories.sort((a, b) => a.name.localeCompare(b.name))
  
  return categories
}

export async function getBlogsByCategory(categorySlug: string): Promise<BlogMeta[]> {
  const blogs = await getAllBlogs()
  return blogs.filter(blog => blog.categorySlug === categorySlug)
}

/** Get related blogs (same category, excluding current) for internal linking */
export async function getRelatedBlogs(
  currentSlug: string,
  categorySlug: string,
  limit: number = 4
): Promise<BlogMeta[]> {
  const blogs = await getBlogsByCategory(categorySlug)
  return blogs
    .filter(blog => blog.slug !== currentSlug)
    .slice(0, limit)
}

/** Get file modified date for BlogPosting dateModified (fallback: publishedDate) */
export async function getBlogModifiedDate(slug: string): Promise<string | null> {
  try {
    const contentPath = join(process.cwd(), 'app', 'blog', 'content', `${slug}.json`)
    const statResult = await stat(contentPath)
    return statResult.mtime.toISOString().split('T')[0]
  } catch {
    return null
  }
}
