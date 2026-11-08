import { Link, useLocation } from 'react-router-dom'
import { footerBlurb, footerColumns } from '../../data/content'
import { Icon } from '../ui'

const social = [
  { name: 'facebook', size: 26, left: 180 },
  { name: 'linkedin', size: 23, left: 218 },
  { name: 'tiktok', size: 29, left: 253 },
  { name: 'instagram', size: 28, left: 293 },
]

function FooterColumn({ title, links, indent, gaps, className }: { title: string; links: { label: string; to: string }[]; indent: number; gaps: number[]; className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <h2 className="font-serif text-h3 font-bold whitespace-nowrap">{title}</h2>
      <ul className="mt-[12px] list-disc text-p3 font-light" style={{ paddingLeft: indent }}>
        {links.map(({ label, to }, i) => (
          <li key={label} style={{ marginTop: i ? gaps[i - 1] : 0 }} className="whitespace-nowrap marker:text-[10px]">
            <Link to={to} className="link-sweep link-nudge hover:text-gold">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  // The mobile Home frame in Figma has a taller footer than the other pages.
  const tall = useLocation().pathname === '/'
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <img src="/images/bg-footer.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
      <img src="/images/bg-footer-m.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
      <div className={`relative mx-auto h-[497px] max-w-[1440px] max-lg:max-w-[402px] ${tall ? 'max-lg:h-[820px]' : 'max-lg:h-[792px]'}`}>
        <img src="/images/logo-stacked.webp" alt="Aygate Ceylon. Nothing but the best" loading="lazy" className={`absolute top-[111px] left-[122px] h-[199px] w-[262px] max-lg:left-[73px] ${tall ? 'max-lg:top-[412px]' : 'max-lg:top-[393px]'}`} />
        <p className={`absolute top-[330px] left-[102px] w-[297px] text-center text-p6 font-light max-lg:left-[55px] max-lg:text-p8 ${tall ? 'max-lg:top-[632px]' : 'max-lg:top-[613px]'}`}>{footerBlurb}</p>
        <div className={`max-lg:absolute max-lg:left-[-49px] max-lg:h-[29px] max-lg:w-[321px] ${tall ? 'max-lg:top-[693px]' : 'max-lg:top-[674px]'}`}>
          {social.map(({ name, size, left }) => (
            <a key={name} href="#" aria-label={name} className="icon-lift absolute top-[426px] hover:text-gold max-lg:top-0" style={{ left, marginTop: (27 - size) / 2 }}>
              <Icon name={name} size={size} />
            </a>
          ))}
        </div>
        <FooterColumn title="Explore" links={footerColumns.explore} indent={23} gaps={[10, 10, 10]} className={`top-[142px] left-[659px] max-lg:top-[56px] ${tall ? 'max-lg:left-[47px]' : 'max-lg:left-[50px]'}`} />
        <FooterColumn title="Products" links={footerColumns.products} indent={23} gaps={[6, 9]} className="top-[142px] left-[908px] max-lg:top-[56px] max-lg:left-[236px]" />
        <FooterColumn title="Contact" links={footerColumns.contact} indent={16} gaps={[6, 6]} className={`top-[142px] left-[1139px] max-lg:left-[52px] ${tall ? 'max-lg:top-[257px]' : 'max-lg:top-[243px]'}`} />
        <p className={`absolute top-[433px] left-[1053px] text-p3 font-light whitespace-nowrap max-lg:left-[219px] max-lg:text-p8 ${tall ? 'max-lg:top-[784px]' : 'max-lg:top-[756px]'}`}>© 2026 Oora Labz. UI prototype.</p>
      </div>
    </footer>
  )
}
