import { useMemo, useState } from 'react'
import { catalogue, productFilters, type Product } from '../data/content'
import { BarDots, FilterChip, Icon, SlideIn, TypedHeading } from '../components/ui'
import { Hero } from '../components/sections/Hero'
import { ProductCard, ProductCardCompact } from '../components/sections/ProductCard'
import { JoinSection } from '../components/sections/JoinSection'

const chipWidths = ['w-[181px]', 'w-[170px]', 'w-[147px]', 'w-[177px]', 'w-[177px]']
const chipGaps = [13, 13, 26, 26, 38]

type Group = { desktop: Product[]; mobile: Product[] }

function ProductGroup({ title, products, topClass }: { title: string; products: Group; topClass: string }) {
  if (!products.desktop.length && !products.mobile.length) return null
  return (
    <section className={topClass}>
      <TypedHeading className={`ml-[5px] font-serif text-h2 font-medium max-lg:ml-0 max-lg:text-h3 ${products.desktop.length ? '' : 'lg:hidden'} ${products.mobile.length ? '' : 'max-lg:hidden'}`}>{title}</TypedHeading>
      <div className="mt-[11px] ml-[2px] hidden max-w-[1305px] grid-cols-4 gap-[19px] lg:grid">
        {products.desktop.map((p, i) => <SlideIn key={i} i={1 + i} kind="card" className="grid"><ProductCard product={p} tags="qualities" /></SlideIn>)}
      </div>
      <div className="mt-[17px] grid grid-cols-[repeat(2,181px)] gap-x-[6px] gap-y-[6px] lg:hidden">
        {products.mobile.map((p, i) => <SlideIn key={i} i={i} kind="card" className="grid"><ProductCardCompact product={p} /></SlideIn>)}
      </div>
    </section>
  )
}

export function ProductsPage() {
  const [filter, setFilter] = useState(0)
  const [search, setSearch] = useState('')
  const label = productFilters[filter]

  const match = (products: Group, group: string): Group => {
    const shown = label === group || !['Cinnamon', 'Pepper'].includes(label)
    const keep = (list: Product[]) => (shown ? list.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())) : [])
    return { desktop: keep(products.desktop), mobile: keep(products.mobile) }
  }

  const cinnamon = useMemo(() => match(catalogue.cinnamon, 'Cinnamon'), [label, search])
  const pepper = useMemo(() => match(catalogue.pepper, 'Pepper'), [label, search])

  return (
    <>
      <Hero
        image="hero-products"
        eyebrow="OUR PRODUCT COLLECTION"
        eyebrowSize="lg"
        titleSize="h1"
        title={<>Authentic Ceylon<br />Exceptional Quality.</>}
        titleWidth={682}
        bodyWidth={476}
        desktop={{ height: 481, eyebrow: [69, 241], title: [59, 270] }}
        mobile={{ height: 495, eyebrow: [20, 175], title: [20, 197] }}
      />

      <section className="relative h-[200px] shadow-soft max-lg:h-[116px]">
        <img src="/images/bg-leaf-filter.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-filter.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto flex max-w-[1440px] items-start px-[64px] pt-[71px] max-lg:hidden">
          <SlideIn className="shrink-0">
          <label className="flex h-[55px] w-[340px] items-center rounded-chip border border-gold pl-[46px] text-gold">
            <Icon name="search" size={16} className="mr-[14px]" />
            <span className="sr-only">Search products</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full bg-transparent text-[16px] leading-[19px] outline-none placeholder:text-gold" />
          </label>
          </SlideIn>
          {productFilters.map((f, i) => (
            <SlideIn key={i} from="right" i={1 + i} className="shrink-0" style={{ marginLeft: chipGaps[i] }}>
              <FilterChip active={filter === i} onClick={() => setFilter(i)} className={`${chipWidths[i]} ${i === 0 ? 'h-[53px]' : 'h-[55px]'}`}>{f}</FilterChip>
            </SlideIn>
          ))}
        </div>
        <div className="no-scrollbar relative -ml-[7px] flex gap-[6px] overflow-x-auto pt-[24px] pl-0 lg:hidden">
          {productFilters.map((f, i) => (
            <FilterChip key={i} active={filter === i} onClick={() => setFilter(i)} className={`${i === 0 ? 'h-[49px]' : 'h-[51px]'}`}>{f}</FilterChip>
          ))}
        </div>
        <BarDots active={2} className="absolute top-[92px] left-1/2 -translate-x-1/2 lg:hidden" />
      </section>

      <div className="mx-auto max-w-[1440px] px-[62px] pt-[45px] pb-[13px] max-lg:px-[18px] max-lg:pt-[11px] max-lg:pb-[53px]">
        <ProductGroup title="Cinnamon Products" products={cinnamon} topClass="" />
        <ProductGroup title="Pepper Products" products={pepper} topClass="mt-[20px] max-lg:mt-[33px] [&>div]:lg:!mt-[20px]" />
      </div>

      <JoinSection wide />
    </>
  )
}
