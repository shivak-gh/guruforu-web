#!/usr/bin/env node

/**
 * Download blog images from Pexels with Indian/westernized Indian family context
 * Requires: PEXELS_API_KEY in .env or environment
 * Get free key at: https://www.pexels.com/api/
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BLOG_IMAGES_DIR = path.join(PUBLIC_DIR, 'blog-images')

// Load .env.local and .env if present
try {
  const envLocal = path.join(process.cwd(), '.env.local')
  const env = path.join(process.cwd(), '.env')
  for (const p of [envLocal, env]) {
    if (fs.existsSync(p)) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((line) => {
        const m = line.match(/^PEXELS_API_KEY=(.+)$/)
        if (m) process.env.PEXELS_API_KEY = m[1].trim().replace(/^["']|["']$/g, '')
      })
    }
  }
} catch (_) {}

const API_KEY = process.env.PEXELS_API_KEY

// Search terms for Indian/westernized Indian family context (per BLOG_IMAGES_README)
const imageConfigs = {
  'benefits-online-tutoring-busy-families.jpg': 'Indian parents children family',
  'online-learning-independent-study-skills.jpg': 'Indian student studying laptop',
  'online-vs-offline-tutoring-school-students.jpg': 'South Asian family education',
  'when-to-start-online-tutoring.jpg': 'Indian American parents child laptop learning',
  'effective-note-taking-for-students.jpg': 'Indian student studying notes',
  'test-prep-strategies-that-work.jpg': 'Indian student exam preparation',
  'reducing-homework-stress.jpg': 'Indian parents children homework together',
  'creating-a-home-study-space.jpg': 'family home study desk',
  'pomodoro-technique-for-kids.jpg': 'child studying focus',
  'how-to-build-daily-study-habits.jpg': 'family study routine',
  'memory-techniques-for-school-subjects.jpg': 'Indian student flashcards',
  'active-recall-study-method.jpg': 'Indian student studying',
  'algebra-1-getting-started.jpg': 'Indian student math',
  'biology-study-tips.jpg': 'Indian student science',
  'chemistry-equations-and-stoichiometry.jpg': 'Indian student chemistry',
  'physics-problem-solving-approach.jpg': 'Indian student physics',
  'earth-science-and-environmental-topics.jpg': 'Indian student science',
  'science-fair-project-ideas.jpg': 'Indian child science project',
  'educational-apps-that-actually-help.jpg': 'Indian child tablet learning',
  'screen-time-and-learning-balance.jpg': 'Indian family laptop',
  'python-for-beginners-students.jpg': 'Indian student programming',
  'web-development-basics-for-students.jpg': 'Indian student coding',
  'algorithmic-thinking-for-kids.jpg': 'Indian family technology education',
  'scratch-and-block-coding-for-beginners.jpg': 'Indian child coding',
}

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on('error', reject)
  })
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject)
      } else {
        file.close()
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
        reject(new Error(`HTTP ${res.statusCode}`))
      }
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
      reject(err)
    })
  })
}

async function main() {
  if (!API_KEY) {
    console.log('PEXELS_API_KEY is required. Get a free key at https://www.pexels.com/api/')
    console.log('Add to .env.local: PEXELS_API_KEY=your_key')
    console.log('Then run: node scripts/download-pexels-images.js')
    process.exit(1)
  }

  if (!fs.existsSync(BLOG_IMAGES_DIR)) {
    fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true })
  }

  const force = process.env.FORCE === '1' || process.argv.includes('--force')
  const singleImage = process.env.SINGLE_IMAGE || process.argv.find(a => a.startsWith('--single='))?.slice(9)
  if (singleImage) console.log(`Single image mode: ${singleImage}\n`)
  console.log('Downloading blog images from Pexels (Indian/westernized Indian context)...\n')

  let success = 0, fail = 0
  const configs = singleImage
    ? Object.entries(imageConfigs).filter(([f]) => f === singleImage)
    : Object.entries(imageConfigs)
  if (singleImage && configs.length === 0) {
    console.error(`No config found for: ${singleImage}`)
    process.exit(1)
  }

  for (const [filename, query] of configs) {
    const filepath = path.join(BLOG_IMAGES_DIR, filename)
    if (fs.existsSync(filepath) && !force) {
      console.log(`⊘ Skipped (exists): ${filename}`)
      continue
    }

    try {
      const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
      const data = await fetchJson(searchUrl, { Authorization: API_KEY })

      if (!data.photos || data.photos.length === 0) {
        console.log(`✗ No results for "${query}": ${filename}`)
        fail++
        continue
      }

      const photo = data.photos[0]
      const imgUrl = photo.src?.landscape || photo.src?.large2x || photo.src?.original
      if (!imgUrl) {
        console.log(`✗ No image URL: ${filename}`)
        fail++
        continue
      }

      process.stdout.write(`Downloading ${filename}... `)
      await downloadImage(imgUrl, filepath)
      console.log('✓')
      success++

      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.log(`✗ (${err.message})`)
      fail++
    }
  }

  console.log(`\n✓ Done: ${success} success, ${fail} failed`)
  console.log(`Images: ${BLOG_IMAGES_DIR}`)
}

main().catch(console.error)
