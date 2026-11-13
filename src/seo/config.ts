// Site-wide SEO settings. Change the domain here once the live URL is confirmed;
// canonical links, social cards, structured data and the sitemap all read from it.

export const site = {
  url: 'https://aygateceylon.com',
  name: 'Aygate Ceylon',
  legalName: 'Aygate Ceylon (Pvt) Ltd',
  /** Used when a page has no description of its own. Keep it under about 160 characters. */
  description: 'Aygate Ceylon sources and exports authentic Sri Lankan cinnamon, pepper, cardamom, cloves and tea for importers, distributors and private-label brands.',
  locale: 'en_US',
  language: 'en',
  /** 1200×630 image for link previews. Generated from the home hero (see scripts/og-image.mjs). */
  defaultImage: '/og-image.jpg',
  logo: '/icon-512.png',
  email: 'info@aygateceylon.com',
  phone: '+94740055791',
  address: {
    streetAddress: '101/2, Wanatha Road',
    addressLocality: 'Maharagama',
    addressCountry: 'LK',
  },
  /** Add social profile URLs (Facebook, Instagram, LinkedIn…) here; they go into the Organization data. */
  sameAs: [] as string[],
  /** Optional @handle for X/Twitter cards. */
  twitter: '',
} as const

/** Turns a site path or image path into a full URL. Leaves full URLs alone. */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${site.url}${path.startsWith('/') ? '' : '/'}${path}`)
