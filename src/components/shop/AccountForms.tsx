import { useState, type FormEvent } from 'react'
import type { Address, SavedCard } from '../../lib/shop'
import { Button, Icon, TextField } from '../ui'
import { Checkbox } from '../sections/AuthShell'

const half = 'grid grid-cols-2 gap-x-[20px] gap-y-[14px] max-lg:grid-cols-1 max-lg:gap-y-[12px]'

export type AddressInput = Omit<Address, 'id'> & { id?: string }

/** Delivery address fields. Used in checkout and under Account > Addresses. */
export function AddressFields({ initial }: { initial?: Partial<Address> }) {
  return (
    <div className={half}>
      <TextField label="Full Name" name="name" defaultValue={initial?.name} autoComplete="name" required />
      <TextField label="Phone" name="phone" type="tel" defaultValue={initial?.phone} placeholder="+94" autoComplete="tel" required />
      <div className="col-span-2 max-lg:col-span-1"><TextField label="Address" name="line1" defaultValue={initial?.line1} placeholder="House no., street" autoComplete="address-line1" required /></div>
      <div className="col-span-2 max-lg:col-span-1"><TextField label="Apartment, suite (optional)" name="line2" defaultValue={initial?.line2} autoComplete="address-line2" /></div>
      <TextField label="City" name="city" defaultValue={initial?.city} autoComplete="address-level2" required />
      <TextField label="Postal Code" name="postcode" defaultValue={initial?.postcode} autoComplete="postal-code" />
      <TextField label="Country" name="country" defaultValue={initial?.country ?? 'Sri Lanka'} autoComplete="country-name" required />
      <TextField label="Label" name="label" defaultValue={initial?.label} placeholder="Home, Office, Warehouse" />
    </div>
  )
}

export const readAddress = (form: HTMLFormElement | FormData, base?: Partial<Address>): AddressInput => {
  const d = Object.fromEntries(form instanceof FormData ? form : new FormData(form)) as Record<string, string>
  return {
    id: base?.id,
    label: d.label?.trim() || 'Address',
    name: d.name, phone: d.phone, line1: d.line1, line2: d.line2 ?? '', city: d.city, postcode: d.postcode ?? '', country: d.country,
    isDefault: d.isDefault === 'on' || !!base?.isDefault,
  }
}

export function AddressForm({ initial, onSave, onCancel }: { initial?: Address; onSave: (a: AddressInput) => void; onCancel: () => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(readAddress(e.currentTarget, initial))
  }
  return (
    <form onSubmit={submit} className="grid gap-[18px]">
      <AddressFields initial={initial} />
      {!initial?.isDefault && <div className="pl-[4px]"><Checkbox name="isDefault">Make this my default address</Checkbox></div>}
      <div className="flex items-center gap-[18px] max-lg:flex-col">
        <Button type="submit" size="md" className="w-[220px] max-lg:!h-[46px] max-lg:!text-[12px]">{initial ? 'Save Address' : 'Add Address'}</Button>
        <button type="button" onClick={onCancel} className="link-sweep text-p4 text-muted hover:text-gold-deep">Cancel</button>
      </div>
    </form>
  )
}

export function AddressBlock({ a, className = '' }: { a: Address; className?: string }) {
  return (
    <address className={`text-p4 leading-[22px] font-light not-italic ${className}`}>
      <span className="font-medium">{a.name}</span><br />
      {a.line1}{a.line2 && <>, {a.line2}</>}<br />
      {a.city}{a.postcode && ` ${a.postcode}`}, {a.country}<br />
      <span className="text-placeholder">{a.phone}</span>
    </address>
  )
}

// ---- Cards ----

export const cardBrand = (digits: string) =>
  /^4/.test(digits) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(digits) ? 'Mastercard' : /^3[47]/.test(digits) ? 'Amex' : 'Card'

const luhn = (digits: string) => {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i])
    if (i % 2) n = n * 2 > 9 ? n * 2 - 9 : n * 2
    sum += n
  }
  return sum % 10 === 0
}

export type CardInput = Omit<SavedCard, 'id' | 'isDefault'>

/** Checks the card fields and returns either an error or the safe-to-keep parts (never the full number or CVC). */
export function readCard(data: FormData): { error: string } | { card: CardInput } {
  const digits = String(data.get('number') ?? '').replace(/\D/g, '')
  const expiry = String(data.get('expiry') ?? '').trim()
  const cvc = String(data.get('cvc') ?? '').trim()
  const name = String(data.get('cardName') ?? '').trim()
  if (digits.length < 13 || digits.length > 19 || !luhn(digits)) return { error: 'Check the card number.' }
  const m = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/)
  if (!m || +m[1] < 1 || +m[1] > 12) return { error: 'Enter the expiry date as MM/YY.' }
  const now = new Date()
  const end = new Date(2000 + +m[2], +m[1], 1)
  if (end <= now) return { error: 'This card has expired.' }
  if (!/^\d{3,4}$/.test(cvc)) return { error: 'Check the security code (CVC).' }
  if (!name) return { error: 'Enter the name on the card.' }
  return { card: { brand: cardBrand(digits), last4: digits.slice(-4), expiry: `${m[1]}/${m[2]}`, name } }
}

/** Card number, expiry, CVC and name. Formatting only; validation happens in readCard on submit. */
export function CardFields() {
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const digits = number.replace(/\D/g, '')
  const brand = cardBrand(digits)
  return (
    <div className={half}>
      <div className="col-span-2 max-lg:col-span-1">
        <TextField
          label="Card Number" name="number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" required
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 '))}
          trailing={digits.length > 0 && <span className="text-p7 font-bold tracking-[0.1em] text-gold-deep uppercase">{brand}</span>}
        />
      </div>
      <TextField
        label="Expiry" name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" required
        value={expiry}
        onChange={(e) => {
          const d = e.target.value.replace(/\D/g, '').slice(0, 4)
          setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
        }}
      />
      <TextField label="CVC" name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} required />
      <div className="col-span-2 max-lg:col-span-1"><TextField label="Name on Card" name="cardName" autoComplete="cc-name" required /></div>
    </div>
  )
}

export function SecureNote({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-[8px] text-p6 font-light text-placeholder ${className}`}>
      <Icon name="lock" size={16} className="mt-[-1px] text-gold" />
      Card payments will be processed by our secure payment gateway. We only keep the card type, last four digits and expiry, never the full number or CVC.
    </p>
  )
}

/** Visual of a saved card. `mini` is the small version used in lists. */
export function PaymentCard({ card, mini, className = '' }: { card: Pick<SavedCard, 'brand' | 'last4' | 'expiry' | 'name'>; mini?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-[1.586] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#1d2b22_0%,#2f4a37_55%,#a27435_140%)] text-white ${mini ? 'rounded-[7px] p-[7px]' : 'rounded-[16px] p-[20px] shadow-[0_12px_24px_-12px_rgb(0_0_0/0.5)]'} ${className}`}>
      <img src="/images/bg-leaf-panel.webp" alt="" className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.07] mix-blend-screen" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span className={`rounded-[3px] bg-[linear-gradient(135deg,#e9c27c,#c48c40)] ${mini ? 'h-[10px] w-[14px]' : 'h-[26px] w-[36px] rounded-[5px]'}`} />
          <span className={`font-serif font-semibold italic ${mini ? 'text-[10px] leading-none' : 'text-[20px]'}`}>{card.brand}</span>
        </div>
        <p className={`mt-auto ${mini ? 'text-[8px] tracking-[0.1em]' : 'text-[18px] tracking-[0.18em]'}`}>{mini ? '•••• ' : '•••• •••• •••• '}{card.last4}</p>
        {!mini && (
          <div className="mt-[10px] flex items-end justify-between text-p7 tracking-[0.12em] uppercase">
            <span className="max-w-[70%] truncate">{card.name}</span>
            <span>{card.expiry}</span>
          </div>
        )}
      </div>
    </div>
  )
}
