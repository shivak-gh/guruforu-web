# Visibility & Search Console Improvements

This doc summarizes the main reasons guruforu.com may get low views despite being indexed, and what’s been implemented to improve visibility and CTR.

---

## 1. Keyword gap (low search intent)

**Issue:** Broad topics (e.g. “Benefits of Online Learning”) compete with high-authority sites. New domains often sit on page 10+.

**Fix (content strategy):**
- Prefer **long-tail keywords**: specific questions and niches, e.g. “Benefits of online learning for full-time working nurses” instead of “Benefits of online learning.”
- In blog content JSON you can add optional **`metaTitle`** and **`metaDescription`** for CTR-focused snippets (see §4).

**Implemented:** Blog metadata supports optional `metaTitle` and `metaDescription` per post. Content strategy (choosing long-tail topics) is editorial.

---

## 2. EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)

**Issue:** Google favors content that shows clear expertise and trust. Anonymous or generic “AI blog” content is downranked.

**Fix:**
- **Author box** on every blog post (role, name, short bio, link to About).
- **About Us** page (`/about`) describing team, expertise, and mission.
- **Structured data** and Open Graph use author name from `lib/authors.ts`.

**Implemented:**
- `lib/authors.ts`: default author “GuruForU Editorial Team” with role and bio. Optional `author` id per post in blog JSON.
- Blog post template: author box before FAQ; JSON-LD and Open Graph `authors` use that author.
- `/about` page: Who we are, expertise, editorial team, links to Contact and Free Session.
- Footer: “About Us” link added on homepage.

---

## 3. “Discovered – currently not indexed” (crawl priority)

**Issue:** Google finds URLs (e.g. via sitemap) but doesn’t index them if the site is treated as low priority or content seems thin/duplicate.

**Fix:**
- **Request indexing** in Search Console for the top 5–10 most important URLs.
- **Internal linking** so new posts are linked from high-value pages (e.g. homepage).

**Implemented:**
- **“Latest from the blog”** on the homepage: lists the 5 most recent posts with links to each. New content is linked from the homepage so Googlebot can discover it by crawling.
- Sitemap and “Explore by topic” (category links) already support discovery. See `INDEXING.md` for GSC steps (submit sitemap, request indexing).

---

## 4. Search snippets (low CTR)

**Issue:** Even when a page ranks, boring or generic titles/descriptions hurt clicks.

**Fix:**
- Use clear value and “power words” in titles and descriptions.
- Example: “7 Hidden Benefits of Online Learning (That Save You $1,000+ Yearly)” instead of “Benefits of Online Learning.”

**Implemented:**
- Blog posts support optional **`metaTitle`** and **`metaDescription`** in the content JSON. If present, they are used for `<title>`, meta description, Open Graph, and Twitter cards.
- If not set, the existing logic (title + lead truncation) is used.

**Example in `app/blog/content/your-post.json`:**
```json
{
  "title": "10 Key Benefits of Online Learning for Your Child",
  "metaTitle": "7 Hidden Benefits of Online Learning (That Save You $1,000+ Yearly)",
  "metaDescription": "Discover 7 evidence-based benefits of online learning that save time and money—backed by educators and real parent stories.",
  ...
}
```

---

## 5. Technical performance & mobile

**Issue:** Slow load or poor mobile usability can lower rankings, especially for education queries on mobile.

**Fix:**
- Monitor **Core Web Vitals** and **Mobile usability** in Search Console.
- Optimize images, reduce heavy scripts, and fix tap targets/layout on small screens.

**Implemented:** Previous work (mobile CSS, reduced animations, polyfill reduction, etc.) already targets performance. Keep an eye on GSC and fix any “Failing” or “Needs improvement” items.

---

## Summary of code/content changes

| Area        | Change |
|------------|--------|
| **EEAT**   | Author box on posts, `lib/authors.ts`, author in JSON-LD/OG. |
| **About**  | New `/about` page; “About Us” in homepage footer; sitemap includes `/about`. |
| **Linking**| Homepage “Latest from the blog” (5 recent posts). |
| **Snippets**| Optional `metaTitle` and `metaDescription` in blog JSON. |
| **Docs**   | `INDEXING.md` (sitemap, request indexing), `VISIBILITY.md` (this file). |

---

## Next steps (manual)

1. **Search Console:** Submit sitemap, request indexing for key URLs (see `INDEXING.md`).
2. **Content:** Add long-tail titles and optional `metaTitle`/`metaDescription` to important posts.
3. **Authors:** Add more named authors in `lib/authors.ts` and set `"author": "author-id"` in blog JSON where relevant.
4. **GSC:** Check Core Web Vitals and Mobile usability; fix any failing or “Needs improvement” reports.
