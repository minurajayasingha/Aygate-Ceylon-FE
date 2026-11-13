import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatLKR, lowestPrice, searchProducts, shopProducts } from '../../data/shop'
import { useShop } from '../../lib/shop'
import { useOverlay } from '../../lib/useOverlay'
import { Eyebrow, Icon } from '../ui'

const suggestions = ['Cinnamon', 'Pepper', 'Powder', 'Cardamom', 'Cloves']

/** Header search: type to see matching products, Enter opens the first one. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop()
  const close = useCallback(() => setSearchOpen(false), [setSearchOpen])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useOverlay(searchOpen, close)

  // Following a link closes it.
  useEffect(() => close(), [pathname, close])
  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [searchOpen])

  if (!searchOpen) return null
  const results = query.trim() ? searchProducts(query) : shopProducts.slice(0, 4)

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[active]) navigate(`/products/${results[active].slug}`)
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Search products" data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-veil backdrop-blur-[10px] animate-[fade-in_250ms_ease-out]" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="mx-auto w-[960px] max-w-[calc(100%-36px)] pt-[110px] pb-[60px] animate-[hero-rise_500ms_cubic-bezier(0.22,1,0.36,1)] max-lg:pt-[70px]">
        <button type="button" aria-label="Close search" onClick={close} className="icon-lift absolute top-[40px] right-[48px] hover:text-gold max-lg:top-[22px] max-lg:right-[18px]"><Icon name="close" size={24} /></button>
        <Eyebrow size="md" mobileSize="sm">Search the collection</Eyebrow>
        <label className="mt-[14px] flex items-center gap-[16px] border-b-2 border-gold pb-[12px] transition-[border-color] focus-within:border-gold-deep">
          <Icon name="search" size={28} className="text-gold max-lg:!size-[22px]" />
          <span className="sr-only">Search products</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKey}
            placeholder="Cinnamon, pepper, powder…"
            className="w-full bg-transparent font-serif text-h2 font-medium outline-none focus-visible:outline-none placeholder:text-muted/70 max-lg:text-h3"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
          />
        </label>

        <div className="mt-[16px] flex flex-wrap items-center gap-[8px]">
          <span className="mr-[4px] text-p5 font-light text-placeholder">Popular:</span>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => { setQuery(s); input.current?.focus() }} className="rounded-chip border border-gold px-[12px] py-[4px] text-p5 text-gold-deep transition-colors hover:bg-gold hover:text-white">{s}</button>
          ))}
        </div>

        <p className="mt-[30px] text-p6 tracking-[0.3em] text-gold-deep uppercase">{query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Featured'}</p>
        <ul id="search-results" role="listbox" className="mt-[10px] grid grid-cols-2 gap-[12px] max-lg:grid-cols-1">
          {results.map((p, i) => (
            <li key={p.slug} id={`sr-${p.slug}`} role="option" aria-selected={i === active}>
              <Link to={`/products/${p.slug}`} onMouseEnter={() => setActive(i)} className={`group flex items-center gap-[16px] rounded-panel border bg-ivory p-[10px] transition-[border-color,box-shadow,translate] duration-300 ${i === active ? 'border-gold shadow-card' : 'border-transparent'}`}>
                <img src={`/images/${p.image}.webp`} alt="" className="size-[72px] shrink-0 rounded-field object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-p7 tracking-[0.25em] text-gold uppercase">{p.category}</p>
                  <p className="mt-[2px] truncate font-serif text-h4 font-semibold">{p.name}</p>
                  <p className="mt-[3px] text-p6 font-light text-placeholder">From {formatLKR(lowestPrice(p))} · {p.pack}</p>
                </div>
                <Icon name="arrow-right" size={16} className="mr-[8px] text-gold transition-transform duration-300 group-hover:translate-x-[4px]" />
              </Link>
            </li>
          ))}
        </ul>
        {query.trim() && !results.length && (
          <div className="mt-[10px] rounded-panel bg-ivory px-[24px] py-[28px] text-center">
            <p className="font-serif text-h4 font-semibold">No products match “{query}”.</p>
            <p className="mt-[6px] text-p4 font-light">Looking for something we don’t list? <Link to="/contact" className="link-sweep font-medium text-gold-deep">Ask us about sourcing</Link>.</p>
          </div>
        )}
        <Link to={`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`} className="link-sweep mt-[26px] inline-flex items-center gap-[8px] text-p4 font-medium text-gold-deep">
          See all products <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </div>
  )
}
