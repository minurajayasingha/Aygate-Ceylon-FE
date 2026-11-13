// SEO for every URL on the site, in one place. Pages read it at runtime (useSeo), and the build
// reads it to write sitemap.xml, robots.txt and a pre-filled HTML file per URL (vite.config.ts).
// To add a page: add an entry to staticPages, call useSeo(pageSeo('/your-path')) in the page.
import { shopProducts, findProduct, type ShopProduct } from '../data/shop'
import { blogPosts, type BlogPost } from '../data/blog'
import { site } from './config'
import {
  articleSchema, breadcrumbSchema, organizationSchema, productListSchema, productSchema, webPageSchema, websiteSchema, type JsonLd,
} from './schema'

export type PageSeo = {
  path: string
  /** Page title without the brand; the brand is added unless fullTitle is set. Aim for 60 characters or fewer in total. */
  title: string
  fullTitle?: boolean
  /** About 120–160 characters. */
  description: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'product'
  /** Keeps the page out of search results and the sitemap (account, checkout, etc.). */
  noindex?: boolean
  jsonLd?: JsonLd[]
  article?: { publishedAt: string; updatedAt?: string; author: string; tags: string[] }
  /** Sitemap hints. */
  priority?: number
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  lastmod?: string
}

/** Google shows about 160 characters; cut longer text at a word boundary. */
const clip = (text: string, max = 160) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`)

const crumbs =(...items: [string, string][]) => breadcrumbSchema([['Home', '/'], ...items].map(([name, path]) => ({ name, path })))

const productsDescription = 'Browse authentic Sri Lankan spices from Aygate Ceylon: Ceylon cinnamon quills, powder and chips, black and white pepper, green cardamom and cloves.'

const staticList: PageSeo[] = [
  {
    path: '/',
    title: 'Aygate Ceylon | Sri Lankan Cinnamon, Pepper & Spice Exporter',
    fullTitle: true,
    description: site.description,
    priority: 1,
    changefreq: 'weekly',
    jsonLd: [organizationSchema(), websiteSchema()],
  },
  {
    path: '/products',
    title: 'Ceylon Cinnamon, Pepper & Spices',
    description: productsDescription,
    image: '/images/hero-products.webp',
    priority: 0.9,
    changefreq: 'weekly',
    jsonLd: [
      webPageSchema('CollectionPage', 'Products', '/products', productsDescription),
      productListSchema(shopProducts.map((p) => ({ name: p.name, path: productPath(p) }))),
      crumbs(['Products', '/products']),
    ],
  },
  {
    path: '/quality',
    title: 'Quality, Documentation & Traceability',
    description: 'How Aygate Ceylon confirms specifications, arranges lab testing (CoA, microbiological, pesticide residue, heavy metals) and keeps every shipment traceable.',
    image: '/images/hero-quality.webp',
    priority: 0.7,
    changefreq: 'monthly',
    jsonLd: [crumbs(['Quality', '/quality'])],
  },
  {
    path: '/export-services',
    title: 'Export Services for Global Buyers',
    description: 'Sourcing, samples, packing, private label and export documentation for buyers of Sri Lankan spices. From requirement to shipment with Aygate Ceylon.',
    image: '/images/hero-export.webp',
    priority: 0.7,
    changefreq: 'monthly',
    jsonLd: [crumbs(['Export Services', '/export-services'])],
  },
  {
    path: '/about',
    title: 'About Us',
    description: 'Aygate Ceylon is a Sri Lankan business built around products we believe in, connecting local growers with international buyers.',
    image: '/images/hero-about.webp',
    priority: 0.6,
    changefreq: 'monthly',
    jsonLd: [webPageSchema('AboutPage', 'About Aygate Ceylon', '/about', 'The story and people behind Aygate Ceylon.'), crumbs(['About', '/about'])],
  },
  {
    path: '/contact',
    title: 'Request a Quote or Product Sample',
    description: 'Contact Aygate Ceylon for bulk quotes, product samples and private-label enquiries on Ceylon cinnamon, pepper and spices. Based in Maharagama, Sri Lanka.',
    image: '/images/hero-contact.webp',
    priority: 0.8,
    changefreq: 'yearly',
    jsonLd: [webPageSchema('ContactPage', 'Contact Aygate Ceylon', '/contact', 'Request a quote or product sample.'), organizationSchema(), crumbs(['Contact', '/contact'])],
  },
  // Private or utility pages: reachable, but kept out of search results.
  { path: '/login', title: 'Sign In', description: 'Sign in to your Aygate Ceylon buyer account.', noindex: true },
  { path: '/register', title: 'Create an Account', description: 'Register as an Aygate Ceylon buyer.', noindex: true },
  { path: '/account', title: 'My Account', description: 'Your Aygate Ceylon orders, quotes and saved products.', noindex: true },
  { path: '/checkout', title: 'Checkout', description: 'Complete your Aygate Ceylon order.', noindex: true },
  { path: '/design-system', title: 'Design System', description: 'Internal design reference.', noindex: true },
]

export const staticPages: Record<string, PageSeo> = Object.fromEntries(staticList.map((p) => [p.path, p]))

export function pageSeo(path: string): PageSeo {
  const seo = staticPages[path]
  if (!seo) throw new Error(`No SEO entry for "${path}". Add it to staticPages in src/seo/pages.ts.`)
  return seo
}

export function productPath(p: ShopProduct) {
  return `/products/${p.slug}`
}

export function productSeo(p: ShopProduct): PageSeo {
  const path = productPath(p)
  const image = `/images/${p.detailImage ?? p.image}.webp`
  return {
    path,
    title: `${p.name} from Sri Lanka`,
    description: clip(`${p.description} ${p.summary}`),
    image,
    imageAlt: p.name,
    type: 'product',
    priority: 0.8,
    changefreq: 'weekly',
    jsonLd: [productSchema(p, path, image), crumbs(['Products', '/products'], [p.name, path])],
  }
}

/** For /products/:slug. An unknown slug still shows a product, so it is kept out of search results. */
export function productSeoForSlug(slug?: string): PageSeo {
  const p = findProduct(slug)
  if (p) return productSeo(p)
  return { ...productSeo(shopProducts[0]), path: `/products/${slug ?? ''}`, title: 'Product Not Found', noindex: true, jsonLd: [] }
}

export const blogPath = (post: BlogPost) => `/blog/${post.slug}`

export const blogIndexSeo: PageSeo = {
  path: '/blog',
  title: 'Spice Guides & News',
  description: 'Guides on Ceylon cinnamon grades, Sri Lankan spices, quality testing and exporting, from the Aygate Ceylon team.',
  priority: 0.6,
  changefreq: 'weekly',
  jsonLd: [webPageSchema('CollectionPage', 'Blog', '/blog', 'Guides and news from Aygate Ceylon.'), crumbs(['Blog', '/blog'])],
}

export function articleSeo(post: BlogPost): PageSeo {
  const path = blogPath(post)
  return {
    path,
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    image: post.coverImage,
    imageAlt: post.coverAlt,
    type: 'article',
    noindex: post.noindex,
    article: { publishedAt: post.publishedAt, updatedAt: post.updatedAt, author: post.author, tags: post.tags },
    lastmod: post.updatedAt ?? post.publishedAt,
    priority: 0.6,
    changefreq: 'monthly',
    jsonLd: [articleSchema(post, path), crumbs(['Blog', '/blog'], [post.title, path])],
  }
}

/** Every known URL. The build pre-fills an HTML file for each and lists the indexable ones in sitemap.xml. */
export function allPages(): PageSeo[] {
  return [
    ...staticList,
    ...shopProducts.map(productSeo),
    // The blog pages are listed once there is at least one article (the /blog routes must exist by then).
    ...(blogPosts.length ? [blogIndexSeo, ...blogPosts.map(articleSeo)] : []),
  ]
}
