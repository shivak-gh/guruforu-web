#!/usr/bin/env node
/**
 * One-off: Download specific Pexels images by photo ID (no API key).
 * Indian/NRI family education context - direct CDN URLs.
 * Usage: node scripts/download-pexels-direct.js
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'blog-images')

const IMAGES = [
  { file: 'scratch-and-block-coding-for-beginners.jpg', id: 3231359 },
  { file: 'python-for-beginners-students.jpg', id: 3079978 },
  { file: 'screen-time-and-learning-balance.jpg', id: 8819066 },
  { file: 'physics-problem-solving-approach.jpg', id: 7104388 },
  { file: 'chemistry-equations-and-stoichiometry.jpg', id: 3768126 },
  { file: 'biology-study-tips.jpg', id: 3771074 },
  { file: 'algebra-1-getting-started.jpg', id: 1134168 },
  { file: 'active-recall-study-method.jpg', id: 7686327 },
  { file: 'reducing-homework-stress.jpg', id: 3769995 },
  { file: 'when-to-start-online-tutoring.jpg', id: 8819763 },
]

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        download(res.headers.location, filepath).then(resolve).catch(reject)
      } else {
        file.close()
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
  if (!fs.existsSync(BLOG_IMAGES_DIR)) fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true })
  const base = 'https://images.pexels.com/photos'
  for (const { file, id } of IMAGES) {
    const url = `${base}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop`
    const filepath = path.join(BLOG_IMAGES_DIR, file)
    try {
      process.stdout.write(`Downloading ${file}... `)
      await download(url, filepath)
      console.log('✓')
    } catch (e) {
      console.log('✗', e.message)
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  console.log('\nDone.')
}

main().catch(console.error)
