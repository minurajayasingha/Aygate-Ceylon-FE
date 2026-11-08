// Screenshots each page and diffs it against the Figma frame.
// Usage: npm run dev, then npm run compare [-- home m_home ...]. Results land in .compare/.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'

const FILE = '84wz6AM3GS51HAJM0prY5W'
const TOKEN = readFileSync('.env.local', 'utf8').match(/FIGMA_TOKEN=(.+)/)[1].trim()
const OUT = '.compare'
mkdirSync(OUT, { recursive: true })

const SCREENS = {
  home: ['/', '173:7', 1440], products: ['/products', '153:5328', 1440], about: ['/about', '153:5643', 1440],
  quality: ['/quality', '153:5735', 1440], export: ['/export-services', '153:5853', 1440], contact: ['/contact', '153:5975', 1440],
  detail: ['/products/ceylon-cinnamon-quills', '308:18', 1440],
  m_home: ['/', '190:1190', 402], m_products: ['/products', '225:2082', 402], m_about: ['/about', '276:3298', 402],
  m_quality: ['/quality', '271:3021', 402], m_export: ['/export-services', '282:3703', 402], m_contact: ['/contact', '278:3498', 402],
  m_detail: ['/products/ceylon-cinnamon-quills', '308:218', 402],
}

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SCREENS)
const browser = await chromium.launch()

for (const key of wanted) {
  const [route, node, width] = SCREENS[key]
  const designPath = `${OUT}/${key}.figma.png`
  if (!existsSync(designPath)) {
    const { images } = await (await fetch(`https://api.figma.com/v1/images/${FILE}?ids=${node}&format=png&scale=1`, { headers: { 'X-Figma-Token': TOKEN } })).json()
    writeFileSync(designPath, Buffer.from(await (await fetch(images[node])).arrayBuffer()))
  }
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((img) => (img.loading = 'eager'))
    await document.fonts.ready
  })
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `${OUT}/${key}.site.png`, fullPage: true })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  await page.close()

  const design = PNG.sync.read(readFileSync(designPath))
  const siteMeta = await sharp(`${OUT}/${key}.site.png`).metadata()
  const h = Math.max(design.height, siteMeta.height)
  const canvas = async (file) => PNG.sync.read(await sharp(file).resize({ width, fit: 'fill', height: (await sharp(file).metadata()).height }).extend({ bottom: h - (await sharp(file).metadata()).height, background: '#ff00ff' }).png().toBuffer())
  const a = await canvas(designPath)
  const b = await canvas(`${OUT}/${key}.site.png`)
  const diff = new PNG({ width, height: h })
  const changed = pixelmatch(a.data, b.data, diff.data, width, h, { threshold: 0.2, includeAA: false })
  writeFileSync(`${OUT}/${key}.diff.png`, PNG.sync.write(diff))
  console.log(`${key.padEnd(11)} design ${design.height}px  site ${siteMeta.height}px  overflowX ${overflow}px  diff ${((changed / (width * h)) * 100).toFixed(1)}%`)
}
await browser.close()
