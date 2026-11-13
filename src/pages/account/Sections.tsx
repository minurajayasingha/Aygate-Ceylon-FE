import { useState, type FormEvent } from 'react'
import { buyerTypes, sampleInquiries, type Inquiry } from '../../data/content'
import { findProduct } from '../../data/shop'
import { useAuth, type Account } from '../../lib/auth'
import { useShop, type Address } from '../../lib/shop'
import { Button, Eyebrow, FilterChip, Icon, SelectField, SlideIn, TextField } from '../../components/ui'
import { ProductCard, ProductCardCompact } from '../../components/sections/ProductCard'
import { Checkbox, FormError, usePasswordToggle } from '../../components/sections/AuthShell'
import { AddressBlock, AddressForm, CardFields, PaymentCard, readCard, SecureNote } from '../../components/shop/AccountForms'
import { OrderList } from './Orders'
import { EmptyState, leafPanel, linkClass, Notice, panel, panelPad, SectionTitle, Status, TileAction } from './shared'
import type { Tab } from './AccountPage'

const isOpen = (i: Inquiry) => i.status !== 'Shipped' && i.status !== 'Closed'
const half = 'grid grid-cols-2 gap-x-[24px] gap-y-[14px] max-lg:grid-cols-1 max-lg:gap-y-[12px]'

// ---------- Overview ----------

export function Overview({ user, go, openOrder }: { user: Account; go: (t: Tab) => void; openOrder: (id: string) => void }) {
  const { orders, saved } = useShop()
  const active = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length
  const stats = [
    { icon: 'box', value: orders.length, label: active ? `Orders · ${active} in progress` : 'Orders', tab: 'orders' as Tab },
    { icon: 'documents', value: sampleInquiries.filter(isOpen).length, label: 'Open bulk inquiries', tab: 'inquiries' as Tab },
    { icon: 'heart', value: saved.length, label: 'Saved products', tab: 'saved' as Tab },
  ]
  return (
    <div className="grid gap-[28px]">
      <div className="grid grid-cols-3 gap-[20px] max-lg:gap-[10px]">
        {stats.map((s, i) => (
          <SlideIn key={s.label} from="up" kind="card" i={i} className="grid">
            <button type="button" onClick={() => go(s.tab)} className="rounded-panel border border-gold bg-cream px-[24px] py-[22px] text-left shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_20px_-10px_rgb(196_140_64/0.7)] max-lg:px-[12px] max-lg:py-[14px]">
              <Icon name={s.icon} size={34} className="text-gold max-lg:!size-[24px]" />
              <p className="mt-[14px] font-serif text-h2 font-medium max-lg:mt-[8px] max-lg:text-h3">{String(s.value).padStart(2, '0')}</p>
              <p className="mt-[4px] text-p4 font-light max-lg:text-p8">{s.label}</p>
            </button>
          </SlideIn>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_330px] gap-[20px] max-lg:grid-cols-1">
        <div className={`${panel} px-[28px] pt-[26px] pb-[10px] max-lg:px-[18px]`} style={leafPanel}>
          <SectionTitle action={orders.length > 0 && <button type="button" onClick={() => go('orders')} className={`text-p5 ${linkClass}`}>View all</button>}>Recent Orders</SectionTitle>
          {orders.length ? (
            <div className="mt-[8px]"><OrderList orders={orders} limit={3} onOpen={openOrder} /></div>
          ) : (
            <div className="py-[34px] text-center">
              <p className="text-p4 font-light">You haven’t placed an order yet.</p>
              <Button to="/products" size="sm" className="mt-[16px] w-[190px]">Shop Retail Packs</Button>
            </div>
          )}
        </div>

        <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-panel bg-ink p-[28px] text-white shadow-card">
          <img src="/images/landscape.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/5" />
          <div className="relative">
            <Eyebrow size="md">Bulk & export</Eyebrow>
            <p className="mt-[12px] font-serif text-h3 font-medium">Sourcing in volume{user.company ? ` for ${user.company}` : ''}?</p>
            <p className="mt-[8px] text-p5 font-light text-white/85">Share product, quantity and destination. We reply with pricing, samples and the next step.</p>
            <Button to="/contact" variant="outline-light" size="sm" className="mt-[18px] w-full">Request a Quote</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Bulk inquiries ----------

function InquiryList({ items }: { items: Inquiry[] }) {
  return (
    <ul className="divide-y divide-gold/25">
      {items.map((q) => (
        <li key={q.ref} className="flex items-center gap-[18px] py-[16px] max-lg:flex-wrap max-lg:gap-[8px]">
          <div className="min-w-0 flex-1">
            <p className="text-p6 tracking-[0.2em] text-gold-deep">{q.ref}</p>
            <p className="mt-[3px] truncate font-serif text-h4 font-semibold">{q.product}</p>
            <p className="mt-[4px] text-p6 font-light text-placeholder">{q.type} · {q.quantity} · {q.destination}</p>
          </div>
          <p className="text-p6 font-light text-muted max-lg:order-last max-lg:w-full">{q.date}</p>
          <Status status={q.status} />
        </li>
      ))}
    </ul>
  )
}

export function Inquiries() {
  const filters = ['All', 'Open', 'Completed'] as const
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const rows = sampleInquiries.filter((i) => filter === 'All' || (filter === 'Open') === isOpen(i))
  return (
    <div className={`${panel} px-[28px] pt-[26px] pb-[20px] max-lg:px-[18px]`} style={leafPanel}>
      <SectionTitle action={<Button to="/contact" size="sm" className="w-[170px] max-lg:hidden">New Inquiry</Button>}>Bulk Inquiries</SectionTitle>
      <p className="mt-[14px] text-p5 font-light text-placeholder">Quotes, samples and export orders arranged with our team. Sample data until the buyer portal is connected.</p>
      <div className="no-scrollbar mt-[18px] flex gap-[10px] overflow-x-auto">
        {filters.map((f) => <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)} className="h-[36px] !text-[14px]">{f}</FilterChip>)}
      </div>
      <table className="mt-[18px] w-full border-collapse text-left max-lg:hidden">
        <thead>
          <tr className="border-b border-gold text-p6 tracking-[0.2em] text-gold-deep uppercase">
            {['Ref', 'Product', 'Type', 'Quantity', 'Destination', 'Date', 'Status'].map((h) => <th key={h} scope="col" className="py-[12px] pr-[12px] font-normal">{h}</th>)}
          </tr>
        </thead>
        <tbody className="text-p4 font-light">
          {rows.map((q) => (
            <tr key={q.ref} className="border-b border-gold/25 transition-colors hover:bg-gold/5">
              <td className="py-[16px] pr-[12px] font-medium">{q.ref}</td>
              <td className="py-[16px] pr-[12px] font-serif text-h5 font-semibold">{q.product}</td>
              <td className="py-[16px] pr-[12px]">{q.type}</td>
              <td className="py-[16px] pr-[12px]">{q.quantity}</td>
              <td className="py-[16px] pr-[12px]">{q.destination}</td>
              <td className="py-[16px] pr-[12px] whitespace-nowrap text-muted">{q.date}</td>
              <td className="py-[16px]"><Status status={q.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-[6px] lg:hidden"><InquiryList items={rows} /></div>
      {!rows.length && <p className="py-[30px] text-center text-p4 font-light text-muted">Nothing here yet.</p>}
      <Button to="/contact" size="sm" className="mx-auto mt-[16px] flex w-[188px] lg:hidden">New Inquiry</Button>
    </div>
  )
}

// ---------- Saved ----------

export function Saved() {
  const { saved } = useShop()
  const products = saved.map(findProduct).filter((p) => !!p)
  if (!products.length) {
    return <EmptyState icon="heart" title="No saved products yet" body="Tap the heart on any product to keep it here for your next order or inquiry." action={<Button to="/products" size="sm" className="w-[200px]">Browse Products</Button>} />
  }
  return (
    <div>
      <SectionTitle>Saved Products</SectionTitle>
      <div className="mt-[24px] grid grid-cols-3 gap-[22px] max-lg:grid-cols-2 max-lg:gap-[12px]">
        {products.map((p, n) => {
          const card = { slug: p.slug, name: p.short, image: p.image, description: p.description, category: p.category }
          return (
            <SlideIn key={p.slug} from="up" kind="card" i={n}>
              <div className="max-lg:hidden"><ProductCard product={card} /></div>
              <div className="lg:hidden"><ProductCardCompact product={card} /></div>
            </SlideIn>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Addresses ----------

export function Addresses() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress } = useShop()
  const [editing, setEditing] = useState<Address | 'new' | null>(null)

  if (editing) {
    return (
      <div className={`${panel} ${panelPad}`} style={leafPanel}>
        <SectionTitle>{editing === 'new' ? 'Add an Address' : 'Edit Address'}</SectionTitle>
        <div className="mt-[24px]">
          <AddressForm initial={editing === 'new' ? undefined : editing} onCancel={() => setEditing(null)} onSave={(a) => { saveAddress(a); setEditing(null) }} />
        </div>
      </div>
    )
  }
  if (!addresses.length) {
    return <EmptyState icon="location" title="No saved addresses" body="Save delivery addresses here for faster checkout. Addresses you use at checkout can be saved too." action={<Button onClick={() => setEditing('new')} size="sm" className="w-[200px]">Add Address</Button>} />
  }
  return (
    <div>
      <SectionTitle action={<Button onClick={() => setEditing('new')} size="sm" className="w-[170px]">Add Address</Button>}>Addresses</SectionTitle>
      <div className="mt-[24px] grid grid-cols-2 gap-[18px] max-lg:grid-cols-1">
        {addresses.map((a) => (
          <div key={a.id} className={`${panel} flex flex-col px-[24px] py-[22px] ${a.isDefault ? 'ring-2 ring-gold' : ''}`} style={leafPanel}>
            <div className="flex items-center justify-between">
              <p className="text-p6 tracking-[0.25em] text-gold-deep uppercase">{a.label}</p>
              {a.isDefault && <span className="rounded-chip bg-gold px-[10px] py-[3px] text-p8 font-medium text-white">Default</span>}
            </div>
            <AddressBlock a={a} className="mt-[10px] flex-1" />
            <div className="mt-[16px] flex gap-[18px] border-t border-gold/25 pt-[12px]">
              <TileAction onClick={() => setEditing(a)}>Edit</TileAction>
              {!a.isDefault && <TileAction onClick={() => setDefaultAddress(a.id)}>Set as default</TileAction>}
              <TileAction danger onClick={() => removeAddress(a.id)}>Remove</TileAction>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Payment methods ----------

export function Payments() {
  const { cards, saveCard, removeCard, setDefaultCard } = useShop()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const result = readCard(data)
    if ('error' in result) return setError(result.error)
    saveCard({ ...result.card, isDefault: data.get('isDefault') === 'on' })
    setError('')
    setAdding(false)
  }

  if (adding) {
    return (
      <form onSubmit={submit} className={`${panel} ${panelPad}`} style={leafPanel}>
        <SectionTitle>Add a Card</SectionTitle>
        <div className="mt-[24px] grid gap-[16px]">
          <FormError>{error}</FormError>
          <CardFields />
          {cards.length > 0 && <div className="pl-[4px]"><Checkbox name="isDefault">Make this my default card</Checkbox></div>}
          <SecureNote />
          <div className="flex items-center gap-[18px] max-lg:flex-col">
            <Button type="submit" size="md" className="w-[220px] max-lg:!h-[46px] max-lg:!text-[12px]">Save Card</Button>
            <button type="button" onClick={() => { setAdding(false); setError('') }} className="link-sweep text-p4 text-muted hover:text-gold-deep">Cancel</button>
          </div>
        </div>
      </form>
    )
  }
  return (
    <div className="grid gap-[22px]">
      {cards.length ? (
        <div>
          <SectionTitle action={<Button onClick={() => setAdding(true)} size="sm" className="w-[170px]">Add Card</Button>}>Payment Methods</SectionTitle>
          <div className="mt-[24px] grid grid-cols-2 gap-[22px] max-lg:grid-cols-1">
            {cards.map((c) => (
              <div key={c.id}>
                <PaymentCard card={c} className={c.isDefault ? 'ring-2 ring-gold ring-offset-4 ring-offset-cream' : ''} />
                <div className="mt-[12px] flex items-center gap-[18px] px-[4px]">
                  {c.isDefault ? <span className="text-p6 font-medium text-gold-deep">Default card</span> : <TileAction onClick={() => setDefaultCard(c.id)}>Set as default</TileAction>}
                  <TileAction danger onClick={() => removeCard(c.id)}>Remove</TileAction>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon="card" title="No saved cards" body="Add a card for one-tap checkout, or save one while paying for an order." action={<Button onClick={() => setAdding(true)} size="sm" className="w-[200px]">Add Card</Button>} />
      )}
      <div className={`${panel} px-[24px] py-[18px]`} style={leafPanel}>
        <SecureNote />
        <p className="mt-[8px] pl-[24px] text-p6 font-light text-placeholder">Bank transfer is also available at checkout. Bulk and export orders are invoiced separately.</p>
      </div>
    </div>
  )
}

// ---------- Profile ----------

export function Profile({ user }: { user: Account }) {
  const { update } = useAuth()
  const password = usePasswordToggle()
  const [saved, setSaved] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    update({ name: d.name, company: d.company, email: d.email, whatsapp: d.whatsapp, country: d.country, buyerType: d.buyerType })
    setSaved('Your details are saved.')
  }

  const changePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    setPwMsg('')
    if (d.next.length < 8) return setPwError('Use at least 8 characters for your new password.')
    if (d.next !== d.confirm) return setPwError('The new passwords do not match.')
    setPwError('')
    setPwMsg('Password updated.')
    form.reset()
  }

  return (
    <div className="grid gap-[24px]">
      <form onSubmit={saveProfile} onChange={() => setSaved('')} className={`${panel} ${panelPad}`} style={leafPanel}>
        <SectionTitle>Business Details</SectionTitle>
        <div className={`mt-[24px] ${half}`}>
          <TextField label="Full Name" name="name" defaultValue={user.name} autoComplete="name" required />
          <TextField label="Company" name="company" defaultValue={user.company} placeholder="Company name" autoComplete="organization" />
          <TextField label="Email" name="email" type="email" defaultValue={user.email} autoComplete="email" required />
          <TextField label="WhatsApp" name="whatsapp" type="tel" defaultValue={user.whatsapp} placeholder="+94" autoComplete="tel" />
          <TextField label="Country" name="country" defaultValue={user.country} placeholder="Country" autoComplete="country-name" />
          <SelectField label="I am a" name="buyerType" options={buyerTypes} defaultValue={user.buyerType || undefined} />
        </div>
        <div className="mt-[24px] flex items-center gap-[20px] max-lg:flex-col-reverse">
          <Button type="submit" size="md" className="w-[240px] max-lg:!h-[46px] max-lg:!text-[12px]">Save Changes</Button>
          <Notice>{saved}</Notice>
        </div>
      </form>

      <form onSubmit={changePassword} className={`${panel} ${panelPad}`} style={leafPanel}>
        <SectionTitle>Password</SectionTitle>
        {user.provider === 'google' && <p className="mt-[14px] text-p5 font-light text-placeholder">You sign in with Google. Set a password here if you also want to sign in with your email.</p>}
        <div className={`mt-[24px] ${half}`}>
          {user.provider !== 'google' && (
            <div className="col-span-2 max-lg:col-span-1 lg:w-[calc(50%-12px)]">
              <TextField label="Current Password" name="current" type={password.type} autoComplete="current-password" required trailing={password.toggle} />
            </div>
          )}
          <TextField label="New Password" name="next" type={password.type} placeholder="8+ characters" autoComplete="new-password" required trailing={user.provider === 'google' ? password.toggle : undefined} />
          <TextField label="Confirm New Password" name="confirm" type={password.type} autoComplete="new-password" required />
        </div>
        {pwError && <p role="alert" className="mt-[14px] text-p5 text-[#8f3317]">{pwError}</p>}
        <div className="mt-[24px] flex items-center gap-[20px] max-lg:flex-col-reverse">
          <Button type="submit" variant="outline" size="md" className="w-[240px] max-lg:!h-[46px] max-lg:!text-[12px]">Update Password</Button>
          <Notice>{pwMsg}</Notice>
        </div>
      </form>
    </div>
  )
}
