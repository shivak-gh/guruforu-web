// Category image mapping for blog categories
export const categoryImages: Record<string, string> = {
  'math': '/blog-images/math-category.jpg',
  'science': '/blog-images/science-category.jpg',
  'technology': '/blog-images/technology-category.jpg',
  'learning-strategies': '/blog-images/learning-strategies-category.jpg',
  'study-tips': '/blog-images/study-tips-category.jpg',
  'parenting-guide': '/blog-images/parenting-guide-category.jpg',
  'online-education': '/blog-images/online-education-category.jpg',
  'computer-science': '/blog-images/computer-science-category.jpg',
}

// Default image if category doesn't have a specific image
export const defaultCategoryImage = '/blog-images/online-education-category.jpg'

// Default blog post image if not specified
export const defaultBlogImage = '/blog-images/online-education-category.jpg'

export function getCategoryImage(categorySlug: string): string {
  return categoryImages[categorySlug] || defaultCategoryImage
}
