// Retail catalogue used by search, cart, saved products and checkout.
// Prices, shipping fees and VAT are PLACEHOLDERS (only "1500 LKR +Tax" comes from Figma); confirm them with Aygate before launch.

export type Variant = { code: string; price: number }
export type ShopProduct = {
  slug: string
  name: string
  /** Shorter name for cards, where the title sits on one line. */
  short: string
  category: 'Cinnamon' | 'Pepper' | 'Spices'
  image: string
  detailImage?: string
  description: string
  summary: string
  pack: string
  forms: string[]
  variants: Variant[]
  keywords: string
}

const cinnamonBlurb = 'True Ceylon cinnamon in selected grades and forms for food, beverage and ingredient applications.'
const cinnamonSummary = 'Premium Ceylon cinnamon sourced from Sri Lanka, available in different forms and grades to meet global market requirements.'

export const shopProducts: ShopProduct[] = [
  {
    slug: 'ceylon-cinnamon-quills', name: 'Ceylon Cinnamon Quills', short: 'Cinnamon Quills', category: 'Cinnamon',
    image: 'product-cinnamon', detailImage: 'product-detail', description: cinnamonBlurb, summary: cinnamonSummary,
    pack: '100g pack', forms: ['Quills'], variants: [{ code: 'H1', price: 1500 }, { code: 'H2', price: 1350 }, { code: 'C5', price: 1200 }, { code: 'M5', price: 1050 }],
    keywords: 'cinnamon quills sticks ceylon alba true',
  },
  {
    slug: 'ceylon-cinnamon-powder', name: 'Ceylon Cinnamon Powder', short: 'Cinnamon Powder', category: 'Cinnamon',
    image: 'product-detail', description: 'Finely ground true Ceylon cinnamon for baking, beverages and blends.', summary: cinnamonSummary,
    pack: '100g pack', forms: ['Powder'], variants: [{ code: 'Fine', price: 980 }, { code: 'Extra Fine', price: 1150 }],
    keywords: 'cinnamon powder ground ceylon baking',
  },
  {
    slug: 'ceylon-cinnamon-chips', name: 'Ceylon Cinnamon Chips', short: 'Cinnamon Chips', category: 'Cinnamon',
    image: 'product-cinnamon', detailImage: 'product-detail', description: 'Cinnamon chips and featherings for teas, infusions and extraction.', summary: cinnamonSummary,
    pack: '250g pack', forms: ['Chips'], variants: [{ code: 'Chips', price: 850 }, { code: 'Featherings', price: 720 }],
    keywords: 'cinnamon chips featherings tea infusion',
  },
  {
    slug: 'cinnamon-cut-sticks', name: 'Cinnamon Cut Sticks', short: 'Cut Sticks', category: 'Cinnamon',
    image: 'product-cinnamon', detailImage: 'product-detail', description: 'Quills cut to 8cm for retail jars, hampers and hospitality.', summary: cinnamonSummary,
    pack: '100g pack', forms: ['Quills'], variants: [{ code: '8cm', price: 1450 }, { code: '5cm', price: 1300 }],
    keywords: 'cinnamon cut sticks quills retail',
  },
  {
    slug: 'black-pepper', name: 'Ceylon Black Pepper', short: 'Black Pepper', category: 'Pepper',
    image: 'product-pepper', description: 'Bold, aromatic Sri Lankan black pepper with high piperine content.', summary: 'Sun-dried Sri Lankan black pepper, graded by bulk density for consistent heat and aroma.',
    pack: '250g pack', forms: ['Whole', 'Cracked', 'Powder'], variants: [{ code: '500 GL', price: 980 }, { code: '550 GL', price: 1100 }],
    keywords: 'black pepper peppercorn whole ground',
  },
  {
    slug: 'white-pepper', name: 'Ceylon White Pepper', short: 'White Pepper', category: 'Pepper',
    image: 'product-pepper', description: 'Clean, mellow white pepper for sauces, soups and light dishes.', summary: 'Decorticated Sri Lankan pepper with a smooth, earthy heat.',
    pack: '250g pack', forms: ['Whole', 'Powder'], variants: [{ code: 'Whole', price: 1450 }, { code: 'Powder', price: 1500 }],
    keywords: 'white pepper peppercorn',
  },
  {
    slug: 'green-cardamom', name: 'Green Cardamom', short: 'Cardamom', category: 'Spices',
    image: 'product-cardamom', description: 'Fragrant whole green cardamom pods from the central hills.', summary: 'Hand-sorted Sri Lankan cardamom, graded by pod size.',
    pack: '100g pack', forms: ['Whole'], variants: [{ code: '7mm', price: 2400 }, { code: '8mm', price: 2900 }],
    keywords: 'cardamom green pods elaichi',
  },
  {
    slug: 'ceylon-cloves', name: 'Ceylon Cloves', short: 'Cloves', category: 'Spices',
    image: 'product-cloves', description: 'Hand-picked whole cloves with high oil content and strong aroma.', summary: 'Sri Lankan cloves, hand-picked and sun-dried.',
    pack: '100g pack', forms: ['Whole'], variants: [{ code: 'Hand-picked', price: 1350 }, { code: 'Grade 1', price: 1150 }],
    keywords: 'cloves whole spice',
  },
]

export const findProduct = (slug?: string) => shopProducts.find((p) => p.slug === slug)
export const lowestPrice = (p: ShopProduct) => Math.min(...p.variants.map((v) => v.price))
export const variantPrice = (p: ShopProduct, code: string) => (p.variants.find((v) => v.code === code) ?? p.variants[0]).price

export const formatLKR = (n: number) => `LKR ${Math.round(n).toLocaleString('en-US')}`

export function searchProducts(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return shopProducts.filter((p) => {
    const text = `${p.name} ${p.category} ${p.forms.join(' ')} ${p.keywords}`.toLowerCase()
    return words.every((w) => text.includes(w))
  })
}

/** Checkout pricing. Placeholders until Aygate confirms rates. */
export const pricing = {
  vatRate: 0.18,
  freeShippingFrom: 15000,
  delivery: [
    { id: 'standard', label: 'Standard Delivery', note: '3–5 working days, island-wide', fee: 950 },
    { id: 'express', label: 'Express Delivery', note: '1–2 working days, Colombo & suburbs', fee: 1950 },
  ],
} as const

export type DeliveryId = (typeof pricing.delivery)[number]['id']

export function totals(subtotal: number, delivery: DeliveryId) {
  const option = pricing.delivery.find((d) => d.id === delivery)!
  const shipping = subtotal === 0 ? 0 : delivery === 'standard' && subtotal >= pricing.freeShippingFrom ? 0 : option.fee
  const tax = Math.round(subtotal * pricing.vatRate)
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

/** Shown after a bank-transfer order. Placeholder account details. */
export const bankDetails = [
  ['Account name', 'Aygate Ceylon (Pvt) Ltd'],
  ['Bank', 'To be confirmed'],
  ['Account no.', 'To be confirmed'],
  ['Branch', 'To be confirmed'],
]
