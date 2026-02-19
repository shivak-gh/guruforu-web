#!/usr/bin/env node

/**
 * Creates SVG placeholder images for blog categories and posts
 * These are used as fallbacks until real images are added
 */

const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BLOG_IMAGES_DIR = path.join(PUBLIC_DIR, 'blog-images')

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}
if (!fs.existsSync(BLOG_IMAGES_DIR)) {
  fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true })
}

// Image configurations
const images = {
  // Category images (800x500)
  'math-category.jpg': { width: 800, height: 500, text: 'Math', icon: '📐' },
  'science-category.jpg': { width: 800, height: 500, text: 'Science', icon: '🔬' },
  'technology-category.jpg': { width: 800, height: 500, text: 'Technology', icon: '💻' },
  'learning-strategies-category.jpg': { width: 800, height: 500, text: 'Learning', icon: '📚' },
  'study-tips-category.jpg': { width: 800, height: 500, text: 'Study Tips', icon: '✏️' },
  'parenting-guide-category.jpg': { width: 800, height: 500, text: 'Parenting', icon: '👨‍👩‍👧‍👦' },
  'online-education-category.jpg': { width: 800, height: 500, text: 'Online Education', icon: '💡' },
  'computer-science-category.jpg': { width: 800, height: 500, text: 'Computer Science', icon: '💻' },
  'default-category.jpg': { width: 800, height: 500, text: 'Education', icon: '📖' },
  
  // Blog post images (1200x630 for featured images)
  'default-blog.jpg': { width: 1200, height: 630, text: 'GuruForU Blog', icon: '📝' },
  'grade-5-math-mastery.jpg': { width: 1200, height: 630, text: 'Grade 5 Math', icon: '🔢' },

  // Per-blog article placeholders: style similar to category images, text close to article description
  'grade-5-math-mastery-guide.svg': { width: 1200, height: 630, text: 'Essential Grade 5 math: fractions, decimals & geometry', icon: '🔢' },
  'will-ai-replace-teachers.svg': { width: 1200, height: 630, text: 'Why human teachers remain essential in the age of AI', icon: '🤖' },
  'class-10-maths-board-exam-guide-india.svg': { width: 1200, height: 630, text: 'CBSE, ICSE & state boards: syllabus & exam preparation', icon: '📐' },
  'us-parents-math-science-challenges.svg': { width: 1200, height: 630, text: 'Common Core, NGSS & supporting your child in the US', icon: '👨‍👩‍👧‍👦' },
  'nri-parents-bridging-indian-western-curriculum.svg': { width: 1200, height: 630, text: 'Bridging Indian foundations with Common Core & GCSE', icon: '🌍' },
  'indian-origin-parents-abroad-math-science.svg': { width: 1200, height: 630, text: 'Math & science support for Indian families abroad', icon: '📚' },
  'indian-parents-math-challenges.svg': { width: 1200, height: 630, text: 'JEE, boards & coaching: navigating math in India', icon: '💪' },
  'teaching-computer-science-nodejs-aws-labs.svg': { width: 1200, height: 630, text: 'Node.js & AWS hands-on labs for CS education', icon: '💻' },
  'child-focus-scientific-learning.svg': { width: 1200, height: 630, text: 'Focus strategies & evidence-based learning for kids', icon: '🧠' },
  'parents-guide-online-education.svg': { width: 1200, height: 630, text: 'Choosing online tutoring & hybrid learning options', icon: '📱' },
  'study-tips-for-students.svg': { width: 1200, height: 630, text: 'Evidence-based study strategies that improve retention', icon: '✏️' },
  'science-curriculum-global-guide.svg': { width: 1200, height: 630, text: 'Science education Grades 1–10 across seven countries', icon: '🔬' },
  'math-curriculum-global-guide.svg': { width: 1200, height: 630, text: 'Math curriculum worldwide: US, UK, Canada & more', icon: '📐' },
  'building-math-confidence.svg': { width: 1200, height: 630, text: 'Overcoming math anxiety & building success in K–12', icon: '💪' },
  'ai-powered-learning-benefits.svg': { width: 1200, height: 630, text: 'How AI personalizes learning & tracks mastery', icon: '🤖' },
  'how-to-choose-online-tutor.svg': { width: 1200, height: 630, text: 'A parent’s guide to selecting the right online tutor', icon: '👩‍🏫' },
  'benefits-of-online-learning.svg': { width: 1200, height: 630, text: 'Flexibility, personalization & success for your child', icon: '💡' },
  'sql-basics-for-students-learn-with-guruforu.svg': { width: 1200, height: 630, text: 'Learn SQL step by step with expert online tutoring', icon: '🗄️' },
}

function createSVGPlaceholder(filename, width, height, text, icon) {
  const id = filename.replace(/[^a-z0-9]/gi, '')
  const minDim = Math.min(width, height)
  const iconSize = minDim * 0.08
  // Scale text size for long descriptions (article-style text); keep category style for short text
  const textLen = text.length
  const textSize = textLen > 35 ? minDim * 0.028 : textLen > 25 ? minDim * 0.032 : minDim * 0.04
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${id})"/>
  <text x="50%" y="38%" font-family="system-ui, -apple-system, sans-serif" font-size="${iconSize}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="600">${icon}</text>
  <text x="50%" y="58%" font-family="system-ui, -apple-system, sans-serif" font-size="${textSize}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="500">${escapeXml(text)}</text>
</svg>`
  return svg
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function createPNGFromSVG(svgContent, outputPath) {
  // For now, we'll create SVG files and convert them
  // Since we can't easily convert SVG to PNG in Node without additional dependencies,
  // we'll create both SVG and provide instructions
  const svgPath = outputPath.replace('.jpg', '.svg')
  fs.writeFileSync(svgPath, svgContent)
  
  // Create a simple HTML file that can be used to convert SVG to PNG manually
  // Or we can use the SVG directly in Next.js Image component
  console.log(`Created: ${path.basename(svgPath)}`)
}

function main() {
  console.log('Creating SVG placeholder images...\n')
  
  for (const [filename, config] of Object.entries(images)) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    const isSvg = filename.endsWith('.svg')
    const outPath = isSvg ? filepath : filepath.replace('.jpg', '.svg')

    // Do not create SVG files in blog-images (site uses JPG only)
    if (outPath.endsWith('.svg')) {
      console.log(`⊘ Skipped (no SVG): ${path.basename(outPath)}`)
      continue
    }

    // Skip if file already exists
    if (fs.existsSync(outPath)) {
      console.log(`⊘ Skipped (exists): ${path.basename(outPath)}`)
      continue
    }

    const svg = createSVGPlaceholder(filename, config.width, config.height, config.text, config.icon)
    fs.writeFileSync(outPath, svg)
    console.log(`✓ Created: ${path.basename(outPath)}`)
  }
  
  console.log('\n✓ SVG placeholders created!')
  console.log(`\nFiles saved to: ${BLOG_IMAGES_DIR}`)
  console.log('\nNote: These are SVG files. Update the image components to use .svg files,')
  console.log('or convert these to JPG/PNG using an online tool or ImageMagick.')
}

main()
