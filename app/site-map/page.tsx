import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogs, getAllCategories } from '../blog/lib/getBlogs'

export const metadata: Metadata = {
  title: 'Site Map | GuruForU',
  description: 'Browse all GuruForU pages, blog categories, and learning articles from one place.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.guruforu.com/site-map',
  },
}

export default async function SiteMapPage() {
  const [categories, blogs] = await Promise.all([getAllCategories(), getAllBlogs()])

  const staticPages = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/free-session', label: 'Free Session' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms and Conditions' },
    { href: '/shipping', label: 'Shipping Policy' },
    { href: '/cancellation-refunds', label: 'Cancellation and Refunds' },
  ]

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <h1>GuruForU Site Map</h1>
      <p>Use this page to find all major pages and blog resources.</p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Main Pages</h2>
        <ul>
          {staticPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Blog Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/blog/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>All Articles</h2>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.slug}>
              <Link href={`/blog/${blog.categorySlug}/${blog.slug}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
