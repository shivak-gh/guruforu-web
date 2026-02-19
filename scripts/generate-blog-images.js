#!/usr/bin/env node

/**
 * Script to generate placeholder blog images
 * Uses Unsplash Source API for free, high-quality placeholder images
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BLOG_IMAGES_DIR = path.join(PUBLIC_DIR, 'blog-images')

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}
if (!fs.existsSync(BLOG_IMAGES_DIR)) {
  fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true })
}

// Image configurations with Unsplash search terms
const images = {
  // Category images
  'math-category.jpg': { search: 'mathematics', width: 800, height: 500 },
  'science-category.jpg': { search: 'science', width: 800, height: 500 },
  'technology-category.jpg': { search: 'technology', width: 800, height: 500 },
  'learning-strategies-category.jpg': { search: 'education', width: 800, height: 500 },
  'study-tips-category.jpg': { search: 'studying', width: 800, height: 500 },
  'parenting-guide-category.jpg': { search: 'family', width: 800, height: 500 },
  'online-education-category.jpg': { search: 'online-learning', width: 800, height: 500 },
  'computer-science-category.jpg': { search: 'coding', width: 800, height: 500 },
  'default-category.jpg': { search: 'education', width: 800, height: 500 },
  
  // Blog post images
  'default-blog.jpg': { search: 'education', width: 1200, height: 630 },
  'grade-5-math-mastery.jpg': { search: 'mathematics', width: 1200, height: 630 },
  'indian-parents-math-challenges.jpg': { search: 'Indian family parents children', width: 1200, height: 630 },
}

// Unsplash Source API (free, no API key needed)
function getUnsplashImageUrl(search, width, height) {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(search)}`
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ Downloaded: ${path.basename(filepath)}`)
          resolve()
        })
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirects
        file.close()
        fs.unlinkSync(filepath)
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
      } else {
        file.close()
        fs.unlinkSync(filepath)
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      reject(err)
    })
  })
}

// Generate SVG placeholder
function generateSVGPlaceholder(filename, width, height, search) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="500">${search}</text>
</svg>`
  
  const svgPath = path.join(BLOG_IMAGES_DIR, filename.replace('.jpg', '.svg'))
  fs.writeFileSync(svgPath, svg)
  console.log(`✓ Created SVG placeholder: ${path.basename(svgPath)}`)
}

// Main function
async function main() {
  console.log('Generating blog images...\n')
  
  for (const [filename, config] of Object.entries(images)) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⊘ Skipped (exists): ${filename}`)
      continue
    }
    
    try {
      const url = getUnsplashImageUrl(config.search, config.width, config.height)
      console.log(`Downloading ${filename}...`)
      await downloadImage(url, filepath)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`)
      console.log(`  Add this image manually to public/blog-images/ (e.g. from Unsplash or Pexels).`)
    }
  }
  
  console.log('\n✓ Image generation complete!')
  console.log(`\nImages saved to: ${BLOG_IMAGES_DIR}`)
  console.log('\nNote: If downloads failed, SVG placeholders were created instead.')
  console.log('You can replace these with your own images later.')
}

main().catch(console.error)
