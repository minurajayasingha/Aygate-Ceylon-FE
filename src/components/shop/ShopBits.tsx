import { useShop } from '../../lib/shop'
import { Icon } from '../ui'

/** Heart that saves a product. Sits on product cards and the product page. */
export function SaveButton({ slug, name, className = '', size = 18 }: { slug: string; name: string; className?: string; size?: number }) {
  const { isSaved, toggleSaved } = useShop()
  const saved = isSaved(slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSaved(slug)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      title={saved ? 'Saved' : 'Save for later'}
      className={`icon-lift grid place-items-center rounded-full bg-white/85 text-gold-deep shadow-soft backdrop-blur-sm hover:text-gold ${className}`}
    >
      <Icon key={String(saved)} name={saved ? 'heart-filled' : 'heart'} size={size} className={saved ? 'animate-[heart-pop_400ms_cubic-bezier(0.22,1,0.36,1)]' : ''} />
    </button>
  )
}

export function QtyStepper({ value, onChange, label, small }: { value: number; onChange: (n: number) => void; label: string; small?: boolean }) {
  const btn = `grid place-items-center text-gold-deep transition-colors hover:bg-gold/15 disabled:opacity-40 ${small ? 'size-[28px] text-[16px]' : 'size-[36px] text-[18px]'}`
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className="inline-flex items-center overflow-hidden rounded-control border border-gold bg-white/60">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} className={btn}>−</button>
      <span aria-live="polite" className={`text-center font-medium ${small ? 'w-[26px] text-p5' : 'w-[34px] text-p3'}`}>{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= 99} onClick={() => onChange(value + 1)} className={btn}>+</button>
    </div>
  )
}

/** Small count bubble on the header icons. */
export function CountBadge({ count }: { count: number }) {
  if (!count) return null
  return (
    <span key={count} className="absolute -top-[7px] -right-[9px] grid h-[16px] min-w-[16px] animate-[heart-pop_400ms_cubic-bezier(0.22,1,0.36,1)] place-items-center rounded-full bg-gold px-[4px] text-[10px] leading-none font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}
