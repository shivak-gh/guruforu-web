import { getAllCategories } from '../blog/lib/getBlogs'
import BlogCategories from './BlogCategories'

export default async function BlogCategoriesWrapper() {
  const categories = await getAllCategories()
  return await BlogCategories({ categories })
}
