// Blog articles. Empty until content is written. Each article added here automatically gets
// its own title, description, canonical URL, social card, Article structured data and a sitemap entry.
// When articles move to the backend/CMS, keep this shape and load them into the same SEO helpers.

export type BlogPost = {
  /** URL part: /blog/<slug>. Lowercase words joined by hyphens. Never change it after publishing. */
  slug: string
  title: string
  /** One or two sentences, about 120–160 characters. Shown in Google results and link previews. */
  excerpt: string
  /** Image path in /public, ideally 1200×630, e.g. '/images/blog/cinnamon-grades.webp'. */
  coverImage: string
  coverAlt: string
  author: string
  /** ISO dates, e.g. '2026-12-01'. */
  publishedAt: string
  updatedAt?: string
  tags: string[]
  /** Optional overrides when the search title/description should differ from the on-page ones. */
  seoTitle?: string
  seoDescription?: string
  /** Set true to publish the page but keep it out of search results and the sitemap. */
  noindex?: boolean
  /** Article body. Format to be decided with the blog design (Markdown or rich text). */
  body: string
}

export const blogPosts: BlogPost[] = [
  // Example:
  // {
  //   slug: 'ceylon-cinnamon-grades-explained',
  //   title: 'Ceylon Cinnamon Grades Explained: Alba, C5, H1 and More',
  //   excerpt: 'How Sri Lankan cinnamon is graded, and which grade suits retail, food manufacturing or extraction.',
  //   coverImage: '/images/product-cinnamon.webp',
  //   coverAlt: 'Ceylon cinnamon quills of different grades',
  //   author: 'Aygate Ceylon',
  //   publishedAt: '2026-12-01',
  //   tags: ['Cinnamon', 'Buying guide'],
  //   body: '...',
  // },
]

export const findPost = (slug?: string) => blogPosts.find((p) => p.slug === slug)
