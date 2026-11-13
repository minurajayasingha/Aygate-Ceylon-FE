import { findProduct, shopProducts } from './shop'

// All page copy and data lives here. Text is word for word from Figma, so replacing a placeholder only takes one edit.

// Set `hidden: true` to take a link out of the header and footer; remove it to bring the link back.
// Markets is hidden until that page is ready (requested 2026-11-13).
const HIDE_MARKETS = true

const allNavLinks = [
  { label: 'Home', to: '/', left: 0 },
  { label: 'Products', to: '/products', left: 88 },
  { label: 'Quality', to: '/quality', left: 199 },
  { label: 'Export Services', to: '/export-services', left: 295 },
  { label: 'About', to: '/about', left: 458 },
  { label: 'Markets', to: '#', left: 547, hidden: HIDE_MARKETS },
  { label: 'Contact Us', to: '/contact', left: 651 },
]

// Desktop links sit at fixed Figma positions, so links after a hidden one move left by its slot width.
export const navLinks = allNavLinks.flatMap((link, i) => {
  if (link.hidden) return []
  const shift = allNavLinks.slice(0, i).reduce((n, l, j) => (l.hidden ? n + allNavLinks[j + 1].left - l.left : n), 0)
  return [{ label: link.label, to: link.to, left: link.left - shift }]
})

export const footerColumns = {
  explore: [
    { label: 'Products', to: '/products' },
    { label: 'Quality', to: '/quality' },
    { label: 'Export Services', to: '/export-services' },
    { label: 'Markets', to: '#', hidden: HIDE_MARKETS },
  ].filter((l) => !l.hidden),
  products: [
    { label: 'Cinnamon', to: '/products' },
    { label: 'Pepper', to: '/products' },
    { label: 'Tea', to: '/products' },
  ],
  contact: [
    { label: 'Request a Quote', to: '/contact' },
    { label: 'My Account', to: '/account' },
    { label: 'My Cart', to: '#' },
  ],
}

export const footerBlurb = 'Aygate Ceylon connects selected Sri Lankan agricultural products with international buyers through sourcing, product coordination and export support.'

export const stats = [
  { icon: 'sri-lanka', iconSize: 42, label: 'Product Origin', value: 'Sri Lankan' },
  { icon: 'leaf', iconSize: 38, label: 'Core Products', value: 'Cinnamon · Pepper · Tea' },
  { icon: 'box', iconSize: 38, label: 'Supply Model', value: 'Bulk · Private Label · Retail' },
  { icon: 'documents', iconSize: 34, label: 'Documentation', value: 'Available on request' },
]

// Cards show products from the retail catalogue (src/data/shop.ts), so each card links, saves and searches as its own product.
export type Product = { slug: string; name: string; image: string; description: string; category: string }

const cardOf = (slug: string): Product => {
  const p = findProduct(slug)!
  return { slug: p.slug, name: p.short, image: p.image, description: p.description, category: p.category.toLowerCase() }
}

export const homeProducts: Product[] = ['ceylon-cinnamon-quills', 'black-pepper', 'green-cardamom', 'ceylon-cloves'].map(cardOf)

export const cinnamonProducts: Product[] = ['ceylon-cinnamon-quills', 'ceylon-cinnamon-powder', 'ceylon-cinnamon-chips', 'cinnamon-cut-sticks'].map(cardOf)

export const otherProducts = (slug: string) => shopProducts.filter((p) => p.slug !== slug).slice(0, 4).map((p) => cardOf(p.slug))

// Products page groups.
const pepperAndSpices = ['black-pepper', 'white-pepper', 'green-cardamom', 'ceylon-cloves'].map(cardOf)
export const catalogue = {
  cinnamon: { desktop: cinnamonProducts, mobile: cinnamonProducts },
  pepper: { desktop: pepperAndSpices, mobile: pepperAndSpices },
}

export const productForms = ['Quills', 'Chips', 'Powder']
export const productQualities = ['H', 'C', 'V']
export const qualityVariants = ['H1', 'H2', 'H2', 'H2']
export const productFilters = ['All Products', 'Cinnamon', 'Pepper', 'All Poducts', 'All Poducts']

export const approachPoints = [
  { title: 'Clear product information', text: 'forms, grades, applications and packing options.' },
  { title: 'Practical export support', text: 'from sourcing and samples to export coordination.' },
  { title: 'Real Sri Lankan origin', text: 'a direct connection to the source and supplier network.' },
]

export const proofPoints = [
  { icon: 'doc-check', size: 52, title: 'Product specifications', text: 'Buyer-aligned product details and agreed grades.' },
  { icon: 'beaker', size: 44, title: 'Testing & reports', text: 'Available documentation according to product and order.' },
  { icon: 'traceability', size: 48, title: 'Traceability', text: 'Sourcing information where available and appropriate.' },
]

export const originList = ['Authentic Sri Lankan origin', 'Distinctive product character', 'Flexible product and packing discussions']

export type Service = { title: string; text: string; image: string; mobileWidth?: number }

export const homeServices: Service[] = [
  { title: 'Bulk Supply', text: 'Selected Sri Lankan products in buyer-defined quantities, grades and forms.', image: 'service-bulk' },
  { title: 'Sourcing Support', text: 'Need a product or specification that is not listed? Tell us what you need.', image: 'service-sourcing' },
  { title: 'Private Label', text: 'Where available, discuss product selection, packaging and labelling for your brand.', image: 'service-private-label' },
]

export const exportServices: Service[] = [
  ...homeServices,
  { title: 'Packing', text: 'Discuss bulk or consumer-ready packing for the target market.', image: 'service-packing', mobileWidth: 230 },
  { title: 'Shipping Support', text: 'Coordinate export documentation and shipping arrangements within agreed scope.', image: 'landscape' },
]

export const traceServices: Service[] = [
  { title: 'Sourcing', text: 'Carefully selected raw materials from trusted Sri Lankan growers.', image: 'service-bulk', mobileWidth: 256 },
  { title: 'Quality Checks', text: 'Cleaning, grading and quality testing based on buyer requirements.', image: 'service-sourcing' },
  { title: 'Export Documentation', text: 'Required documentation prepared for international shipment.', image: 'service-private-label' },
]

// The mobile Export screen in Figma uses these titles instead of the desktop ones.
export const exportServicesMobile: Service[] = [
  ...traceServices,
  { title: 'Packing', text: 'Discuss bulk or consumer-ready packing for the target market.', image: 'service-packing', mobileWidth: 230 },
  { title: 'Shipping Support', text: 'Coordinate export documentation and shipping arrangements within agreed scope.', image: 'landscape' },
]

export const journeySteps = ['Share Requirement', 'Confirm Product', 'Sample & Quality', 'Quantity & Packing', 'Commercial\nConfirmation', 'Export Preparation', 'Shipment']

export const qualitySteps = [
  { n: 1, title: 'Review', text: 'Product specification and relevant quality documents are reviewed.', iconX: 26, textX: 158 },
  { n: 2, title: 'Assess', text: 'Samples can be assessed before approval where applicable.', iconX: 52, textX: 174 },
  { n: 3, title: 'Monitor', text: 'Supplier performance is monitored over time.', iconX: 56, textX: 169 },
]

export const testingList = ['Specification confirmation', 'Certificate of Analysis', 'Microbiological testing', 'Pesticide residue testing', 'Heavy metals testing', 'Destination-specific testing']

// Figma's mobile card still shows "Name".
export const founder = { name: 'Sachith Nissanka', nameMobile: 'Name', role: 'Founder & Director', roleMobile: 'Founder', bio: 'Short professional bio and responsibility. Replace with verified founder information.' }

export const contactDetails = [
  { icon: 'phone', title: 'Name One', lines: ['+94 74 005 5791'] },
  { icon: 'phone', title: 'Name tow', lines: ['+94 74 005 5791'] },
  { icon: 'email', title: 'Email', lines: ['info@aygateceylon.com'] },
  { icon: 'location', title: 'Address', lines: ['101/2, Wanatha Road,', 'Maharagama, Sri Lanka.'] },
]

// Only the mobile product page still shows this table; desktop dropped it on Nov 5.
export const productTable = [
  ['Cinnamon Quills', 'Whole rolled cinnamon bark', 'Retail, food, beverage'],
  ['Cinnamon Chips', 'Broken cinnamon bark pieces', 'Extraction, tea, ingredients'],
  ['Cinnamon Powder', 'Ground to buyer specification', 'Bakery, beverage, seasoning'],
]

export const whyChoose = ['Authentic Sri Lankan origin', 'Rich natural aroma and sweet flavour', 'Carefully handpicked and graded', 'Consistent quality and clean processing', 'Available in multiple grades and sizes', 'Suitable for global food and beverage applications']

export const shareRequirements = 'Share your product, form, quantity, packing and destination requirements. We will review your inquiry and respond with the information needed for the next step.'
export const detailBody = 'True Ceylon cinnamon with a delicate aroma, sweet flavour and thin, multi-layered quills. Available in different forms and grades to meet global market requirements.'
export const quantityOptions = ['200kg']
export const inquiryOptions = ['Quote']
export const productOptions = ['Select']

// Login, registration and account. Not in Figma; written to match the site's tone. Inquiries are sample rows until the backend exists.
export const authCopy = {
  login: {
    eyebrow: 'Buyer Account',
    title: 'Welcome Back',
    body: 'Sign in to follow your quote requests, sample orders and saved products.',
    asideEyebrow: 'Aygate Ceylon',
    asideTitle: 'Nothing but the best, from Sri Lanka to your market.',
  },
  register: {
    eyebrow: 'Join Aygate Ceylon',
    title: 'Create Your Account',
    body: 'Register as a buyer to request quotes faster, track samples and keep your sourcing details in one place.',
    asideEyebrow: 'Why register',
    asideTitle: 'One place for every inquiry and shipment.',
  },
  benefits: ['Track quote and sample requests', 'Save products for your next order', 'Faster repeat inquiries'],
}

export const buyerTypes = ['Importer', 'Distributor', 'Wholesaler', 'Retailer', 'Private label brand', 'Food manufacturer', 'Other']

export type InquiryStatus = 'Under Review' | 'Quoted' | 'Sample Sent' | 'Shipped' | 'Closed'
export type Inquiry = { ref: string; product: string; type: string; quantity: string; destination: string; date: string; status: InquiryStatus }

export const sampleInquiries: Inquiry[] = [
  { ref: 'AYG-1042', product: 'Ceylon Cinnamon Quills · H1', type: 'Quote', quantity: '200kg', destination: 'Dubai, UAE', date: '08 Nov 2026', status: 'Under Review' },
  { ref: 'AYG-1037', product: 'Black Pepper · Whole', type: 'Sample', quantity: '1kg', destination: 'Hamburg, Germany', date: '29 Oct 2026', status: 'Sample Sent' },
  { ref: 'AYG-1029', product: 'Cinnamon Powder', type: 'Private Label', quantity: '500kg', destination: 'Toronto, Canada', date: '14 Oct 2026', status: 'Quoted' },
  { ref: 'AYG-1011', product: 'Ceylon Cinnamon Quills · C5', type: 'Bulk', quantity: '1,000kg', destination: 'Rotterdam, Netherlands', date: '22 Sep 2026', status: 'Shipped' },
]

export const accountTabs = [
  { id: 'overview', label: 'Overview', icon: 'leaf' },
  { id: 'orders', label: 'My Orders', icon: 'box' },
  { id: 'inquiries', label: 'Bulk Inquiries', icon: 'documents' },
  { id: 'saved', label: 'Saved Products', icon: 'heart' },
  { id: 'addresses', label: 'Addresses', icon: 'location' },
  { id: 'payments', label: 'Payment Methods', icon: 'card' },
  { id: 'profile', label: 'Profile', icon: 'user' },
] as const
