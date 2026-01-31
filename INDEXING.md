# Google Indexing Guide

If only a few pages are indexed (e.g. homepage, one blog category, one post), use these steps to help Google discover and index the rest.

## What the site already does

- **Sitemap** at `https://www.guruforu.com/sitemap.xml` lists all pages (homepage, blog index, categories, every blog post, contact, legal pages).
- **robots.txt** allows crawling and points to the sitemap.
- **Internal links**: Homepage links to Blog, Contact, Free Session, and an "Explore" section with links to every blog category (Math, Online Education, etc.).

## Steps in Google Search Console

1. **Submit the sitemap**
   - In [Google Search Console](https://search.google.com/search-console), select the property for `www.guruforu.com`.
   - Go to **Sitemaps** (under "Indexing").
   - Add: `sitemap.xml` and submit.
   - Google will crawl it and use it to discover URLs.

2. **Request indexing for important URLs**
   - Use **URL Inspection** (search bar at the top).
   - Enter a URL (e.g. `https://www.guruforu.com/blog`, `https://www.guruforu.com/blog/math`, `https://www.guruforu.com/contact`).
   - Click **Request indexing** so Google prioritizes crawling that URL.

3. **Give it time**
   - New or low-traffic sites get limited crawl budget. Indexing can take days or weeks.
   - After submitting the sitemap and requesting key URLs, recheck **Pages** > **Indexed** and **Sitemaps** > "Discovered URLs" over the next 1–2 weeks.

## If pages still don’t get indexed

- Check **Coverage** or **Pages** for errors (e.g. "Crawled – currently not indexed").
- Ensure no `noindex` or blocking rules affect those URLs.
- Keep adding internal links to new posts (e.g. from the blog index and category pages); the sitemap and "Explore" section on the homepage already support discovery.
