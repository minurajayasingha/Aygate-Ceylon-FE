import { RedirectOnce } from '../../components/layout/RedirectOnce'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { accountTabs } from '../../data/content'
import { useAuth } from '../../lib/auth'
import { Button, Eyebrow, FilterChip, Icon } from '../../components/ui'
import { Orders } from './Orders'
import { Addresses, Inquiries, Overview, Payments, Profile, Saved } from './Sections'
import { leafPanel, linkClass, panel } from './shared'

export type Tab = (typeof accountTabs)[number]['id']

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'A'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  // Keep the last account while this page animates out after signing out.
  const [initial] = useState(user)
  if (!initial) return <RedirectOnce to="/login" state={{ from: '/account' }} />
  const me = user ?? initial

  const tab = (accountTabs.find((t) => t.id === params.get('tab'))?.id ?? 'overview') as Tab
  const go = (t: Tab) => setParams(t === 'overview' ? {} : { tab: t })
  const openOrder = (id: string) => setParams({ tab: 'orders', order: id })
  const leave = () => {
    navigate('/')
    signOut()
  }
  const first = me.name.split(' ')[0]

  return (
    <section className="mx-auto max-w-[1440px] px-[64px] pt-[170px] pb-[110px] max-lg:px-[18px] max-lg:pt-[101px] max-lg:pb-[64px]">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow size="lg" mobileSize="sm">My Account</Eyebrow>
          <h1 className="mt-[12px] font-serif text-h1 font-medium max-lg:mt-[10px] max-lg:text-h2-m">Welcome back, {first}.</h1>
          <p className="mt-[8px] text-p3 font-light max-lg:text-p6">Orders, bulk inquiries, saved products and payment details in one place.</p>
        </div>
        <div className="flex gap-[12px] max-lg:hidden">
          <Button to="/products" variant="outline" size="md" className="w-[200px]">Shop Products</Button>
          <Button to="/contact" size="md" className="w-[210px]">Request a Quote</Button>
        </div>
      </div>

      <div className="mt-[40px] grid grid-cols-[290px_1fr] items-start gap-[36px] max-lg:mt-[24px] max-lg:grid-cols-1 max-lg:gap-[20px]">
        <aside className={`${panel} overflow-hidden lg:sticky lg:top-[30px]`} style={leafPanel}>
          <div className="flex items-center gap-[14px] px-[24px] pt-[26px] pb-[22px] max-lg:px-[18px] max-lg:py-[16px]">
            <span className="grid size-[58px] shrink-0 place-items-center rounded-full bg-gold font-serif text-[26px] font-semibold text-white shadow-[0_6px_16px_-8px_rgb(196_140_64/0.9)] max-lg:size-[46px] max-lg:text-[20px]">{initials(me.name)}</span>
            <div className="min-w-0">
              <p className="truncate font-serif text-h4 font-semibold">{me.name}</p>
              <p className="mt-[3px] truncate text-p6 font-light text-placeholder">{me.email}</p>
              {(me.company || me.buyerType) && <p className="mt-[6px] truncate text-p7 tracking-[0.18em] text-gold-deep uppercase">{me.company || me.buyerType}</p>}
            </div>
            <button type="button" onClick={leave} aria-label="Sign out" className="icon-lift ml-auto text-gold-deep hover:text-gold lg:hidden"><Icon name="logout" size={22} /></button>
          </div>

          <nav aria-label="Account" className="border-t border-gold/30 p-[12px] max-lg:hidden">
            {accountTabs.map((t) => {
              const active = tab === t.id
              return (
                <button key={t.id} type="button" onClick={() => go(t.id)} aria-current={active ? 'page' : undefined} className={`flex w-full items-center gap-[12px] rounded-field px-[14px] py-[11px] text-left text-p3 transition-[color,background-color,translate] duration-300 ${active ? 'bg-gold text-white shadow-[0_6px_16px_-8px_rgb(196_140_64/0.9)]' : 'hover:translate-x-[3px] hover:bg-gold/10 hover:text-gold-deep'}`}>
                  <Icon name={t.icon} size={20} className={active ? 'text-white' : 'text-gold'} />
                  {t.label}
                </button>
              )
            })}
            <span className="my-[10px] block h-px bg-gold/30" />
            <button type="button" onClick={leave} className="flex w-full items-center gap-[12px] rounded-field px-[14px] py-[11px] text-left text-p3 text-muted transition-[color,background-color,translate] duration-300 hover:translate-x-[3px] hover:bg-gold/10 hover:text-gold-deep">
              <Icon name="logout" size={20} />Sign Out
            </button>
          </nav>
        </aside>

        <nav aria-label="Account" className="no-scrollbar -mx-[18px] flex gap-[8px] overflow-x-auto px-[18px] lg:hidden">
          {accountTabs.map((t) => <FilterChip key={t.id} active={tab === t.id} onClick={() => go(t.id)} className="h-[34px] !text-[13px]">{t.label}</FilterChip>)}
        </nav>

        <div key={tab + (params.get('order') ?? '')} className="min-w-0 animate-[hero-rise_600ms_cubic-bezier(0.22,1,0.36,1)_both]">
          {tab === 'overview' && <Overview user={me} go={go} openOrder={openOrder} />}
          {tab === 'orders' && <Orders />}
          {tab === 'inquiries' && <Inquiries />}
          {tab === 'saved' && <Saved />}
          {tab === 'addresses' && <Addresses />}
          {tab === 'payments' && <Payments />}
          {tab === 'profile' && <Profile user={me} />}
        </div>
      </div>

      <p className="mt-[40px] text-center text-p6 font-light text-muted">
        Need help with an order or shipment? <Link to="/contact" className={linkClass}>Contact us</Link>.
      </p>
    </section>
  )
}
