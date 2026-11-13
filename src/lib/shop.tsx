import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { findProduct, totals, variantPrice, type DeliveryId } from '../data/shop'
import { useAuth } from './auth'

/**
 * Cart, saved products, orders, addresses and saved cards for the UI prototype.
 * Everything is kept in this browser's localStorage until the backend and payment gateway exist:
 * cart and saved products work for guests; orders, addresses and cards belong to the signed-in account.
 * Card numbers are never stored, only brand, last four digits and expiry, the same as a real gateway token.
 */

export type CartLine = { slug: string; variant: string; qty: number }

export type Address = {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  postcode: string
  country: string
  isDefault: boolean
}

export type SavedCard = { id: string; brand: string; last4: string; expiry: string; name: string; isDefault: boolean }

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'
export const orderSteps: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered']

export type OrderItem = { slug: string; name: string; image: string; variant: string; price: number; qty: number }
export type Payment = { method: 'card'; brand: string; last4: string } | { method: 'bank' }
export type Order = {
  id: string
  date: string
  items: OrderItem[]
  delivery: DeliveryId
  address: Address
  payment: Payment
  status: OrderStatus
  subtotal: number
  shipping: number
  tax: number
  total: number
}

type AccountData = { orders: Order[]; addresses: Address[]; cards: SavedCard[] }

export type DrawerTab = 'cart' | 'saved'

type Shop = {
  cart: CartLine[]
  cartCount: number
  subtotal: number
  addToCart: (slug: string, variant: string, qty?: number) => void
  setQty: (slug: string, variant: string, qty: number) => void
  removeFromCart: (slug: string, variant: string) => void
  clearCart: () => void

  saved: string[]
  isSaved: (slug: string) => boolean
  toggleSaved: (slug: string) => void

  orders: Order[]
  addresses: Address[]
  cards: SavedCard[]
  saveAddress: (a: Omit<Address, 'id'> & { id?: string }) => Address
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  saveCard: (c: Omit<SavedCard, 'id' | 'isDefault'> & { isDefault?: boolean }) => SavedCard
  removeCard: (id: string) => void
  setDefaultCard: (id: string) => void
  placeOrder: (o: { delivery: DeliveryId; address: Address; payment: Payment }) => Order

  drawer: DrawerTab | null
  openDrawer: (tab: DrawerTab) => void
  closeDrawer: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const read = <T,>(key: string | null, fallback: T): T => {
  if (!key) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
const write = (key: string | null, value: unknown) => {
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage blocked: keep it in memory for this visit.
  }
}

/** useState that persists under `key`, and reloads when the key changes (another account signs in). */
function useStored<T>(key: string | null, fallback: T) {
  const [state, setState] = useState(() => ({ key, value: read(key, fallback) }))
  let current = state
  if (state.key !== key) {
    current = { key, value: read(key, fallback) }
    setState(current)
  }
  const set = useCallback((update: (prev: T) => T) => {
    setState((s) => {
      const value = update(s.value)
      write(s.key, value)
      return { key: s.key, value }
    })
  }, [])
  return [current.value, set] as const
}

const NO_LINES: CartLine[] = []
const NO_SLUGS: string[] = []
const EMPTY: AccountData = { orders: [], addresses: [], cards: [] }

const uid = () => Math.random().toString(36).slice(2, 10)
const orderId = () => `AYG-${Math.floor(20000 + Math.random() * 79999)}`

const ShopContext = createContext<Shop | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useStored('aygate.cart', NO_LINES)
  const [saved, setSaved] = useStored('aygate.saved', NO_SLUGS)
  const [data, setData] = useStored(user ? `aygate.data.${user.email.toLowerCase()}` : null, EMPTY)
  const [drawer, setDrawer] = useState<DrawerTab | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  // Drop lines whose product no longer exists in the catalogue.
  const lines = useMemo(() => cart.filter((l) => findProduct(l.slug)), [cart])
  const cartCount = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + variantPrice(findProduct(l.slug)!, l.variant) * l.qty, 0)

  const same = (l: CartLine, slug: string, variant: string) => l.slug === slug && l.variant === variant

  const addToCart = useCallback((slug: string, variant: string, qty = 1) => {
    setCart((c) => (c.some((l) => same(l, slug, variant)) ? c.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(99, l.qty + qty) } : l)) : [...c, { slug, variant, qty }]))
  }, [setCart])
  const setQty = useCallback((slug: string, variant: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => !same(l, slug, variant)) : c.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(99, qty) } : l))))
  }, [setCart])
  const removeFromCart = useCallback((slug: string, variant: string) => setCart((c) => c.filter((l) => !same(l, slug, variant))), [setCart])
  const clearCart = useCallback(() => setCart(() => []), [setCart])

  const toggleSaved = useCallback((slug: string) => setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [slug, ...s])), [setSaved])

  const saveAddress = useCallback((a: Omit<Address, 'id'> & { id?: string }) => {
    const address: Address = { ...a, id: a.id ?? uid() }
    setData((d) => {
      const others = d.addresses.filter((x) => x.id !== address.id)
      const isDefault = address.isDefault || others.length === 0
      const list = others.map((x) => (isDefault ? { ...x, isDefault: false } : x))
      const existing = d.addresses.findIndex((x) => x.id === address.id)
      const next = { ...address, isDefault }
      if (existing >= 0) list.splice(existing, 0, next)
      else list.push(next)
      return { ...d, addresses: list }
    })
    return address
  }, [setData])
  const removeAddress = useCallback((id: string) => setData((d) => {
    const list = d.addresses.filter((a) => a.id !== id)
    if (list.length && !list.some((a) => a.isDefault)) list[0] = { ...list[0], isDefault: true }
    return { ...d, addresses: list }
  }), [setData])
  const setDefaultAddress = useCallback((id: string) => setData((d) => ({ ...d, addresses: d.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })), [setData])

  const saveCard = useCallback((c: Omit<SavedCard, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
    const card: SavedCard = { ...c, id: uid(), isDefault: !!c.isDefault }
    setData((d) => {
      const isDefault = card.isDefault || d.cards.length === 0
      return { ...d, cards: [...d.cards.map((x) => (isDefault ? { ...x, isDefault: false } : x)), { ...card, isDefault }] }
    })
    return card
  }, [setData])
  const removeCard = useCallback((id: string) => setData((d) => {
    const list = d.cards.filter((c) => c.id !== id)
    if (list.length && !list.some((c) => c.isDefault)) list[0] = { ...list[0], isDefault: true }
    return { ...d, cards: list }
  }), [setData])
  const setDefaultCard = useCallback((id: string) => setData((d) => ({ ...d, cards: d.cards.map((c) => ({ ...c, isDefault: c.id === id })) })), [setData])

  const placeOrder = useCallback(({ delivery, address, payment }: { delivery: DeliveryId; address: Address; payment: Payment }) => {
    const items: OrderItem[] = lines.map((l) => {
      const p = findProduct(l.slug)!
      return { slug: p.slug, name: p.name, image: p.image, variant: l.variant, price: variantPrice(p, l.variant), qty: l.qty }
    })
    const order: Order = { id: orderId(), date: new Date().toISOString(), items, delivery, address, payment, status: 'Placed', ...totals(subtotal, delivery) }
    setData((d) => ({ ...d, orders: [order, ...d.orders] }))
    setCart(() => [])
    return order
  }, [lines, subtotal, setData, setCart])

  const closeDrawer = useCallback(() => setDrawer(null), [])

  const value: Shop = {
    cart: lines, cartCount, subtotal, addToCart, setQty, removeFromCart, clearCart,
    saved, isSaved: (slug) => saved.includes(slug), toggleSaved,
    orders: data.orders, addresses: data.addresses, cards: data.cards,
    saveAddress, removeAddress, setDefaultAddress, saveCard, removeCard, setDefaultCard, placeOrder,
    drawer, openDrawer: setDrawer, closeDrawer, searchOpen, setSearchOpen,
  }
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const shop = useContext(ShopContext)
  if (!shop) throw new Error('useShop must be used inside <ShopProvider>')
  return shop
}
