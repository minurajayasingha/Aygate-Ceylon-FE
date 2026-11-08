import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../../data/content'
import { Icon, Logo } from '../ui'

export function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const onCream = pathname.startsWith('/products/')
  const text = onCream ? 'text-ink' : 'text-white'

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className={`absolute inset-x-0 top-0 z-30 ${text}`}>
      <div className="relative mx-auto h-[120px] max-w-[1440px] max-lg:h-[70px]">
        <Logo tone={onCream ? 'dark' : 'light'} className={`absolute top-[65px] left-[64px] h-[55px] w-[198px] max-lg:left-[18px] max-lg:h-[35px] max-lg:w-[126px] ${onCream ? 'max-lg:top-[21px]' : 'max-lg:top-[29px]'}`} />

        <nav aria-label="Main" className="absolute top-[82px] left-[391px] hidden h-[21px] w-[735px] lg:block">
          {navLinks.map(({ label, to, left }) => {
            const active = to !== '#' && (to === '/' ? pathname === '/' : pathname.startsWith(to))
            return (
              <NavLink key={label} to={to} style={{ left }} className={`absolute top-0 text-[16px] leading-[20.8px] whitespace-nowrap hover:text-gold ${active ? '' : 'link-sweep'} ${active ? `font-bold ${onCream ? 'text-gold-deep' : 'text-gold'}` : 'font-normal'}`}>
                {label}
                {active && <span className={`absolute top-[21px] left-1/2 h-px w-[21px] -translate-x-1/2 ${onCream ? 'bg-gold-deep' : 'bg-gold'}`} />}
              </NavLink>
            )
          })}
        </nav>

        <div className={`absolute top-[83px] right-[68px] flex items-center gap-[23px] max-lg:top-[34px] max-lg:right-[16px] max-lg:gap-[17px] max-lg:[&_path]:stroke-[1.4] ${onCream ? 'max-lg:text-gold' : ''}`}>
          <button type="button" aria-label="Search" className="icon-lift hover:text-gold"><Icon name="search" size={20} className="max-lg:!size-[21px]" /></button>
          <button type="button" aria-label="Cart" className="icon-lift hover:text-gold"><Icon name="cart" size={20} className="max-lg:!size-[21px]" /></button>
          <button type="button" aria-label="Wishlist" className="icon-lift hover:text-gold"><Icon name="heart" size={16} className="max-lg:!size-[21px]" /></button>
          {/* Mobile only: desktop already shows the nav links. */}
          <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="icon-lift hover:text-gold lg:hidden"><Icon name="menu" size={21} /></button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu" className="absolute inset-x-[16px] top-[70px] rounded-panel border border-gold bg-ivory p-4 text-ink shadow-card lg:hidden">
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} onClick={() => setOpen(false)} className="link-nudge block py-2 text-p2 transition-[color,translate] duration-300 hover:text-gold">{label}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}
