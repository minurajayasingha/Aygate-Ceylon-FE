import { RedirectOnce } from '../components/layout/RedirectOnce'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findProduct, formatLKR, pricing, totals, variantPrice, type DeliveryId } from '../data/shop'
import { useAuth } from '../lib/auth'
import { useShop, type Address, type Payment } from '../lib/shop'
import { Button, Eyebrow, Icon } from '../components/ui'
import { Checkbox, FormError } from '../components/sections/AuthShell'
import { AddressBlock, AddressFields, CardFields, PaymentCard, readAddress, readCard, SecureNote } from '../components/shop/AccountForms'
import { QtyStepper } from '../components/shop/ShopBits'
import { pageSeo, useSeo } from '../seo'

const leafPanel = { backgroundImage: 'url(/images/bg-leaf-panel.webp)', backgroundSize: 'cover' }
const panel = 'rounded-panel bg-ivory shadow-soft px-[28px] pt-[24px] pb-[28px] max-lg:px-[18px]'

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className={panel} style={leafPanel}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-[14px]">
        <span className="grid size-[34px] place-items-center rounded-full bg-gold font-serif text-[18px] font-semibold text-white">{n}</span>
        <h2 aria-hidden className="font-serif text-h3 font-medium max-lg:text-[26px] max-lg:leading-[28px]">{title}</h2>
      </div>
      <div className="mt-[22px]">{children}</div>
    </fieldset>
  )
}

/** Selectable card with a hidden radio; the gold border shows the choice. */
function Choice({ name, value, checked, onChange, children, className = '' }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; children: ReactNode; className?: string }) {
  return (
    <label className={`relative flex cursor-pointer gap-[12px] rounded-field border bg-white/55 p-[16px] transition-[border-color,background-color,box-shadow] duration-300 ${checked ? 'border-gold bg-cream shadow-[0_6px_16px_-10px_rgb(196_140_64/0.9)]' : 'border-gold/25 hover:border-gold/60'} ${className}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="peer sr-only" />
      <span className={`mt-[2px] grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${checked ? 'border-gold' : 'border-muted/60'}`}>
        <span className={`size-[8px] rounded-full bg-gold transition-transform duration-300 ${checked ? 'scale-100' : 'scale-0'}`} />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </label>
  )
}

export function CheckoutPage() {
  useSeo(pageSeo('/checkout'))
  const { user } = useAuth()
  const shop = useShop()
  const navigate = useNavigate()
  const defaultAddress = shop.addresses.find((a) => a.isDefault) ?? shop.addresses[0]
  const defaultCard = shop.cards.find((c) => c.isDefault) ?? shop.cards[0]
  const [addressId, setAddressId] = useState(defaultAddress?.id ?? 'new')
  const [delivery, setDelivery] = useState<DeliveryId>('standard')
  const [method, setMethod] = useState<Payment['method']>('card')
  const [cardId, setCardId] = useState(defaultCard?.id ?? 'new')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!user) return <RedirectOnce to="/login" state={{ from: '/checkout' }} />

  const sum = totals(shop.subtotal, delivery)

  if (!shop.cart.length && !busy) {
    return (
      <section className="mx-auto max-w-[1440px] px-[64px] pt-[200px] pb-[140px] text-center max-lg:px-[18px] max-lg:pt-[130px] max-lg:pb-[80px]">
        <Icon name="cart" size={44} className="text-gold" />
        <h1 className="mt-[16px] font-serif text-h1 font-medium max-lg:text-h3">Your cart is empty</h1>
        <p className="mt-[8px] text-p3 font-light max-lg:text-p6">Add retail packs from any product page, or request a quote for bulk orders.</p>
        <div className="mt-[28px] flex justify-center gap-[14px] max-lg:flex-col max-lg:items-center">
          <Button to="/products" size="md" className="w-[220px]">Browse Products</Button>
          <Button to="/contact" variant="outline" size="md" className="w-[220px]">Request a Quote</Button>
        </div>
      </section>
    )
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)

    let address: Address | undefined = shop.addresses.find((a) => a.id === addressId)
    if (addressId === 'new' || !address) {
      const input = readAddress(data)
      address = data.get('saveAddress') === 'on' ? shop.saveAddress(input) : { ...input, id: 'once' }
    }

    let payment: Payment = { method: 'bank' }
    if (method === 'card') {
      const saved = shop.cards.find((c) => c.id === cardId)
      if (cardId === 'new' || !saved) {
        const result = readCard(data)
        if ('error' in result) return setError(result.error)
        if (data.get('saveCard') === 'on') shop.saveCard(result.card)
        payment = { method: 'card', brand: result.card.brand, last4: result.card.last4 }
      } else {
        payment = { method: 'card', brand: saved.brand, last4: saved.last4 }
      }
    }

    setBusy(true)
    // Stand-in for the payment gateway round trip.
    await new Promise((r) => setTimeout(r, 1100))
    const order = shop.placeOrder({ delivery, address, payment })
    navigate(`/account?tab=orders&order=${order.id}&placed=1`)
  }

  return (
    <section className="mx-auto max-w-[1440px] px-[64px] pt-[170px] pb-[110px] max-lg:px-[18px] max-lg:pt-[101px] max-lg:pb-[64px]">
      <Eyebrow size="lg" mobileSize="sm"><span className="inline-flex items-center gap-[8px]"><Icon name="lock" size={14} />Secure Checkout</span></Eyebrow>
      <div className="flex items-end justify-between gap-6">
        <h1 className="mt-[12px] font-serif text-h1 font-medium max-lg:text-h2-m">Checkout</h1>
        <button type="button" onClick={() => shop.openDrawer('cart')} className="link-sweep mb-[8px] text-p4 font-medium text-gold-deep max-lg:hidden">Edit cart</button>
      </div>
      <p className="mt-[8px] text-p3 font-light max-lg:text-p6">Retail packs delivered within Sri Lanka. For export and bulk quantities, <Link to="/contact" className="link-sweep font-medium text-gold-deep">request a quote</Link>.</p>

      <form id="checkout" onSubmit={submit} className="mt-[36px] grid grid-cols-[1fr_420px] items-start gap-[32px] max-lg:mt-[24px] max-lg:grid-cols-1 max-lg:gap-[20px]">
        <div className="grid min-w-0 gap-[22px]">
          <Step n={1} title="Delivery Address">
            {shop.addresses.length > 0 && (
              <div className="grid grid-cols-2 gap-[12px] max-lg:grid-cols-1">
                {shop.addresses.map((a) => (
                  <Choice key={a.id} name="addressId" value={a.id} checked={addressId === a.id} onChange={setAddressId}>
                    <p className="mb-[6px] text-p7 tracking-[0.25em] text-gold-deep uppercase">{a.label}{a.isDefault && ' · Default'}</p>
                    <AddressBlock a={a} />
                  </Choice>
                ))}
                <Choice name="addressId" value="new" checked={addressId === 'new'} onChange={setAddressId} className="items-center">
                  <p className="font-serif text-h4 font-semibold">+ Use a new address</p>
                </Choice>
              </div>
            )}
            {addressId === 'new' && (
              <div className={shop.addresses.length ? 'mt-[22px]' : ''}>
                <AddressFields initial={{ name: user.name, phone: user.whatsapp, country: user.country || 'Sri Lanka' }} />
                <div className="mt-[16px] pl-[4px]"><Checkbox name="saveAddress" defaultChecked>Save this address to my account</Checkbox></div>
              </div>
            )}
          </Step>

          <Step n={2} title="Delivery Method">
            <div className="grid grid-cols-2 gap-[12px] max-lg:grid-cols-1">
              {pricing.delivery.map((d) => {
                const fee = totals(shop.subtotal, d.id).shipping
                return (
                  <Choice key={d.id} name="delivery" value={d.id} checked={delivery === d.id} onChange={(v) => setDelivery(v as DeliveryId)}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-serif text-h4 font-semibold">{d.label}</p>
                      <p className="text-p4 font-medium">{fee ? formatLKR(fee) : 'Free'}</p>
                    </div>
                    <p className="mt-[4px] text-p6 font-light text-placeholder">{d.note}</p>
                  </Choice>
                )
              })}
            </div>
            <p className="mt-[12px] text-p6 font-light text-placeholder">Free standard delivery on orders over {formatLKR(pricing.freeShippingFrom)}.</p>
          </Step>

          <Step n={3} title="Payment">
            <div className="grid grid-cols-2 gap-[12px] max-lg:grid-cols-1">
              <Choice name="method" value="card" checked={method === 'card'} onChange={() => setMethod('card')}>
                <p className="flex items-center gap-[8px] font-serif text-h4 font-semibold"><Icon name="card" size={20} className="text-gold" />Credit / Debit Card</p>
                <p className="mt-[4px] text-p6 font-light text-placeholder">Visa, Mastercard, Amex</p>
              </Choice>
              <Choice name="method" value="bank" checked={method === 'bank'} onChange={() => setMethod('bank')}>
                <p className="flex items-center gap-[8px] font-serif text-h4 font-semibold"><Icon name="documents" size={20} className="text-gold" />Bank Transfer</p>
                <p className="mt-[4px] text-p6 font-light text-placeholder">We dispatch once payment clears</p>
              </Choice>
            </div>

            {method === 'card' && (
              <div className="mt-[22px]">
                {shop.cards.length > 0 && (
                  <div className="grid grid-cols-2 gap-[12px] max-lg:grid-cols-1">
                    {shop.cards.map((c) => (
                      <Choice key={c.id} name="cardId" value={c.id} checked={cardId === c.id} onChange={setCardId} className="items-center">
                        <div className="flex items-center gap-[14px]">
                          <PaymentCard card={c} mini className="w-[84px]" />
                          <div>
                            <p className="text-p4 font-medium">{c.brand} •••• {c.last4}</p>
                            <p className="text-p6 font-light text-placeholder">Expires {c.expiry}{c.isDefault && ' · Default'}</p>
                          </div>
                        </div>
                      </Choice>
                    ))}
                    <Choice name="cardId" value="new" checked={cardId === 'new'} onChange={setCardId} className="items-center">
                      <p className="font-serif text-h4 font-semibold">+ Use a new card</p>
                    </Choice>
                  </div>
                )}
                {cardId === 'new' && (
                  <div className={shop.cards.length ? 'mt-[22px]' : ''}>
                    <CardFields />
                    <div className="mt-[16px] pl-[4px]"><Checkbox name="saveCard" defaultChecked>Save this card for faster checkout</Checkbox></div>
                  </div>
                )}
              </div>
            )}
            {method === 'bank' && (
              <p className="mt-[18px] rounded-field border border-gold/40 bg-cream/70 px-[16px] py-[12px] text-p5 font-light">
                After you place the order we show our bank details and email them to <b className="font-medium">{user.email}</b>. Use your order number as the payment reference.
              </p>
            )}
            <SecureNote className="mt-[18px]" />
          </Step>
        </div>

        <aside className={`${panel} lg:sticky lg:top-[30px]`} style={leafPanel}>
          <h2 className="font-serif text-h3 font-medium">Order Summary</h2>
          <span className="mt-[10px] block h-[2px] w-[33px] bg-gold" />
          <ul data-lenis-prevent className="mt-[10px] max-h-[330px] divide-y divide-gold/25 overflow-y-auto pr-[4px]">
            {shop.cart.map((l) => {
              const p = findProduct(l.slug)!
              return (
                <li key={`${l.slug}-${l.variant}`} className="flex gap-[12px] py-[14px]">
                  <img src={`/images/${p.image}.webp`} alt="" className="size-[64px] rounded-field object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-h5 font-semibold">{p.name}</p>
                    <p className="text-p7 font-light text-placeholder">{l.variant} · {p.pack}</p>
                    <div className="mt-[8px] flex items-center justify-between">
                      <QtyStepper small value={l.qty} label={p.name} onChange={(n) => shop.setQty(l.slug, l.variant, n)} />
                      <span className="text-p5 font-medium">{formatLKR(variantPrice(p, l.variant) * l.qty)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <dl className="mt-[8px] grid grid-cols-[1fr_auto] gap-y-[8px] border-t border-gold/40 pt-[16px] text-p4">
            <dt className="font-light">Subtotal</dt><dd>{formatLKR(sum.subtotal)}</dd>
            <dt className="font-light">Delivery</dt><dd>{sum.shipping ? formatLKR(sum.shipping) : 'Free'}</dd>
            <dt className="font-light">VAT ({Math.round(pricing.vatRate * 100)}%)</dt><dd>{formatLKR(sum.tax)}</dd>
            <dt className="mt-[8px] border-t border-gold/40 pt-[12px] font-serif text-h4 font-semibold">Total</dt>
            <dd className="mt-[8px] border-t border-gold/40 pt-[12px] font-serif text-h3 font-semibold">{formatLKR(sum.total)}</dd>
          </dl>
          <div className="mt-[16px]"><FormError>{error}</FormError></div>
          <Button type="submit" size="md" disabled={busy} className="mt-[14px] w-full disabled:opacity-70">
            {busy ? (method === 'card' ? 'Processing payment…' : 'Placing order…') : method === 'card' ? `Pay ${formatLKR(sum.total)}` : 'Place Order'}
          </Button>
          <p className="mt-[12px] text-center text-p7 font-light text-placeholder">By placing this order you agree to our terms of sale.</p>
        </aside>
      </form>
    </section>
  )
}
