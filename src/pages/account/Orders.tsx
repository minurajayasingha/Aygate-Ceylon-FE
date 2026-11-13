import { Fragment } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { bankDetails, formatLKR, pricing } from '../../data/shop'
import { orderSteps, useShop, type Order } from '../../lib/shop'
import { Button, Icon } from '../../components/ui'
import { AddressBlock } from '../../components/shop/AccountForms'
import { EmptyState, formatDate, leafPanel, linkClass, panel, panelPad, SectionTitle, Status } from './shared'

const itemCount = (o: Order) => o.items.reduce((n, i) => n + i.qty, 0)

export function OrderList({ orders, onOpen, limit }: { orders: Order[]; onOpen: (id: string) => void; limit?: number }) {
  return (
    <ul className="divide-y divide-gold/25">
      {orders.slice(0, limit).map((o) => (
        <li key={o.id}>
          <button type="button" onClick={() => onOpen(o.id)} className="group flex w-full items-center gap-[18px] py-[16px] text-left max-lg:flex-wrap max-lg:gap-[10px]">
            <div className="flex -space-x-[14px]">
              {o.items.slice(0, 3).map((i) => <img key={i.slug + i.variant} src={`/images/${i.image}.webp`} alt="" className="size-[52px] rounded-full border-2 border-ivory object-cover" />)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-p6 tracking-[0.2em] text-gold-deep">{o.id}</p>
              <p className="mt-[3px] truncate font-serif text-h4 font-semibold">{o.items[0].name}{o.items.length > 1 && ` + ${o.items.length - 1} more`}</p>
              <p className="mt-[3px] text-p6 font-light text-placeholder">{formatDate(o.date)} · {itemCount(o)} item{itemCount(o) === 1 ? '' : 's'}</p>
            </div>
            <span className="text-p4 font-medium">{formatLKR(o.total)}</span>
            <Status status={o.status} />
            <Icon name="arrow-right" size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-[4px] max-lg:hidden" />
          </button>
        </li>
      ))}
    </ul>
  )
}

export function Orders() {
  const { orders } = useShop()
  const [params, setParams] = useSearchParams()
  const open = params.get('order')
  const order = orders.find((o) => o.id === open)
  if (order) return <OrderDetail order={order} placed={params.get('placed') === '1'} onBack={() => setParams({ tab: 'orders' })} />

  if (!orders.length) {
    return <EmptyState icon="box" title="No orders yet" body="Retail packs you buy online will show here with their delivery status. Bulk and export orders are handled through quotes." action={<Button to="/products" size="sm" className="w-[200px]">Browse Products</Button>} />
  }
  return (
    <div className={`${panel} ${panelPad}`} style={leafPanel}>
      <SectionTitle>My Orders</SectionTitle>
      <div className="mt-[8px]"><OrderList orders={orders} onOpen={(id) => setParams({ tab: 'orders', order: id })} /></div>
    </div>
  )
}

function Timeline({ order }: { order: Order }) {
  const at = orderSteps.indexOf(order.status)
  return (
    <ol className="flex items-start">
      {orderSteps.map((s, i) => {
        const done = i <= at
        return (
          <li key={s} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && <span className={`absolute top-[13px] right-1/2 h-[2px] w-full ${i <= at ? 'bg-gold' : 'bg-gold/25'}`} />}
            <span className={`relative grid size-[28px] place-items-center rounded-full border-2 text-p7 font-bold ${done ? 'border-gold bg-gold text-white' : 'border-gold/40 bg-ivory text-muted'} ${i === at ? 'ring-4 ring-gold/25' : ''}`}>{done ? '✓' : i + 1}</span>
            <span className={`mt-[8px] text-p6 max-lg:text-p8 ${done ? 'font-medium' : 'font-light text-muted'}`}>{s}</span>
          </li>
        )
      })}
    </ol>
  )
}

function OrderDetail({ order, placed, onBack }: { order: Order; placed: boolean; onBack: () => void }) {
  const delivery = pricing.delivery.find((d) => d.id === order.delivery)!
  return (
    <div className="grid gap-[22px]">
      {placed && (
        <div className="rounded-panel border-2 border-gold bg-cream px-[28px] py-[22px] max-lg:px-[18px]">
          <p className="font-serif text-h3 font-medium">Thank you, your order is placed.</p>
          <p className="mt-[6px] text-p4 font-light">We’ve sent a confirmation for <b className="font-medium">{order.id}</b>. We’ll let you know when it’s packed and on its way.</p>
          {order.payment.method === 'bank' && (
            <div className="mt-[16px] rounded-field bg-ivory px-[18px] py-[14px]">
              <p className="text-p6 tracking-[0.2em] text-gold-deep uppercase">Bank transfer details</p>
              <dl className="mt-[8px] grid grid-cols-[140px_1fr] gap-y-[4px] text-p5">
                {bankDetails.map(([k, v]) => <Fragment key={k}><dt className="font-light text-placeholder">{k}</dt><dd>{v}</dd></Fragment>)}
                <dt className="font-light text-placeholder">Reference</dt><dd className="font-medium">{order.id}</dd>
                <dt className="font-light text-placeholder">Amount</dt><dd className="font-medium">{formatLKR(order.total)}</dd>
              </dl>
            </div>
          )}
        </div>
      )}

      <div className={`${panel} ${panelPad}`} style={leafPanel}>
        <button type="button" onClick={onBack} className={`inline-flex items-center gap-[6px] text-p5 ${linkClass}`}><Icon name="arrow-right" size={14} className="rotate-180" />All orders</button>
        <div className="mt-[14px] flex flex-wrap items-end justify-between gap-[12px]">
          <div>
            <h2 className="font-serif text-h2 font-medium max-lg:text-h3">Order {order.id}</h2>
            <p className="mt-[4px] text-p5 font-light text-placeholder">Placed {formatDate(order.date)}</p>
          </div>
          <div className="flex items-center gap-[14px]">
            <Status status={order.status} />
            <button type="button" onClick={() => window.print()} className={`text-p5 ${linkClass}`}>Print receipt</button>
          </div>
        </div>
        <div className="mt-[28px]"><Timeline order={order} /></div>
      </div>

      <div className="grid grid-cols-[1fr_320px] items-start gap-[22px] max-lg:grid-cols-1">
        <div className={`${panel} ${panelPad}`} style={leafPanel}>
          <SectionTitle>Items</SectionTitle>
          <ul className="mt-[8px] divide-y divide-gold/25">
            {order.items.map((i) => (
              <li key={i.slug + i.variant} className="flex items-center gap-[14px] py-[14px]">
                <img src={`/images/${i.image}.webp`} alt="" className="size-[64px] rounded-field object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${i.slug}`} className="block truncate font-serif text-h4 font-semibold hover:text-gold-deep">{i.name}</Link>
                  <p className="mt-[3px] text-p6 font-light text-placeholder">{i.variant} · {i.qty} × {formatLKR(i.price)}</p>
                </div>
                <span className="text-p4 font-medium">{formatLKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-[6px] ml-auto grid max-w-[320px] grid-cols-[1fr_auto] gap-y-[6px] border-t border-gold/40 pt-[14px] text-p4">
            <dt className="font-light">Subtotal</dt><dd>{formatLKR(order.subtotal)}</dd>
            <dt className="font-light">Delivery</dt><dd>{order.shipping ? formatLKR(order.shipping) : 'Free'}</dd>
            <dt className="font-light">VAT</dt><dd>{formatLKR(order.tax)}</dd>
            <dt className="mt-[6px] font-serif text-h4 font-semibold">Total</dt><dd className="mt-[6px] font-serif text-h4 font-semibold">{formatLKR(order.total)}</dd>
          </dl>
        </div>

        <div className="grid gap-[22px]">
          <div className={`${panel} ${panelPad}`} style={leafPanel}>
            <p className="text-p6 tracking-[0.25em] text-gold-deep uppercase">Delivery</p>
            <p className="mt-[8px] font-serif text-h5 font-semibold">{delivery.label}</p>
            <p className="mb-[12px] text-p6 font-light text-placeholder">{delivery.note}</p>
            <AddressBlock a={order.address} />
          </div>
          <div className={`${panel} ${panelPad}`} style={leafPanel}>
            <p className="text-p6 tracking-[0.25em] text-gold-deep uppercase">Payment</p>
            <p className="mt-[8px] flex items-center gap-[8px] text-p4">
              <Icon name={order.payment.method === 'card' ? 'card' : 'documents'} size={18} className="text-gold" />
              {order.payment.method === 'card' ? `${order.payment.brand} •••• ${order.payment.last4}` : 'Bank transfer'}
            </p>
            <p className="mt-[16px] text-p5 font-light">Questions about this order? <Link to="/contact" className={linkClass}>Contact us</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
