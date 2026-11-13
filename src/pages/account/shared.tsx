import type { ReactNode } from 'react'
import type { InquiryStatus } from '../../data/content'
import type { OrderStatus } from '../../lib/shop'
import { Icon } from '../../components/ui'

export const leafPanel = { backgroundImage: 'url(/images/bg-leaf-panel.webp)', backgroundSize: 'cover' }
export const panel = 'rounded-panel bg-ivory shadow-soft'
export const panelPad = 'px-[28px] pt-[26px] pb-[28px] max-lg:px-[18px]'
export const linkClass = 'link-sweep font-medium text-gold-deep hover:text-gold'

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-h3 font-medium max-lg:text-[26px] max-lg:leading-[28px]">{children}</h2>
        <span className="mt-[10px] block h-[2px] w-[33px] bg-gold" />
      </div>
      {action}
    </div>
  )
}

const statusStyle: Record<InquiryStatus | OrderStatus, string> = {
  'Under Review': 'border border-gold text-gold-deep',
  Placed: 'border border-gold text-gold-deep',
  Quoted: 'bg-gold text-white',
  Confirmed: 'bg-gold/15 text-gold-deep',
  'Sample Sent': 'bg-gold/15 text-gold-deep',
  Packed: 'bg-gold/15 text-gold-deep',
  Shipped: 'bg-gold text-white',
  Delivered: 'bg-[#2f5d3a] text-white',
  Closed: 'bg-black/5 text-muted',
  Cancelled: 'bg-black/5 text-muted',
}

export function Status({ status }: { status: InquiryStatus | OrderStatus }) {
  return <span className={`inline-flex h-[24px] items-center rounded-chip px-[11px] text-p7 font-medium whitespace-nowrap ${statusStyle[status]}`}>{status}</span>
}

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className={`${panel} px-[28px] py-[56px] text-center`} style={leafPanel}>
      <Icon name={icon} size={40} className="text-gold" />
      <p className="mt-[16px] font-serif text-h3 font-medium">{title}</p>
      <p className="mx-auto mt-[8px] max-w-[420px] text-p4 font-light">{body}</p>
      {action && <div className="mt-[22px] flex justify-center">{action}</div>}
    </div>
  )
}

export function Notice({ children }: { children?: string }) {
  if (!children) return null
  return <p role="status" className="flex items-center gap-[8px] text-p5 font-medium text-[#2f5d3a]"><Icon name="doc-accept" size={18} className="text-[#2f5d3a]" />{children}</p>
}

/** Small text-style action used on address and card tiles. */
export function TileAction({ children, onClick, danger }: { children: ReactNode; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`text-p6 font-medium underline-offset-4 hover:underline ${danger ? 'text-muted hover:text-[#8f3317]' : 'text-gold-deep hover:text-gold'}`}>{children}</button>
}
