# Blog System

This directory contains blog posts for the GuruForU website. Each blog post is stored as a JSON file for easy content management.

## Structure

Each blog post follows this structure:
```
app/blog/
  ├── [slug]/              # Dynamic route for all blog posts
  │   ├── page.tsx         # Dynamic blog detail page
  │   └── page.module.css  # Styling for blog posts
  ├── page.tsx             # Blog listing page
  ├── content/             # All blog content files
  │   ├── blog-slug-1.json
  │   ├── blog-slug-2.json
  │   └── ...
  ├── lib/
  │   └── getBlogs.ts      # Utility functions to read blogs
  └── blog-template.json   # Template for creating new blogs
```

## Creating a New Blog Post

### Step 1: Create the JSON File
Create a new JSON file in the `content/` directory with your blog slug as the filename (e.g., `app/blog/content/my-new-blog.json`)

### Step 2: Use the Template
Copy `blog-template.json` to `content/your-slug.json` and fill in your content. Make sure the `slug` field in the JSON matches the filename (without .json).

**That's it!** The dynamic route at `app/blog/[slug]/page.tsx` will automatically handle rendering your blog post. No need to create page.tsx or page.module.css files for individual blogs.

## JSON Structure

### Required Fields
- `title`: The main title of the blog post
- `slug`: URL-friendly identifier (must match the filename without .json extension)
- `meta.readTime`: Estimated reading time (e.g., "8 min read")
- `meta.publishedDate`: Publication date in YYYY-MM-DD format
- `lead`: Opening paragraph that introduces the topic
- `sections`: Array of content sections
- `cta`: Call-to-action section at the end

### Section Types

#### Basic Section
```json
{
  "title": "Section Title",
  "content": [
    "Paragraph 1",
    "Paragraph 2"
  ]
}
```

#### Section with Highlights
```json
{
  "title": "Section Title",
  "content": ["Introduction paragraph"],
  "highlights": [
    {
      "title": "Highlight Title",
      "text": "Highlight description"
    }
  ]
}
```

#### Section with Strategies
```json
{
  "title": "Section Title",
  "content": ["Introduction paragraph"],
  "strategies": [
    {
      "title": "Strategy Title",
      "text": "Strategy description"
    }
  ]
}
```

#### Section with List
```json
{
  "title": "Section Title",
  "content": ["Introduction paragraph"],
  "list": [
    {
      "item": "Bold Term: Description with bold term"
    },
    {
      "item": "Simple list item"
    }
  ]
}
```

### Available categories

Categories come from the `category` field in each JSON file. Common values:

- **Math** — mathematics topics
- **Biology** — Class 11/12 biology and NEET-focused topics
- **Physics** — Class 11 physics and mechanics topics
- **Chemistry** — Class 11 chemistry topics
- **Science** — general/biology/earth science (broader science content)
- **Computer Science**, **Technology**, **Study Tips**, **Learning Strategies**, **Online Education**, **Parenting Guide**

Category pages are auto-generated at `/blog/{category-slug}` (e.g. `/blog/physics`, `/blog/chemistry`).

## Tonality & Voice

GuruForU blogs speak to **parents and students (Class 9–12)**. The tone is empathetic, practical, and expert—like a tutor who understands why a topic is hard.

### Voice principles

- **Empathy first**: Acknowledge difficulty before teaching ("This feels overwhelming because…")
- **Direct and warm**: Use "you" and "your child." Avoid stiff textbook language.
- **Concrete over vague**: Name exact mistakes, formulas, and exam traps.
- **Engaging, not dry**: Include fun facts that connect topics to real life, history, or technology.
- **Helpful, not salesy**: GuruForU mentions should feel supportive, not pushy.

### Standard section flow (topic/educational posts)

1. **Lead** — Hook + why it's hard + what reader gets + GuruForU tease
2. **Why [Topic] Feels Hard** — Common struggles (`highlights`)
3. **Fun Facts** — 4 surprising real-world facts (`highlights`)
4. **Core concepts** — Deeper explanation with formulas where relevant
5. **How to Tackle [Topic]: A Student's Playbook** — 5–6 actionable steps (`list`)
6. **How GuruForU Teachers Tackle This Complex Topic** — 5–6 specific teaching strategies (`strategies`)
7. **CTA** — Topic-specific; link to `/free-session`
8. **FAQ** — 5 Q&As including one about how GuruForU helps

See `blog-template.json` for the full structure. Cursor rule: `.cursor/rules/blog-content-tonality.mdc`.

## Best Practices

1. **Slug Naming**: Use lowercase, hyphens for spaces (e.g., `child-focus-scientific-learning`)
2. **Read Time**: Estimate based on ~200 words per minute (10–12 min for deep topic posts)
3. **Content Structure**: Follow the standard section flow above for topic/educational posts
4. **SEO**: Include `keywords` array (5+ terms) and `image` path
5. **CTA**: Always include a call-to-action linking to `/free-session`

## Example: Creating "Benefits of Online Learning"

1. Create file: `app/blog/content/benefits-of-online-learning.json`
2. Copy template: `cp app/blog/blog-template.json app/blog/content/benefits-of-online-learning.json`
3. Edit the JSON file with your content (ensure `slug` field matches filename: `"slug": "benefits-of-online-learning"`)
4. Access at: `/blog/benefits-of-online-learning`

The dynamic route will automatically render your blog post with proper SEO metadata!

## Notes

- **All blogs use the dynamic route** - No need to create individual page.tsx files
- The dynamic page component automatically handles rendering all section types
- Lists with items containing ":" will automatically format the part before ":" as bold
- All styling is consistent across blog posts
- SEO metadata is automatically generated from your JSON content
- Blog posts are automatically included in the sitemap
- Static generation ensures fast page loads and better SEO
