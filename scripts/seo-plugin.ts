// Vite plugin that makes the single-page app readable for search engines and link previews.
//  - Fills the <!-- seo:start --> block in index.html with each URL's tags (dev server and build).
//  - After a build, writes dist/<path>/index.html for every known URL, so crawlers and
//    WhatsApp/Facebook/LinkedIn previews see the right title, description and image without JavaScript.
//  - Writes dist/sitemap.xml and dist/robots.txt.
// All data comes from src/seo/pages.ts.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { site } from '../src/seo/config'
import { headTags, renderHeadHtml } from '../src/seo/head'
import { allPages, productSeoForSlug, type PageSeo } from '../src/seo/pages'

const BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/

function seoFor(urlPath: string, pages: PageSeo[]): PageSeo {
  const clean = urlPath.split(/[?#]/)[0].replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1') || '/'
  const found = pages.find((p) => p.path === clean)
  if (found) return found
  if (clean.startsWith('/products/')) return productSeoForSlug(clean.slice('/products/'.length))
  return { path: clean, title: 'Page Not Found', description: site.description, noindex: true }
}

const fill = (html: string, seo: PageSeo) => {
  if (!BLOCK.test(html)) throw new Error('index.html is missing the <!-- seo:start --> … <!-- seo:end --> block')
  return html.replace(BLOCK, `<!-- seo:start -->\n    ${renderHeadHtml(headTags(seo))}\n    <!-- seo:end -->`)
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function sitemap(pages: PageSeo[]) {
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => {
      const parts = [`    <loc>${xmlEscape(site.url + (p.path === '/' ? '/' : p.path))}</loc>`]
      if (p.lastmod) parts.push(`    <lastmod>${p.lastmod}</lastmod>`)
      if (p.changefreq) parts.push(`    <changefreq>${p.changefreq}</changefreq>`)
      if (p.priority != null) parts.push(`    <priority>${p.priority.toFixed(1)}</priority>`)
      return `  <url>\n${parts.join('\n')}\n  </url>`
    })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`

export function seoPlugin(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'aygate-seo',
    configResolved(c) {
      config = c
    },
    // Dev: the requested URL's tags. Build: the home page's tags (other URLs are written below).
    transformIndexHtml(html, ctx) {
      return fill(html, seoFor(ctx.originalUrl ?? '/', allPages()))
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sitemap.xml') return res.setHeader('Content-Type', 'application/xml').end(sitemap(allPages()))
        if (req.url === '/robots.txt') return res.setHeader('Content-Type', 'text/plain').end(robots())
        next()
      })
    },
    async closeBundle() {
      if (config.command !== 'build') return
      const outDir = path.resolve(config.root, config.build.outDir)
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
      const pages = allPages()
      for (const page of pages) {
        if (page.path === '/') continue
        const dir = path.join(outDir, page.path)
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'index.html'), fill(template, page))
      }
      await writeFile(path.join(outDir, 'sitemap.xml'), sitemap(pages))
      await writeFile(path.join(outDir, 'robots.txt'), robots())
      config.logger.info(`SEO: pre-filled ${pages.length} pages, ${pages.filter((p) => !p.noindex).length} in sitemap.xml`)
    },
  }
}
