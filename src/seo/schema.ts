// Structured data (JSON-LD) that helps Google show rich results: company details,
// breadcrumbs, product prices and article dates. https://schema.org
import type { ShopProduct } from '../data/shop'
import type { BlogPost } from '../data/blog'
import { absoluteUrl, site } from './config'

export type JsonLd = Record<string, unknown>

const orgId = `${site.url}/#organization`

export const organizationSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': orgId,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: absoluteUrl(site.logo),
  description: site.description,
  email: site.email,
  telephone: site.phone,
  address: { '@type': 'PostalAddress', ...site.address },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: site.email, telephone: site.phone, availableLanguage: ['English'] }],
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
})

export const websiteSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: site.language,
  publisher: { '@id': orgId },
})

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
})

export const productSchema = (p: ShopProduct, path: string, image: string): JsonLd => {
  const prices = p.variants.map((v) => v.price)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${absoluteUrl(path)}#product`,
    name: p.name,
    description: `${p.description} ${p.summary}`,
    image: [absoluteUrl(image)],
    sku: p.slug,
    category: p.category,
    brand: { '@type': 'Brand', name: site.name },
    countryOfOrigin: { '@type': 'Country', name: 'Sri Lanka' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'LKR',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: p.variants.length,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(path),
      seller: { '@id': orgId },
    },
  }
}

export const productListSchema = (items: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: absoluteUrl(item.path) })),
})

export const articleSchema = (post: BlogPost, path: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${absoluteUrl(path)}#article`,
  headline: post.title,
  description: post.seoDescription ?? post.excerpt,
  image: [absoluteUrl(post.coverImage)],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt ?? post.publishedAt,
  author: { '@type': post.author === site.name ? 'Organization' : 'Person', name: post.author },
  publisher: { '@id': orgId },
  mainEntityOfPage: absoluteUrl(path),
  keywords: post.tags.join(', '),
  inLanguage: site.language,
})

export const webPageSchema = (type: 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'WebPage', name: string, path: string, description: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': type,
  name,
  url: absoluteUrl(path),
  description,
  isPartOf: { '@id': `${site.url}/#website` },
  about: { '@id': orgId },
})
