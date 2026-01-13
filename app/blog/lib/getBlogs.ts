import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export interface BlogMeta {
  title: string
  slug: string
  meta: {
    readTime: string
    publishedDate: string
  }
  lead: string
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
        
        blogs.push({
          title: content.title,
          slug: content.slug || file.replace('.json', ''),
          meta: content.meta,
          lead: content.lead
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
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error reading blog ${slug}:`, error)
    return null
  }
}
