// Makes the default 1200×630 link-preview image (public/og-image.jpg) from the home hero.
// Run again if the hero image changes: node scripts/og-image.mjs
import sharp from 'sharp'

await sharp('public/images/hero-home.webp')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg')
console.log('Wrote public/og-image.jpg')
