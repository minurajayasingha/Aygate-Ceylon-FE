import { useCallback, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { findProduct, formatLKR, lowestPrice, pricing, variantPrice } from '../../data/shop'
import { useShop, type DrawerTab } from '../../lib/shop'
import { useOverlay } from '../../lib/useOverlay'
import { Button, Icon } from '../ui'
import { QtyStepper } from './ShopBits'

/** Slide-in panel from the right with the cart and saved products. Cart and heart icons open it. */
export function CartDrawer() {
  const { drawer, openDrawer, closeDrawer, cart, cartCount, saved, subtotal } = useShop()
  const close = useCallback(() => closeDrawer(), [closeDrawer])
  const { pathname } = useLocation()
  useOverlay(!!drawer, close)
  // Following a link closes it.
  useEffect(() => close(), [pathname, close])
  if (!drawer) return null

  const tabs: { id: DrawerTab; label: string; count: number }[] = [
    { id: 'cart', label: 'Cart', count: cartCount },
    { id: 'saved', label: 'Saved', count: saved.length },
  ]
  const toFree = pricing.freeShippingFrom - subtotal

  return (
    <div role="dialog" aria-modal="true" aria-label={drawer === 'cart' ? 'Your cart' : 'Saved products'} className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[4px] animate-[fade-in_250ms_ease-out]" onClick={(e) => e.target === e.currentTarget && close()}>
      <aside className="flex h-full w-[440px] max-w-full flex-col bg-ivory shadow-[-10px_0_30px_rgb(0_0_0/0.15)] animate-[drawer-in_450ms_cubic-bezier(0.22,1,0.36,1)]" style={{ backgroundImage: 'url(/images/bg-leaf-panel.webp)', backgroundSize: 'cover' }}>
        <div className="flex items-center justify-between px-[28px] pt-[26px] max-lg:px-[18px]">
          <div role="tablist" className="flex gap-[22px]">
            {tabs.map((t) => (
              <button key={t.id} role="tab" type="button" aria-selected={drawer === t.id} onClick={() => openDrawer(t.id)} className={`relative pb-[8px] font-serif text-h3 font-medium transition-colors ${drawer === t.id ? 'text-ink' : 'text-muted hover:text-gold-deep'}`}>
                {t.label}
                <span className="ml-[6px] align-top font-sans text-p6 text-gold-deep">{t.count}</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-gold transition-[width] duration-500 ${drawer === t.id ? 'w-[33px]' : 'w-0'}`} />
              </button>
            ))}
          </div>
          <button type="button" aria-label="Close" onClick={close} className="icon-lift hover:text-gold"><Icon name="close" size={22} /></button>
        </div>

        <div data-lenis-prevent className="mt-[14px] flex-1 overflow-y-auto px-[28px] max-lg:px-[18px]">
          {drawer === 'cart' ? <CartList /> : <SavedList />}
        </div>

        {drawer === 'cart' && cart.length > 0 && (
          <div className="border-t border-gold/40 bg-ivory/90 px-[28px] pt-[18px] pb-[24px] backdrop-blur-sm max-lg:px-[18px]">
            {toFree > 0 ? (
              <p className="text-p6 font-light text-placeholder">Add {formatLKR(toFree)} more for free standard delivery.</p>
            ) : (
              <p className="text-p6 font-medium text-[#2f5d3a]">You qualify for free standard delivery.</p>
            )}
            <div className="mt-[10px] h-[3px] overflow-hidden rounded-full bg-gold/20"><div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / pricing.freeShippingFrom) * 100)}%` }} /></div>
            <div className="mt-[16px] flex items-baseline justify-between">
              <span className="text-p3">Subtotal</span>
              <span className="font-serif text-h3 font-semibold">{formatLKR(subtotal)}</span>
            </div>
            <p className="mt-[2px] text-p6 font-light text-placeholder">VAT and delivery are added at checkout.</p>
            <Button to="/checkout" size="md" className="mt-[16px] w-full">Checkout</Button>
            <p className="mt-[12px] text-center text-p6 font-light text-placeholder">Buying in bulk? <Link to="/contact" className="link-sweep font-medium text-gold-deep">Request a quote</Link></p>
          </div>
        )}
      </aside>
    </div>
  )
}

function Empty({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="pt-[60px] text-center">
      <Icon name={icon} size={40} className="text-gold" />
      <p className="mt-[14px] font-serif text-h3 font-medium">{title}</p>
      <p className="mx-auto mt-[6px] w-[280px] text-p4 font-light">{body}</p>
      <Button to="/products" size="sm" className="mt-[22px] w-[200px]">Browse Products</Button>
    </div>
  )
}

function CartList() {
  const { cart, setQty, removeFromCart } = useShop()
  if (!cart.length) return <Empty icon="cart" title="Your cart is empty" body="Add retail packs from any product page. Bulk orders go through a quote." />
  return (
    <ul className="divide-y divide-gold/25">
      {cart.map((l) => {
        const p = findProduct(l.slug)!
        return (
          <li key={`${l.slug}-${l.variant}`} className="flex gap-[14px] py-[16px]">
            <Link to={`/products/${p.slug}`}><img src={`/images/${p.image}.webp`} alt="" className="size-[84px] rounded-field object-cover" /></Link>
            <div className="min-w-0 flex-1">
              <Link to={`/products/${p.slug}`} className="block truncate font-serif text-h4 font-semibold hover:text-gold-deep">{p.name}</Link>
              <p className="mt-[3px] text-p6 font-light text-placeholder">{l.variant} · {p.pack}</p>
              <div className="mt-[10px] flex items-center justify-between">
                <QtyStepper small value={l.qty} label={p.name} onChange={(n) => setQty(l.slug, l.variant, n)} />
                <span className="text-p4 font-medium">{formatLKR(variantPrice(p, l.variant) * l.qty)}</span>
              </div>
              <button type="button" onClick={() => removeFromCart(l.slug, l.variant)} className="mt-[6px] text-p7 text-muted underline-offset-2 hover:text-gold-deep hover:underline">Remove</button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function SavedList() {
  const { saved, toggleSaved, addToCart, openDrawer } = useShop()
  const products = saved.map(findProduct).filter((p) => !!p)
  if (!products.length) return <Empty icon="heart" title="Nothing saved yet" body="Tap the heart on any product to keep it here for later." />
  return (
    <ul className="divide-y divide-gold/25">
      {products.map((p) => (
        <li key={p.slug} className="flex gap-[14px] py-[16px]">
          <Link to={`/products/${p.slug}`}><img src={`/images/${p.image}.webp`} alt="" className="size-[84px] rounded-field object-cover" /></Link>
          <div className="min-w-0 flex-1">
            <Link to={`/products/${p.slug}`} className="block truncate font-serif text-h4 font-semibold hover:text-gold-deep">{p.name}</Link>
            <p className="mt-[3px] text-p6 font-light text-placeholder">From {formatLKR(lowestPrice(p))} · {p.pack}</p>
            <div className="mt-[10px] flex items-center gap-[16px]">
              <button type="button" onClick={() => { addToCart(p.slug, p.variants[0].code); openDrawer('cart') }} className="rounded-control bg-gold px-[12px] py-[6px] text-p6 font-medium text-white transition-colors hover:bg-gold-deep">Add to cart</button>
              <button type="button" onClick={() => toggleSaved(p.slug)} className="text-p7 text-muted underline-offset-2 hover:text-gold-deep hover:underline">Remove</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
