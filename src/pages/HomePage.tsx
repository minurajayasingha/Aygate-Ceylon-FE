import { useEffect, useRef, useState } from 'react'
import { approachPoints, homeProducts, homeServices, originList, proofPoints, stats } from '../data/content'
import { BarDots, Button, Dots, Eyebrow, Icon, TypedHeading } from '../components/ui'
import { slide, useReveal } from '../hooks/useInView'
import { Hero } from '../components/sections/Hero'
import { ProductCard } from '../components/sections/ProductCard'
import { ServiceCard, ServiceCardMobile } from '../components/sections/ServiceCard'
import { JoinSection } from '../components/sections/JoinSection'
import { pageSeo, useSeo } from '../seo'

const pct = (v: number) => `${(v / 1440) * 100}%`

function StatRing({ icon, size }: { icon: string; size: number }) {
  return (
    <span className="mx-auto flex size-[67px] items-center justify-center rounded-full border border-gold text-gold">
      <Icon name={icon} size={size} />
    </span>
  )
}

// The hero intro (typing, then buttons) runs about this long; the stats strip waits for it when visible on load.
const AFTER_HERO = 2000

function StatsDesktop() {
  const layout = [
    { width: 108, before: 136 },
    { width: 212, before: 93 },
    { width: 235, before: 61 },
    { width: 176, before: 52 },
  ]
  const after = [58, 90, 99]
  const reveal = useReveal<HTMLElement>(0.25, AFTER_HERO)
  // Each stat rises part by part (ring, label, value, bar), one stat after another.
  const up = (i: number, part: number) => slide(i * 2 + part, 'up')
  return (
    <section ref={reveal.ref} {...reveal.attrs} className="hidden h-[254px] pt-[47px] lg:block">
      <div className="mx-auto flex max-w-[1440px]">
        {stats.map((s, i) => (
          <div key={s.label} className="contents">
            <div className="shrink-0 text-center" style={{ width: layout[i].width, marginLeft: pct(layout[i].before) }}>
              <div {...up(i, 0)}><StatRing icon={s.icon} size={s.iconSize} /></div>
              <p {...up(i, 1)} className="mt-[27px] text-p2 whitespace-nowrap text-gold">{s.label}</p>
              <p {...up(i, 2)} className="mt-[4px] font-serif text-stat font-medium whitespace-nowrap">{s.value}</p>
              <span {...up(i, 3)} className="mx-auto mt-[19px] block h-[3px] w-[63px] rounded-[1.5px] bg-gold" />
            </div>
            {i < 3 && <span {...up(i, 1)} className="h-[133px] w-[2px] shrink-0 bg-muted" style={{ ...up(i, 1).style, marginLeft: pct(after[i]) }} />}
          </div>
        ))}
      </div>
    </section>
  )
}

function StatsMobile() {
  const [active, setActive] = useState(0)
  const at = (offset: number) => stats[(active + offset + stats.length) % stats.length]
  const side = (offset: number, cls: string) => {
    const s = at(offset)
    return (
      <button type="button" aria-label={s.label} onClick={() => setActive((active + offset + stats.length) % stats.length)} className={`absolute top-[50px] w-[120px] text-center opacity-30 ${cls}`}>
        <span className="mx-auto flex size-[24px] items-center justify-center rounded-full border border-gold text-gold"><Icon name={s.icon} size={15} /></span>
        <p className="mt-[2px] text-p8 whitespace-nowrap text-gold">{s.label}</p>
        <p className="mt-[2px] font-serif text-[10px] leading-[10.1px] font-medium whitespace-nowrap">{s.value}</p>
      </button>
    )
  }
  const reveal = useReveal<HTMLElement>(0.25, AFTER_HERO)
  return (
    <section ref={reveal.ref} {...reveal.attrs} className="relative h-[165px] overflow-hidden lg:hidden">
      <div {...slide(1, 'up')}>{side(-1, 'left-[16px]')}</div>
      <div {...slide(0, 'up')} className="absolute inset-x-0 top-[25px] text-center">
        <StatRing icon={at(0).icon} size={at(0).iconSize} />
        <p className="mt-[8px] text-p6 whitespace-nowrap text-gold">{at(0).label}</p>
        <p className="font-serif text-[16px] leading-[16.2px] font-medium whitespace-nowrap">{at(0).value}</p>
        <BarDots active={(active + 2) % 4} className="mt-[13px] justify-center" />
      </div>
      <div {...slide(2, 'up')}>{side(2, 'right-[12px]')}</div>
    </section>
  )
}

const AUTOPLAY = 3500
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Desktop product row: four cards in view, advancing one card at a time so the next one slides in from the right.
 * The list is rendered twice; after sliding onto the copy of the first card it snaps back without a transition, so it loops forever.
 */
function ProductCarouselDesktop({ start }: { start: boolean }) {
  const n = homeProducts.length
  const [index, setIndex] = useState(0)
  const [smooth, setSmooth] = useState(true)
  const [paused, setPaused] = useState(false)

  const go = (i: number) => {
    setSmooth(true)
    setIndex(i)
  }

  useEffect(() => {
    if (!start || paused || prefersReducedMotion()) return
    const id = setTimeout(() => go(index + 1), AUTOPLAY)
    return () => clearTimeout(id)
  }, [start, paused, index])

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || index < n) return
    setSmooth(false)
    setIndex(index - n)
  }

  return (
    <>
      {/* Padding gives hover shadows room; the 19px gap keeps the next card out of it. */}
      <div className="mt-[30px] hidden max-w-[1325px] overflow-hidden px-[10px] py-[10px] -mx-[9px] lg:block" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div
          onTransitionEnd={onTransitionEnd}
          className={`flex gap-[19px] ${smooth ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]' : ''}`}
          style={{ transform: `translateX(calc(${-index} * ((100% - 57px) / 4 + 19px)))` }}
        >
          {[...homeProducts, ...homeProducts].map((p, k) => (
            <div key={`${p.image}-${k}`} inert={k < index || k >= index + 4} {...slide(1 + Math.min(k, 4), 'right', 'card')} className="grid w-[calc((100%-57px)/4)] shrink-0">
              <ProductCard product={p} tags="forms" />
            </div>
          ))}
        </div>
      </div>
      <div {...slide(5, 'right', 'card')} className="mt-[25px] hidden justify-center lg:flex"><Dots count={n} active={index % n} onSelect={go} /></div>
    </>
  )
}

// Figma opens the mobile carousel on the cinnamon card with a card on each side.
const slides = [homeProducts[1], homeProducts[0], homeProducts[2], homeProducts[3]]

function ProductCarouselMobile() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (el) el.scrollLeft = (el.children[1] as HTMLElement).offsetLeft - (el.clientWidth - 312) / 2
  }, [])

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    ;[...el.children].forEach((c, i) => {
      const box = c as HTMLElement
      const bestBox = el.children[best] as HTMLElement
      if (Math.abs(box.offsetLeft + box.offsetWidth / 2 - center) < Math.abs(bestBox.offsetLeft + bestBox.offsetWidth / 2 - center)) best = i
    })
    setActive(best)
  }

  return (
    <>
      <div ref={ref} onScroll={onScroll} className="no-scrollbar mt-[17px] flex snap-x snap-mandatory overflow-x-auto scroll-auto px-[calc(50%-156px)] pb-2">
        {slides.map((p, i) => (
          <div key={p.image} className={`w-[312px] shrink-0 snap-center px-[0px] transition-opacity ${i === active ? 'opacity-100' : 'opacity-20'}`}>
            <ProductCard product={p} tags="forms" />
          </div>
        ))}
      </div>
      <BarDots active={(active + 1) % 4} className="mt-[17px] justify-center" />
    </>
  )
}

export function HomePage() {
  useSeo(pageSeo('/'))
  const approach = useReveal<HTMLElement>()
  const families = useReveal<HTMLElement>()
  const proof = useReveal<HTMLElement>()
  const services = useReveal<HTMLElement>()
  return (
    <>
      <Hero
        image="hero-home"
        eyebrow="PURE FLAVOUR. REAL ORIGINS."
        eyebrowSize="lg"
        titleSize="h1"
        title={<>Authentic <br className="lg:hidden" />Sri Lankan Cinnamon, Pepper & Tea for Global Buyers</>}
        body="Aygate Ceylon sources and supplies selected Sri Lankan spices and teas for international buyers, with practical support for product specifications, packing and export requirements."
        titleWidth={648}
        bodyWidth={476}
        desktop={{ height: 740, eyebrow: [64, 243], title: [64, 254], body: [64, 433], actions: [69, 527] }}
        mobile={{ height: 629, eyebrow: [20, 173], title: [20, 195], body: [-999, 0], actions: [20, 513] }}
        actions={
          <>
            <Button to="/contact" className="max-lg:!h-[46px] max-lg:!text-[12px] max-lg:!px-[15px]">Request a Quote</Button>
            <Button to="/products" variant="outline-light" arrow={false} className="w-[144px] max-lg:!h-[44px] max-lg:w-[104px] max-lg:!text-[12px] max-lg:!px-[15px]">See Products</Button>
          </>
        }
      />
      <StatsDesktop />
      <StatsMobile />

      {/* The Aygate approach */}
      <section ref={approach.ref} {...approach.attrs} className="relative overflow-hidden lg:h-[661px]">
        <img src="/images/bg-leaf-home.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-665.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto flex max-w-[1440px] max-lg:h-[665px] max-lg:flex-col">
          <img {...slide(0, 'left', 'media')} src="/images/landscape.webp" alt="Misty hills and tea fields in Sri Lanka" loading="lazy" className="-ml-[14px] h-[660px] w-[calc(55.76%+14px)] shrink-0 object-cover max-lg:-ml-[8px] max-lg:h-[418px] max-lg:w-[calc(100%+64px)] max-lg:max-w-none min-[1441px]:ml-[calc(720px-50vw-14px)] min-[1441px]:w-[calc(50vw-720px+817px)] min-[1441px]:max-w-none" />
          <div className="relative pt-[62px] pl-[38px] max-lg:pt-[22px] max-lg:pl-[18px]">
            <div {...slide(1, 'right')}><Eyebrow size="md" mobileSize="md" className="text-gold-deep max-lg:text-gold-muted">THE AYGATE APPROACH</Eyebrow></div>
            <h2 {...slide(1, 'right')} className="mt-[5px] -ml-1 w-[425px] font-serif text-h2 font-medium max-lg:ml-0 max-lg:w-[362px] max-lg:max-w-[calc(100vw-36px)] max-lg:text-h3 max-lg:leading-[34.9px]">A Sri Lankan sourcing partner built by two friends.</h2>
            <p {...slide(3, 'right')} className="mt-[19px] -ml-1 w-[476px] text-p4 font-light max-lg:mt-[15px] max-lg:ml-0 max-lg:w-[350px] max-lg:max-w-[calc(100vw-36px)] max-lg:text-p8">We connect selected Sri Lankan agricultural products with the practical requirements of importers, distributors, manufacturers and brands.</p>
            <ul className="mt-[19px] space-y-[17px] max-lg:hidden">
              {approachPoints.map((p, i) => (
                <li key={p.title} {...slide(5 + i, 'right')}>
                  <p className="font-serif text-h5 font-medium">{p.title}</p>
                  <p className="text-[14px] leading-[14.1px] font-extralight">{p.text}</p>
                </li>
              ))}
            </ul>
            <div {...slide(9, 'right')} className="mt-[74px] w-fit max-lg:absolute max-lg:top-[174px] max-lg:left-[129px] max-lg:mt-0">
              <Button to="/about" className="w-[182px] max-lg:!h-[46px] max-lg:w-[144px] max-lg:!text-[12px]">Read Our Story</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product families */}
      <section ref={families.ref} {...families.attrs} className="overflow-hidden pt-[50px] pb-[38px] max-lg:h-[672px] max-lg:pt-[62px] max-lg:pb-0">
        <div className="mx-auto max-w-[1440px] px-[64px] max-lg:px-0">
          <div className="max-lg:px-[18px]">
            <div {...slide(0)}><Eyebrow size="md" mobileSize="md" className="text-gold max-lg:text-gold-muted">Core Products</Eyebrow></div>
            <TypedHeading running={families.inView} className="mt-[11px] font-serif text-h2 font-medium max-lg:mt-[3px] max-lg:text-h3">Product Families</TypedHeading>
          </div>
          <ProductCarouselDesktop start={families.inView} />
          <div {...slide(1, 'right', 'card')} className="lg:hidden"><ProductCarouselMobile /></div>
        </div>
      </section>

      {/* Origin and quality proof */}
      <section ref={proof.ref} {...proof.attrs} className="relative overflow-hidden text-white lg:h-[664px]">
        <img src="/images/bg-origin.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-origin-m.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto max-w-[1440px] max-lg:h-[706px] lg:h-full">
          <div {...slide(0)} className="absolute top-[61px] left-[64px] h-[520px] w-[690px] rounded-card border border-white/15 bg-glass pt-[87px] pr-[25px] text-center backdrop-blur-[7px] max-lg:top-[32px] max-lg:left-[18px] max-lg:h-[291px] max-lg:w-[calc(100%-34px)] max-lg:px-[11px] max-lg:pt-[24px]">
            <Eyebrow size="md" mobileSize="md" className="text-gold max-lg:text-[#b99461]">WHY SRI LANKA</Eyebrow>
            <h2 className="font-serif text-h2 font-medium max-lg:mx-auto max-lg:-mt-[3px] max-lg:w-[343px] max-lg:max-w-full max-lg:text-h3">Origin is part of the product.</h2>
            <p className="mx-auto mt-[35px] w-[371px] text-p3 font-light max-lg:mt-[12px] max-lg:w-[298px] max-lg:max-w-full max-lg:text-p6">Sri Lanka has a long agricultural and trading tradition, with globally recognized products including Ceylon cinnamon and Ceylon tea. Aygate's role is to connect that origin with buyer requirements through careful sourcing, product selection and export coordination.</p>
            <ul className="mt-[21px] list-inside list-disc space-y-[10px] text-p3 font-light marker:text-[10px] max-lg:hidden">
              {originList.map((o) => <li key={o}>{o}</li>)}
            </ul>
            <Button to="/contact" className="mt-[40px] w-[193px] max-lg:mt-[25px] max-lg:!h-[46px] max-lg:w-[152px] max-lg:!text-[12px]">Request a Quote</Button>
          </div>
          <div {...slide(1)} className="absolute top-[93px] left-[882px] max-lg:hidden"><Eyebrow size="md">QUALITY PROOF</Eyebrow></div>
          <TypedHeading running={proof.inView} className="absolute top-[112px] left-[874px] w-[424px] text-center font-serif text-h2 font-bold max-lg:top-[361px] max-lg:left-[29px] max-lg:w-[343px] max-lg:max-w-[calc(100%-58px)] max-lg:text-h3">Quality You Can Ask<br />Us to Prove</TypedHeading>
          <ul className="absolute top-[224px] left-[769px] w-[604px] space-y-[15px] max-lg:top-[444px] max-lg:left-[18px] max-lg:w-[calc(100%-34px)] max-lg:space-y-[10px]">
            {proofPoints.map((p, i) => (
              <li key={p.title} {...slide(2 + i, 'right', 'card')} className="relative h-[106px] rounded-card border border-white/15 bg-glass max-lg:h-[65px] max-lg:rounded-panel">
                <span className="absolute top-1/2 left-[82px] -translate-x-1/2 -translate-y-1/2 max-lg:left-[50px]"><Icon name={p.icon} size={p.size} className="max-lg:!size-[30px]" /></span>
                <h3 className="absolute top-[23px] left-[161px] font-serif text-h3 font-medium whitespace-nowrap max-lg:top-[14px] max-lg:left-[86px] max-lg:text-h4">{p.title}</h3>
                <p className="absolute top-[61px] left-[161px] text-p3 font-light whitespace-nowrap max-lg:top-[38px] max-lg:left-[86px] max-lg:text-p8">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section ref={services.ref} {...services.attrs} className="bg-ivory lg:h-[661px]">
        <div className="mx-auto max-w-[1440px] px-[64px] pt-[69px] max-lg:px-[61px] max-lg:pt-[55px] max-lg:pb-[66px]">
          <div {...slide(0)}><Eyebrow size="md" mobileSize="md">EXPORT SUPPORT</Eyebrow></div>
          <TypedHeading running={services.inView} className="mt-[11px] font-serif text-h2 font-medium max-lg:mt-[3px] max-lg:text-h3">More Than <br className="lg:hidden" />a Product Supplier</TypedHeading>
          <p {...slide(1)} className="mt-[9px] text-p5 font-light max-lg:hidden">Supply, sourcing, packing and export coordination built around the buyer's requirements.</p>
          <div className="mt-[60px] hidden max-w-[1311px] grid-cols-3 gap-[21px] lg:grid">
            {homeServices.map((s, i) => <div key={s.title} {...slide(2 + i, 'right', 'card')} className="grid"><ServiceCard service={s} /></div>)}
          </div>
          <div className="mt-[25px] space-y-[10px] max-lg:-ml-[10px] lg:hidden">
            {homeServices.map((s, i) => <div key={s.title} {...slide(1 + i, 'right', 'card')}><ServiceCardMobile service={s} /></div>)}
          </div>
        </div>
      </section>

      <JoinSection />
    </>
  )
}
