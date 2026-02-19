# Blog Images Guide

This directory contains images for blog categories and blog posts.

## Current Status

✅ **JPG images only**: All blog and category images use JPG. No SVG placeholders.

## Image Files

### Category Images (800x500)
Located in `/public/blog-images/`:
- `math-category.jpg` - Math category
- `science-category.jpg` - Science category
- `technology-category.jpg` - Technology category
- `learning-strategies-category.jpg` - Learning strategies
- `study-tips-category.jpg` - Study tips
- `parenting-guide-category.jpg` - Parenting guide
- `online-education-category.jpg` - Online education (also used as default fallback)
- `computer-science-category.jpg` - Computer science

### Defaults
- Category fallback and blog post fallback both use `online-education-category.jpg`.
- Blog posts use their category’s JPG (e.g. Math posts use `math-category.jpg`).

## Replacing Placeholders with Real Images

### Option 1: Use Free Stock Photos

**Recommended Sources:**
- **Unsplash** (https://unsplash.com) - Free, high-quality photos
  - Search terms: "education", "mathematics", "science", "technology", "studying"
- **Pexels** (https://pexels.com) - Free stock photos
- **Pixabay** (https://pixabay.com) - Free images and vectors

**Image Requirements:**
- Category images: 800x500px (16:10 aspect ratio); may include text/labels (exception)
- Blog post featured images: 1200x630px (1.91:1) or 16:9; **no embedded text, titles, or overlays**
- **Indian context**: All article-specific images should feature Indian parents, students, or teachers
- Format: JPG or PNG
- File size: Keep under 500KB for optimal performance

### Option 2: Generate Images Using Script

Run the image generation script (requires internet connection):

```bash
npm run generate:blog-images
```

This script downloads placeholder images from Unsplash Source API.

### Option 3: Create Custom Images

1. Design images in your preferred tool (Figma, Canva, Photoshop, etc.)
2. Export as JPG or PNG
3. Save to `/public/blog-images/` with the same filenames (e.g. `math-category.jpg`).
4. Update the image paths in `app/blog/lib/categoryImages.ts` and blog JSON files if you add new categories or posts.

## Updating Image Paths

After adding real images, update the file extensions:

1. **Category Images** (`app/blog/lib/categoryImages.ts`): All entries use `.jpg`.
2. **Blog Post Images** (in JSON files): Each post’s `image` points to a category JPG or a custom path.
3. **Default fallback**: `defaultCategoryImage` and `defaultBlogImage` in `categoryImages.ts` use `online-education-category.jpg`. Components use these constants.

## Image Optimization Tips

1. **Compress images** before uploading (use tools like TinyPNG or ImageOptim)
2. **Use WebP format** for better compression (Next.js will automatically serve WebP when supported)
3. **Keep file sizes small** - aim for under 200KB per image
4. **Use descriptive filenames** - helps with SEO and organization

## Current SVG Placeholders

The SVG placeholders use your brand colors:
- Primary: `#667eea` (purple-blue)
- Secondary: `#764ba2` (purple)
- Accent: `#f093fb` (pink)

They display a gradient background with an icon and text label, making them visually appealing until real images are added.

### Article-specific images (all posts)

Each blog post has a dedicated image. Guidelines: **No embedded text** (pure photographic). **Indian context** (parents, students, teachers). Exception: category images may include text.

The post **Indian Parents and Math Challenges** uses:

- **Path:** `public/blog-images/indian-parents-math-challenges.jpg`
- **Suggested theme:** Parents and children studying together (real-world, family/homework).
- **Size:** 1200×630 px (featured image).

If the file is missing, the app shows the default fallback. To add it:

1. Use a stock photo (e.g. Unsplash search: “parents and children studying together”, or Pexels “family homework”).
2. Save as `indian-parents-math-challenges.jpg` in `public/blog-images/`.

## Notes

- The app uses JPG only; no SVG placeholders in blog-images.
- Missing images fall back to `online-education-category.jpg`.
- All images are served from `/public/blog-images/` and optimized by Next.js Image.
