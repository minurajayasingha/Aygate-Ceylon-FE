// Re-exports images and icons from the Figma "Web" page.
// Usage: npm run figma:assets   (needs FIGMA_TOKEN in .env.local)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const FILE = '84wz6AM3GS51HAJM0prY5W'
const TOKEN = readFileSync('.env.local', 'utf8').match(/FIGMA_TOKEN=(.+)/)[1].trim()
const OUT = 'public/images'
const ICONS = 'src/assets/icons'

// Raw photos, used with object-fit: cover (imageRef prefix -> name)
const PHOTOS = {
  '050ce4': 'product-cinnamon', '06d590': 'product-pepper', d2458f: 'product-cardamom', '65f360': 'product-cloves',
  '837723': 'service-bulk', '671bb0': 'service-sourcing', b2801a: 'service-private-label', '255c8c': 'service-packing',
  '552416': 'landscape', a341cd: 'about-story', b4fc54: 'founder', dab56d: 'gallery-main',
  befa2d: 'gallery-1', '7cda19': 'gallery-2', c2c5f9: 'gallery-3', '2f9b5f': 'product-detail',
}

// Rendered nodes: crops, overlays and tints stay exactly as designed (node id -> name)
const RENDERS = {
  '173:21': 'hero-home', '153:5336': 'hero-products', '153:5650': 'hero-about', '153:5742': 'hero-quality',
  '153:5859': 'hero-export', '153:5983': 'hero-contact',
  '190:1194': 'hero-home-m', '225:2088': 'hero-products-m', '276:3303': 'hero-about-m', '271:3025': 'hero-quality-m',
  '282:3708': 'hero-export-m', '278:3502': 'hero-contact-m',
  '173:9': 'bg-join', '225:2039': 'bg-join-m', '173:15': 'bg-origin', '212:1955': 'bg-origin-m',
  '173:16': 'bg-footer', '225:2271': 'bg-footer-m',
  '173:13': 'bg-leaf-home', '153:5334': 'bg-leaf-filter', '153:5706': 'bg-leaf-594', '153:5800': 'bg-leaf-484',
  '153:6174': 'bg-leaf-660', '153:5982': 'bg-leaf-panel',
  '193:1781': 'bg-leaf-m-665', '225:2340': 'bg-leaf-m-filter', '276:3359': 'bg-leaf-m-894', '271:3245': 'bg-leaf-m-468',
  '282:3764': 'bg-leaf-m-839', '278:3555': 'bg-leaf-m-946', '256:2936': 'bg-leaf-m-621', '308:645': 'bg-leaf-m-872',
  '173:101': 'card-bg', '176:1048': 'card-bg-tall', '225:2366': 'card-bg-m',
  '173:95': 'logo-white', '173:272': 'logo-stacked', LOGO_GREEN: 'logo-green',
}

const ICON_NODES = {
  '318:4': 'search', '318:8': 'cart', '318:10': 'menu', '318:12': 'heart', '318:17': 'sri-lanka', '318:20': 'leaf',
  '318:22': 'box', '318:27': 'documents', '318:30': 'arrow-right', '318:35': 'info', '318:36': 'facebook',
  '318:38': 'linkedin', '318:40': 'tiktok', '318:42': 'instagram', '318:45': 'chevron-down', '318:48': 'phone',
  '318:50': 'email', '318:54': 'location', '173:281': 'doc-check', '173:283': 'beaker', '173:285': 'traceability',
  DOC_ACCEPT: 'doc-accept', CLOSE: 'close', LINKEDIN_V1: 'linkedin-v1',
}

const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { 'X-Figma-Token': TOKEN } })
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}
const fetchBuf = async (url) => Buffer.from(await (await fetch(url)).arrayBuffer())

const page = (await api(`files/${FILE}/nodes?ids=112:3134`)).nodes['112:3134'].document
const find = (node, test) => {
  if (test(node)) return node
  for (const c of node.children ?? []) { const hit = find(c, test); if (hit) return hit }
}
const frame = (id) => find(page, (n) => n.id === id)
RENDERS[find(frame('308:18'), (n) => n.name === 'Asset 2 1').id] = RENDERS.LOGO_GREEN; delete RENDERS.LOGO_GREEN
ICON_NODES[find(frame('153:5735'), (n) => n.name.startsWith('healthicons')).id] = ICON_NODES.DOC_ACCEPT; delete ICON_NODES.DOC_ACCEPT
ICON_NODES[find(frame('309:700'), (n) => n.type === 'FRAME' && n.absoluteBoundingBox.width < 23 && n.absoluteBoundingBox.x > frame('309:700').absoluteBoundingBox.x + 370).id] = ICON_NODES.CLOSE; delete ICON_NODES.CLOSE
ICON_NODES[find(frame('153:5643'), (n) => n.name.startsWith('akar-icons:linkedin-v1')).id] = ICON_NODES.LINKEDIN_V1; delete ICON_NODES.LINKEDIN_V1

mkdirSync(OUT, { recursive: true }); mkdirSync(ICONS, { recursive: true })

const fills = (await api(`files/${FILE}/images`)).meta.images
for (const [prefix, name] of Object.entries(PHOTOS)) {
  const ref = Object.keys(fills).find((k) => k.startsWith(prefix))
  await sharp(await fetchBuf(fills[ref])).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`${OUT}/${name}.webp`)
  console.log('photo', name)
}

const ids = Object.keys(RENDERS)
for (let i = 0; i < ids.length; i += 12) {
  const batch = ids.slice(i, i + 12)
  const { images } = await api(`images/${FILE}?ids=${batch.join(',')}&format=png&scale=2&use_absolute_bounds=true`)
  for (const id of batch) {
    await sharp(await fetchBuf(images[id])).webp({ quality: 84, alphaQuality: 100 }).toFile(`${OUT}/${RENDERS[id]}.webp`)
    console.log('render', RENDERS[id])
  }
}

const { images: svgs } = await api(`images/${FILE}?ids=${Object.keys(ICON_NODES).join(',')}&format=svg&use_absolute_bounds=true`)
for (const [id, name] of Object.entries(ICON_NODES)) {
  writeFileSync(`${ICONS}/${name}.svg`, (await fetchBuf(svgs[id])).toString().replace(/\s(width|height)="[\d.]+"(?=[^>]*viewBox)/g, ''))
  console.log('icon', name)
}
