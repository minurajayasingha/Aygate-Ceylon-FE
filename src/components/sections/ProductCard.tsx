import { Link } from 'react-router-dom'
import type { Product } from '../../data/content'
import { productForms, productQualities } from '../../data/content'
import { Icon, Tag } from '../ui'

// Tall cards add a tag row: forms on Home, qualities on the Products page.
const tagRows = {
  forms: { label: 'AVAILABLE FORMS', items: productForms, chip: '' },
  qualities: { label: 'AVAILABLE Qualities', items: productQualities, chip: 'w-[51px] justify-center' },
}

type Props = { product: Product; tags?: keyof typeof tagRows; framed?: boolean; className?: string; compact?: boolean }

const cardBg = (showForms?: boolean) => (showForms ? 'card-bg-tall' : 'card-bg')

// Hovering a card lifts it and settles the photo into an inset, shadowed frame.
// `framed` pins that hover look on (used for static previews).
const imgBase = 'absolute object-cover transition-[top,left,width,height,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
const imgFramed = 'top-[8px] left-[8px] h-[230px] w-[calc(100%-18px)] rounded-panel shadow-[4px_4px_4px_rgb(0_0_0/0.25)]'
const imgNormal = 'top-[6px] left-[4px] h-[239px] w-[calc(100%-10px)] rounded-card shadow-none group-hover:top-[8px] group-hover:left-[8px] group-hover:h-[230px] group-hover:w-[calc(100%-18px)] group-hover:rounded-panel group-hover:shadow-[4px_4px_4px_rgb(0_0_0/0.25)]'

export function ProductCard({ product, tags, framed, className = '' }: Props) {
  const showForms = !!tags
  const row = tags && tagRows[tags]
  return (
    <article className={`group relative overflow-hidden rounded-card border border-gold bg-cream shadow-card transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_8px_14px_rgb(0_0_0/0.1)] ${showForms ? 'h-[461px]' : 'h-[423px]'} ${className}`} style={{ backgroundImage: `url(/images/${cardBg(showForms)}.webp)`, backgroundSize: '100% 100%', backgroundOrigin: 'border-box' }}>
      <img src={`/images/${product.image}.webp`} alt={product.name} loading="lazy" className={`${imgBase} ${framed ? imgFramed : imgNormal}`} />
      <h3 className="absolute top-[258px] left-[16px] font-serif text-h3 font-semibold whitespace-nowrap">{product.name}</h3>
      <span className="absolute top-[292px] left-[21px] h-[2px] w-[33px] bg-gold" />
      <p className="absolute top-[303px] left-[17px] w-[279px] max-w-[calc(100%-30px)] text-p6 font-light">{product.description}</p>
      {row && (
        <>
          <p className="absolute top-[362px] left-[21px] text-[9px] leading-[10.7px] tracking-[0.25em] text-gold">{row.label}</p>
          <div className="absolute top-[377px] left-[20px] flex gap-[13px]">{row.items.map((f) => <Tag key={f} className={row.chip}>{f}</Tag>)}</div>
        </>
      )}
      <Link to={`/products/${product.slug}`} className={`absolute left-[20px] flex items-center gap-[10px] text-p5 font-medium text-muted transition-colors duration-300 group-hover:text-gold ${showForms ? 'top-[419px]' : 'top-[374px]'}`}>
        Explore Product <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-[4px]" />
      </Link>
    </article>
  )
}

// Two-up card used on phones.
export function ProductCardCompact({ product }: { product: Product }) {
  return (
    <article className="relative h-[246px] overflow-hidden rounded-card border border-gold bg-cream" style={{ backgroundImage: 'url(/images/card-bg-m.webp)', backgroundSize: '100% 100%', backgroundOrigin: 'border-box' }}>
      <img src={`/images/${product.image}.webp`} alt={product.name} loading="lazy" className="absolute top-[4px] left-[4px] h-[134px] w-[calc(100%-10px)] rounded-panel object-cover" />
      <h3 className="absolute top-[150px] left-[18px] font-serif text-h4 font-semibold whitespace-nowrap">{product.name}</h3>
      <span className="absolute top-[172px] left-[20px] h-px w-[19px] bg-gold" />
      <p className="absolute top-[179px] left-[18px] w-[160px] text-[8px] leading-[10.3px] font-light">{product.description}</p>
      <Link to={`/products/${product.slug}`} className="absolute top-[219px] left-[18px] flex items-center gap-[4px] text-[8px] leading-[10.3px] font-medium text-muted hover:text-gold">
        Explore Product <Icon name="arrow-right" size={10} className="text-muted" />
      </Link>
    </article>
  )
}
