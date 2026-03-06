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
  
  // Blog post images - Indian/westernized Indian family context per BLOG_IMAGES_README
  'default-blog.jpg': { search: 'Indian family education', width: 1200, height: 630 },
  'grade-5-math-mastery-guide.jpg': { search: 'Indian child mathematics', width: 1200, height: 630 },
  'benefits-of-online-learning.jpg': { search: 'Indian family online learning laptop', width: 1200, height: 630 },
  'benefits-online-tutoring-busy-families.jpg': { search: 'Indian parents children busy family', width: 1200, height: 630 },
  'online-learning-independent-study-skills.jpg': { search: 'Indian student studying independently', width: 1200, height: 630 },
  'online-vs-offline-tutoring-school-students.jpg': { search: 'Indian family parents children study', width: 1200, height: 630 },
  'when-to-start-online-tutoring.jpg': { search: 'Indian parents child laptop learning', width: 1200, height: 630 },
  'study-tips-for-students.jpg': { search: 'Indian student studying homework', width: 1200, height: 630 },
  'effective-note-taking-for-students.jpg': { search: 'Indian student notes studying', width: 1200, height: 630 },
  'test-prep-strategies-that-work.jpg': { search: 'Indian student exam preparation', width: 1200, height: 630 },
  'reducing-homework-stress.jpg': { search: 'Indian parents children homework support', width: 1200, height: 630 },
  'creating-a-home-study-space.jpg': { search: 'Indian family home study desk', width: 1200, height: 630 },
  'child-focus-scientific-learning.jpg': { search: 'Indian child focused learning', width: 1200, height: 630 },
  'pomodoro-technique-for-kids.jpg': { search: 'Indian child studying timer focus', width: 1200, height: 630 },
  'how-to-build-daily-study-habits.jpg': { search: 'Indian family study routine', width: 1200, height: 630 },
  'memory-techniques-for-school-subjects.jpg': { search: 'Indian student studying flashcards', width: 1200, height: 630 },
  'active-recall-study-method.jpg': { search: 'Indian student studying', width: 1200, height: 630 },
  'building-math-confidence.jpg': { search: 'Indian child math confidence', width: 1200, height: 630 },
  'math-curriculum-global-guide.jpg': { search: 'Indian student mathematics', width: 1200, height: 630 },
  'class-10-maths-board-exam-guide-india.jpg': { search: 'Indian parents children education', width: 1200, height: 630 },
  'algebra-1-getting-started.jpg': { search: 'Indian student algebra math', width: 1200, height: 630 },
  'science-curriculum-global-guide.jpg': { search: 'Indian student science', width: 1200, height: 630 },
  'biology-study-tips.jpg': { search: 'Indian student science biology', width: 1200, height: 630 },
  'chemistry-equations-and-stoichiometry.jpg': { search: 'Indian student chemistry science', width: 1200, height: 630 },
  'physics-problem-solving-approach.jpg': { search: 'Indian student physics', width: 1200, height: 630 },
  'earth-science-and-environmental-topics.jpg': { search: 'Indian student science learning', width: 1200, height: 630 },
  'science-fair-project-ideas.jpg': { search: 'Indian child science project', width: 1200, height: 630 },
  'parents-guide-online-education.jpg': { search: 'Indian family parents children education', width: 1200, height: 630 },
  'how-to-choose-online-tutor.jpg': { search: 'Indian parents child tutor', width: 1200, height: 630 },
  'indian-parents-math-challenges.jpg': { search: 'Indian family parents children studying', width: 1200, height: 630 },
  'indian-origin-parents-abroad-math-science.jpg': { search: 'Indian family abroad education', width: 1200, height: 630 },
  'nri-parents-bridging-indian-western-curriculum.jpg': { search: 'Indian family parents children western', width: 1200, height: 630 },
  'us-parents-math-science-challenges.jpg': { search: 'Indian American family education', width: 1200, height: 630 },
  'ai-powered-learning-benefits.jpg': { search: 'Indian student laptop AI learning', width: 1200, height: 630 },
  'will-ai-replace-teachers.jpg': { search: 'Indian family technology education', width: 1200, height: 630 },
  'sql-basics-for-students-learn-with-guruforu.jpg': { search: 'Indian student coding computer', width: 1200, height: 630 },
  'educational-apps-that-actually-help.jpg': { search: 'Indian child tablet learning', width: 1200, height: 630 },
  'screen-time-and-learning-balance.jpg': { search: 'Indian family laptop learning', width: 1200, height: 630 },
  'teaching-computer-science-nodejs-aws-labs.jpg': { search: 'Indian student coding', width: 1200, height: 630 },
  'python-for-beginners-students.jpg': { search: 'Indian student programming laptop', width: 1200, height: 630 },
  'web-development-basics-for-students.jpg': { search: 'Indian student coding laptop', width: 1200, height: 630 },
  'algorithmic-thinking-for-kids.jpg': { search: 'Indian family technology education', width: 1200, height: 630 },
  'scratch-and-block-coding-for-beginners.jpg': { search: 'Indian child coding', width: 1200, height: 630 },
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
  const force = process.env.FORCE === '1' || process.argv.includes('--force')
  const singleImage = process.env.SINGLE_IMAGE || process.argv.find(a => a.startsWith('--single='))?.slice(9)
  if (force) {
    console.log('Force mode: will overwrite existing images\n')
  }
  if (singleImage) {
    console.log(`Single image mode: ${singleImage}\n`)
  }
  console.log('Generating blog images (Indian/westernized Indian family context)...\n')
  
  const entries = singleImage
    ? Object.entries(images).filter(([filename]) => filename === singleImage)
    : Object.entries(images)
  if (singleImage && entries.length === 0) {
    console.error(`No config found for: ${singleImage}`)
    process.exit(1)
  }

  for (const [filename, config] of entries) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    
    // Skip if file already exists (unless force)
    if (fs.existsSync(filepath) && !force) {
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
