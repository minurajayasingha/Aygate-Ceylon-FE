// Turns a PageSeo into <head> tags. Shared by the browser (useSeo) and the build (vite.config.ts),
// so a page's tags are identical whether a crawler runs JavaScript or not.
import { absoluteUrl, site } from './config'
import type { PageSeo } from './pages'

export type HeadTag =
  | { tag: 'title'; text: string }
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'script'; attrs: Record<string, string>; text: string }

export const fullTitle = (seo: PageSeo) => (seo.fullTitle ? seo.title : `${seo.title} | ${site.name}`)

export function headTags(seo: PageSeo): HeadTag[] {
  const title = fullTitle(seo)
  const url = absoluteUrl(seo.path)
  const image = absoluteUrl(seo.image ?? site.defaultImage)
  const imageAlt = seo.imageAlt ?? site.name
  const meta = (key: 'name' | 'property', id: string, content: string): HeadTag => ({ tag: 'meta', attrs: { [key]: id, content } })

  const tags: HeadTag[] = [
    { tag: 'title', text: title },
    meta('name', 'description', seo.description),
    meta('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    meta('property', 'og:site_name', site.name),
    meta('property', 'og:locale', site.locale),
    meta('property', 'og:type', seo.type === 'article' ? 'article' : seo.type === 'product' ? 'product' : 'website'),
    meta('property', 'og:title', title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:image:alt', imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', seo.description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', imageAlt),
  ]
  if (site.twitter) tags.push(meta('name', 'twitter:site', site.twitter))
  if (seo.article) {
    tags.push(meta('property', 'article:published_time', seo.article.publishedAt))
    if (seo.article.updatedAt) tags.push(meta('property', 'article:modified_time', seo.article.updatedAt))
    tags.push(meta('property', 'article:author', seo.article.author))
    for (const t of seo.article.tags) tags.push(meta('property', 'article:tag', t))
  }
  for (const data of seo.jsonLd ?? []) {
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(data) })
  }
  return tags
}

/** Marks tags this module owns, so they can be swapped on each page change without touching others. */
export const SEO_ATTR = 'data-seo'

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// JSON inside <script> only needs "</" broken up so it cannot close the tag early.
const escapeJson = (s: string) => s.replace(/</g, '\\u003c')

/** HTML string for the build step. */
export function renderHeadHtml(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      if (t.tag === 'title') return `<title>${escapeText(t.text)}</title>`
      const attrs = Object.entries({ ...t.attrs, [SEO_ATTR]: '' })
        .map(([k, v]) => (v === '' ? k : `${k}="${escapeAttr(v)}"`))
        .join(' ')
      return t.tag === 'script' ? `<script ${attrs}>${escapeJson(t.text)}</script>` : `<${t.tag} ${attrs} />`
    })
    .join('\n    ')
}
