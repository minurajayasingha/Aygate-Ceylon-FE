import { useState } from 'react'
import { cinnamonProducts, detailBody, productTable, qualityVariants, whyChoose } from '../data/content'
import { Button, Eyebrow, Icon, OptionChip, SlideIn, TypedHeading } from '../components/ui'
import { ProductCard, ProductCardCompact } from '../components/sections/ProductCard'
import { QuoteModal } from '../components/sections/QuoteModal'

const productName = 'Ceylon Cinnamon Quills'
const summary = 'Premium Ceylon cinnamon sourced from Sri Lanka, available in different forms and grades to meet global market requirements.'

function DetailHeading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-[7px] font-serif text-h3 font-medium">
      {children}
      <Icon name="info" size={33} className="-my-[10px] -ml-[10px] mt-[-4px]" />
    </h2>
  )
}

function SpecTable() {
  return (
    <table className="w-[584px] table-fixed border-collapse border border-gold max-lg:ml-[7px] max-lg:w-[355px] max-lg:max-w-[calc(100vw-50px)]">
      <thead>
        <tr className="h-[42px] max-lg:h-[25px]">
          {['Form', 'Description', 'Typical Use'].map((h, i) => (
            <th key={h} scope="col" className={`border border-gold text-p3 font-normal max-lg:text-p8 ${i === 0 ? 'w-[192px] max-lg:w-[117px]' : i === 1 ? 'w-[200px] max-lg:w-[122px]' : ''}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {productTable.map((row) => (
          <tr key={row[0]} className="h-[40px] max-lg:h-[25px]">
            {row.map((cell) => <td key={cell} className="border border-gold text-center text-p7 max-lg:text-p9">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function WhyChoose() {
  return (
    <aside className="rounded-panel border-2 border-gold max-lg:h-[259px] max-lg:pt-[18px] max-lg:pl-[26px] lg:ml-[-3px] lg:h-[338px] lg:w-[653px] lg:pt-[34px] lg:pl-[64px]">
      <h2 className="font-serif text-h3 font-medium max-lg:text-gold-deep">Why choose <br className="lg:hidden" />our cinnamon quills?</h2>
      <ul className="mt-[26px] ml-[21px] text-[20px] leading-[35px] max-lg:mt-[20px] max-lg:ml-0 max-lg:text-[12px] max-lg:leading-[21px]">
        {whyChoose.map((w) => <li key={w}><b>✓</b> {w}</li>)}
      </ul>
    </aside>
  )
}

export function ProductDetailPage() {
  const [modal, setModal] = useState(false)
  const [thumb, setThumb] = useState(0)
  const [variant, setVariant] = useState(0)
  const open = () => setModal(true)
  const buttonSm = 'max-lg:!h-[46px] max-lg:!text-[12px]'

  return (
    <>
      <section className="mx-auto max-w-[1440px] max-lg:pt-[101px]">
        {/* Desktop keeps copy and gallery side by side; mobile stacks title, image, then details. */}
        <div className="relative lg:h-[1463px]">
          <div className="absolute top-[240px] left-[64px] max-lg:static max-lg:px-[18px]">
            <SlideIn><Eyebrow className="text-gold-deep">Cinnamon COLLECTION</Eyebrow></SlideIn>
            <TypedHeading as="h1" className="-mt-[0px] -ml-[2px] font-serif text-h1 font-normal whitespace-nowrap max-lg:mt-[7px] max-lg:w-[349px] max-lg:max-w-full max-lg:text-h2-m max-lg:whitespace-normal">{productName}</TypedHeading>
          </div>

          <SlideIn from="right" kind="media" className="lg:absolute lg:top-[243px] lg:left-[723px] lg:w-[650px]">
            <img src="/images/product-detail.webp" alt="Ceylon cinnamon quills tied with twine" className="h-[657px] w-full rounded-panel object-cover max-lg:mt-[21px] max-lg:h-[418px] max-lg:rounded-none" style={thumb ? { objectPosition: `${thumb * 50}% 50%` } : undefined} />
            <div className="mt-[9px] flex gap-[14px] max-lg:hidden">
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" aria-label={`Show image ${i + 1}`} onClick={() => setThumb(i)} className="overflow-hidden rounded-panel">
                  <img src="/images/product-detail.webp" alt="" className="h-[139px] w-[138px] object-cover" />
                </button>
              ))}
            </div>
          </SlideIn>

          <div className="absolute top-[332px] left-[64px] w-[540px] max-lg:static max-lg:w-auto max-lg:px-[18px]">
            <SlideIn i={2}>
            <p className="w-[476px] max-w-full text-p4 max-lg:hidden">{summary}</p>
            <div className="mt-[44px] max-lg:mt-[19px]"><DetailHeading>Price</DetailHeading></div>
            <div className="mt-[16px] flex items-end gap-[12px] max-lg:mt-[19px] max-lg:gap-[14px]">
              <p className="mb-[5px] text-p4 max-lg:mb-[4px] max-lg:text-p6">Select Quality Variants</p>
              <div role="group" aria-label="Quality variant" className="flex items-end gap-[10px]">
                {qualityVariants.map((v, i) => <OptionChip key={i} active={variant === i} onClick={() => setVariant(i)} className={i === 3 ? 'ml-[3px]' : ''}>{v}</OptionChip>)}
              </div>
            </div>
            <p className="mt-[20px] text-[32px] leading-[32.3px] tracking-[0.04em] lg:-ml-[2px] max-lg:mt-[30px] max-lg:text-[20px] max-lg:leading-[20.2px]">1500 LKR +Tax</p>
            <p className="mt-[9px] w-[476px] max-w-full text-p4 max-lg:mt-[12px] max-lg:text-p6">{summary}</p>
            <div className="mt-[25px] flex gap-[19px] max-lg:mt-[20px] max-lg:gap-[17px]">
              <Button onClick={open} className={`w-[149px] ${buttonSm}`}>Buy Now</Button>
              <Button variant="outline" arrow={false} className={`w-[139px] ${buttonSm} max-lg:!border-gold max-lg:!pl-[36px] max-lg:!text-gold`}><span className="max-lg:hidden">Add to Cart</span><span className="lg:hidden">Add To Cart</span></Button>
            </div>
            </SlideIn>
            <SlideIn>
            <div className="mt-[44px] max-lg:mt-[30px]"><DetailHeading>Details</DetailHeading></div>
            <p className="mt-[19px] w-[490px] max-w-full text-p4 max-lg:mt-[14px] max-lg:w-[356px] max-lg:text-p6">{detailBody}</p>
            {/* Figma removed the table from desktop on Nov 5 but kept it on mobile. */}
            <div className="mt-[19px] lg:hidden"><SpecTable /></div>
            </SlideIn>
            <SlideIn>
            <div className="mt-[44px] max-lg:mt-[33px]"><DetailHeading>Bulk & Private labels</DetailHeading></div>
            <p className="mt-[27px] w-[490px] max-w-full text-p4 max-lg:mt-[14px] max-lg:w-[356px] max-lg:text-p6">{detailBody}</p>
            <Button onClick={open} className={`mt-[27px] w-[168px] max-lg:mt-[18px] max-lg:w-[162px] ${buttonSm}`}>Contact Us</Button>
            </SlideIn>
            <SlideIn>
            <div className="mt-[44px] max-lg:mt-[33px]"><DetailHeading>Delivery & Shipping</DetailHeading></div>
            <p className="mt-[25px] w-[490px] max-w-full text-p4 max-lg:mt-[14px] max-lg:w-[356px] max-lg:text-p6">{detailBody}</p>
            </SlideIn>
          </div>

          <SlideIn from="right" className="lg:absolute lg:top-[1087px] lg:left-[723px] max-lg:mx-[18px] max-lg:mt-[38px]"><WhyChoose /></SlideIn>
        </div>
      </section>

      <section className="relative overflow-hidden shadow-soft lg:h-[660px] max-lg:mt-[18px] max-lg:h-[621px]">
        <img src="/images/bg-leaf-660.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-621.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto max-w-[1440px] px-[64px] pt-[43px] max-lg:px-[18px] max-lg:pt-[28px]">
          <SlideIn><Eyebrow className="text-gold-deep">NEW PRODUCTS</Eyebrow></SlideIn>
          <TypedHeading className="mt-[5px] -ml-[2px] font-serif text-h2 font-medium max-lg:ml-0 max-lg:text-h3">Other Products</TypedHeading>
          <div className="mt-[46px] hidden max-w-[1305px] grid-cols-4 gap-[19px] lg:grid">
            {cinnamonProducts.map((p, i) => <SlideIn key={i} from="right" i={1 + i} kind="card" className="grid"><ProductCard product={p} /></SlideIn>)}
          </div>
          <div className="mt-[11px] grid grid-cols-[repeat(2,181px)] gap-x-[6px] gap-y-[6px] lg:hidden">
            {cinnamonProducts.map((p, i) => <SlideIn key={i} from="right" i={i % 2} kind="card" className="grid"><ProductCardCompact product={{ ...p, name: 'Cinnamon' }} /></SlideIn>)}
          </div>
        </div>
      </section>

      <section className="pt-[69px] pb-[92px] text-center max-lg:px-[18px] max-lg:pt-[40px] max-lg:pb-[41px] max-lg:text-left">
        <SlideIn from="up"><Eyebrow className="text-gold-deep">GET DETAILED INFORMATION</Eyebrow></SlideIn>
        <TypedHeading className="mt-[9px] font-serif text-h2 font-medium max-lg:mt-[7px] max-lg:text-h3">Request <br className="lg:hidden" />Cinnamon Specifications</TypedHeading>
        <SlideIn from="up" i={2}><p className="mx-auto mt-[10px] w-[476px] max-w-full text-p4 max-lg:mx-0 max-lg:mt-[9px] max-lg:text-p8">Share your required grade, form, quantity and packaging. We will provide product specifications and sample options.</p></SlideIn>
        <SlideIn from="up" i={4}><Button onClick={open} className="mt-[54px] w-[202px] max-lg:mt-[26px] max-lg:!h-[46px] max-lg:w-[179px] max-lg:!text-[12px]">Request a Sample</Button></SlideIn>
      </section>

      {modal && <QuoteModal title={`${productName} ${qualityVariants[variant]}`} image="product-detail" onClose={() => setModal(false)} />}
    </>
  )
}
