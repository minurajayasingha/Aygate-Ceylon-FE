// All page copy and data lives here. Text is word for word from Figma, so replacing a placeholder only takes one edit.

export const navLinks = [
  { label: 'Home', to: '/', left: 0 },
  { label: 'Products', to: '/products', left: 88 },
  { label: 'Quality', to: '/quality', left: 199 },
  { label: 'Export Services', to: '/export-services', left: 295 },
  { label: 'About', to: '/about', left: 458 },
  { label: 'Markets', to: '#', left: 547 },
  { label: 'Contact Us', to: '/contact', left: 651 },
]

export const footerColumns = {
  explore: [
    { label: 'Products', to: '/products' },
    { label: 'Quality', to: '/quality' },
    { label: 'Export Services', to: '/export-services' },
    { label: 'Markets', to: '#' },
  ],
  products: [
    { label: 'Cinnamon', to: '/products' },
    { label: 'Pepper', to: '/products' },
    { label: 'Tea', to: '/products' },
  ],
  contact: [
    { label: 'Request a Quote', to: '/contact' },
    { label: 'My Account', to: '#' },
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

const blurb = 'True Ceylon cinnamon in selected grades and forms for food, beverage and ingredient applications.'

export type Product = { slug: string; name: string; image: string; description: string; category: 'cinnamon' | 'pepper' }

export const homeProducts: Product[] = [
  { slug: 'ceylon-cinnamon-quills', name: 'Cinnamon', image: 'product-cinnamon', description: blurb, category: 'cinnamon' },
  { slug: 'ceylon-cinnamon-quills', name: 'Pepper', image: 'product-pepper', description: blurb, category: 'pepper' },
  { slug: 'ceylon-cinnamon-quills', name: 'Pepper', image: 'product-cardamom', description: blurb, category: 'pepper' },
  { slug: 'ceylon-cinnamon-quills', name: 'Pepper', image: 'product-cloves', description: blurb, category: 'pepper' },
]

export const cinnamonProducts: Product[] = ['Cinnamon Quills', 'Cinnamon', 'Cinnamon', 'Cinnamon'].map((name) => ({
  slug: 'ceylon-cinnamon-quills', name, image: 'product-cinnamon', description: blurb, category: 'cinnamon',
}))

const card = (name: string, image: string, category: Product['category']): Product => ({ slug: 'ceylon-cinnamon-quills', name, image, description: blurb, category })

// Products page. Figma changed the desktop cards on Nov 5 but not the mobile ones, so each keeps its own list.
export const catalogue = {
  cinnamon: {
    desktop: [1, 2, 3, 4].map(() => card('Cinnamon Quills', 'product-cinnamon', 'cinnamon')),
    mobile: [1, 2, 3, 4].map(() => card('Cinnamon', 'product-cinnamon', 'cinnamon')),
  },
  pepper: {
    desktop: [card('Pepper', 'product-pepper', 'pepper'), card('Pepper', 'product-pepper', 'pepper'), card('Cinnamon Quills', 'product-cinnamon', 'pepper'), card('Cinnamon Quills', 'product-cinnamon', 'pepper')],
    mobile: [1, 2, 3, 4].map(() => card('Pepper', 'product-pepper', 'pepper')),
  },
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
