#!/usr/bin/env node

/**
 * Script to download placeholder blog images
 * Uses Picsum Photos (Lorem Picsum) - a reliable free image service
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BLOG_IMAGES_DIR = path.join(PUBLIC_DIR, 'blog-images')

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}
if (!fs.existsSync(BLOG_IMAGES_DIR)) {
  fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true })
}

// Image configurations with Picsum image IDs (random but consistent)
// Using different IDs for variety
const images = {
  // Category images (800x500)
  'math-category.jpg': { width: 800, height: 500, id: 1018 }, // Math/numbers theme
  'science-category.jpg': { width: 800, height: 500, id: 1015 }, // Science theme
  'technology-category.jpg': { width: 800, height: 500, id: 1005 }, // Tech theme
  'learning-strategies-category.jpg': { width: 800, height: 500, id: 1011 }, // Education theme
  'study-tips-category.jpg': { width: 800, height: 500, id: 1009 }, // Study theme
  'parenting-guide-category.jpg': { width: 800, height: 500, id: 1012 }, // Family theme
  'online-education-category.jpg': { width: 800, height: 500, id: 1008 }, // Learning theme
  'computer-science-category.jpg': { width: 800, height: 500, id: 1006 }, // Coding theme
  'default-category.jpg': { width: 800, height: 500, id: 1010 }, // General education
  
  // Blog post images (1200x630)
  'default-blog.jpg': { width: 1200, height: 630, id: 1013 },
  'grade-5-math-mastery.jpg': { width: 1200, height: 630, id: 1018 },
}

// Picsum Photos API
function getPicsumImageUrl(id, width, height) {
  return `https://picsum.photos/id/${id}/${width}/${height}`
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    const protocol = url.startsWith('https') ? https : http
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ Downloaded: ${path.basename(filepath)}`)
          resolve()
        })
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        // Follow redirects
        file.close()
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
      } else {
        file.close()
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
      }
    })
    
    request.on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      reject(err)
    })
    
    request.setTimeout(10000, () => {
      request.destroy()
      file.close()
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      reject(new Error(`Timeout downloading ${url}`))
    })
  })
}

// Main function
async function main() {
  console.log('Downloading blog images from Picsum Photos...\n')
  
  let successCount = 0
  let failCount = 0
  
  for (const [filename, config] of Object.entries(images)) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⊘ Skipped (exists): ${filename}`)
      continue
    }
    
    try {
      const url = getPicsumImageUrl(config.id, config.width, config.height)
      console.log(`Downloading ${filename}...`)
      await downloadImage(url, filepath)
      successCount++
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`)
      failCount++
    }
  }
  
  console.log(`\n✓ Download complete!`)
  console.log(`  Success: ${successCount}`)
  console.log(`  Failed: ${failCount}`)
  console.log(`\nImages saved to: ${BLOG_IMAGES_DIR}`)
  
  if (failCount > 0) {
    console.log('\nNote: Some downloads failed. You can:')
    console.log('1. Run the script again (it will skip existing files)')
    console.log('2. Manually download images from https://picsum.photos/')
    console.log('3. Use the SVG placeholders that were created')
  }
}

main().catch(console.error)
