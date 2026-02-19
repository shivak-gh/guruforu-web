#!/usr/bin/env node

/**
 * Script to download real images for blog categories and posts
 * Uses Picsum Photos API - provides real photos, not placeholders
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

// Image configurations - using Picsum Photos IDs for real photos
// Each ID corresponds to a different real photo
const images = {
  // Category images (800x500) - using varied photo IDs
  'math-category.jpg': { width: 800, height: 500, id: 1018 }, // Numbers/math related
  'science-category.jpg': { width: 800, height: 500, id: 1015 }, // Science related
  'technology-category.jpg': { width: 800, height: 500, id: 1005 }, // Tech related
  'learning-strategies-category.jpg': { width: 800, height: 500, id: 1011 }, // Education
  'study-tips-category.jpg': { width: 800, height: 500, id: 1009 }, // Study/books
  'parenting-guide-category.jpg': { width: 800, height: 500, id: 1012 }, // Family/people
  'online-education-category.jpg': { width: 800, height: 500, id: 1008 }, // Learning
  'computer-science-category.jpg': { width: 800, height: 500, id: 1006 }, // Tech/coding
  'default-category.jpg': { width: 800, height: 500, id: 1010 }, // General
  
  // Blog post images (1200x630 for featured images)
  'default-blog.jpg': { width: 1200, height: 630, id: 1013 },
  'grade-5-math-mastery.jpg': { width: 1200, height: 630, id: 1018 },
}

// Picsum Photos API - provides real photos
function getPicsumImageUrl(id, width, height) {
  return `https://picsum.photos/id/${id}/${width}/${height}`
}

// Download image with retry logic
function downloadImage(url, filepath, retries = 3) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    
    const attemptDownload = (attempt = 1) => {
      const request = https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve()
          })
          file.on('error', (err) => {
            file.close()
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
            reject(err)
          })
        } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Follow redirects
          file.close()
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
          downloadImage(response.headers.location, filepath, retries).then(resolve).catch(reject)
        } else if (attempt < retries) {
          // Retry on failure
          file.close()
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
          setTimeout(() => attemptDownload(attempt + 1), 1000 * attempt)
        } else {
          file.close()
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
          reject(new Error(`HTTP ${response.statusCode}`))
        }
      })
      
      request.on('error', (err) => {
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        if (attempt < retries) {
          setTimeout(() => attemptDownload(attempt + 1), 1000 * attempt)
        } else {
          reject(err)
        }
      })
      
      request.setTimeout(15000, () => {
        request.destroy()
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        if (attempt < retries) {
          setTimeout(() => attemptDownload(attempt + 1), 1000 * attempt)
        } else {
          reject(new Error('Timeout'))
        }
      })
    }
    
    attemptDownload()
  })
}

// Main function
async function main() {
  console.log('Downloading real images from Picsum Photos...\n')
  console.log('This may take a minute as we download actual photos...\n')
  
  let successCount = 0
  let failCount = 0
  const total = Object.keys(images).length
  
  for (const [filename, config] of Object.entries(images)) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    
    // Remove existing SVG if present
    const svgPath = filepath.replace('.jpg', '.svg')
    if (fs.existsSync(svgPath)) {
      fs.unlinkSync(svgPath)
      console.log(`Removed old SVG: ${path.basename(svgPath)}`)
    }
    
    // Skip if JPG already exists
    if (fs.existsSync(filepath)) {
      console.log(`⊘ Skipped (exists): ${filename}`)
      continue
    }
    
    try {
      const url = getPicsumImageUrl(config.id, config.width, config.height)
      process.stdout.write(`Downloading ${filename}... `)
      await downloadImage(url, filepath)
      console.log('✓')
      successCount++
      
      // Delay to avoid rate limiting
      if (successCount < total) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    } catch (error) {
      console.log(`✗ (${error.message})`)
      failCount++
    }
  }
  
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Download Summary:`)
  console.log(`  ✓ Success: ${successCount}`)
  console.log(`  ✗ Failed: ${failCount}`)
  console.log(`\nImages saved to: ${BLOG_IMAGES_DIR}`)
  
  if (successCount > 0) {
    console.log(`\n✓ Real images downloaded successfully!`)
    console.log(`  Update image paths from .svg to .jpg in:`)
    console.log(`  - app/blog/lib/categoryImages.ts`)
    console.log(`  - Blog JSON files`)
  }
  
  if (failCount > 0) {
    console.log(`\nNote: Some downloads failed. You can:`)
    console.log(`  1. Run this script again (it will retry failed downloads)`)
    console.log(`  2. Manually download from: https://picsum.photos/`)
  }
}

main().catch(console.error)
