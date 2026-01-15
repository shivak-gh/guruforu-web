import { getAllBlogs } from '../blog/lib/getBlogs'

// Disable caching during development/stabilization - set DISABLE_CACHE=false to enable
const DISABLE_CACHE = process.env.DISABLE_CACHE !== 'false' // Default to true (disabled) unless explicitly set to false

export async function GET() {
  const blogs = await getAllBlogs()
  const baseUrl = 'https://www.guruforu.com'
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>GuruForU Blog</title>
    <description>Expert insights on child education, learning strategies, and AI-powered personalized learning</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/guruforu-ai-education-logo-dark.png</url>
      <title>GuruForU Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${blogs
      .slice(0, 20)
      .map(
        (blog) => `    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${blog.lead}]]></description>
      <link>${baseUrl}/blog/${blog.categorySlug}/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.categorySlug}/${blog.slug}</guid>
      <pubDate>${new Date(blog.meta.publishedDate).toUTCString()}</pubDate>
      <category>${blog.category}</category>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': DISABLE_CACHE 
        ? 'no-cache, no-store, must-revalidate, max-age=0'
        : 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...(DISABLE_CACHE && {
        'Pragma': 'no-cache',
        'Expires': '0',
      }),
    },
  })
}
