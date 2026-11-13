import { qualitySteps, testingList, traceServices } from '../data/content'
import { Button, Eyebrow, Icon, SlideIn, TypedHeading } from '../components/ui'
import { Hero } from '../components/sections/Hero'
import { ServiceCard, ServiceCardMobile } from '../components/sections/ServiceCard'
import { pageSeo, useSeo } from '../seo'

export function QualityPage() {
  useSeo(pageSeo('/quality'))
  return (
    <>
      <Hero
        image="hero-quality"
        eyebrow="TRUST & DOCUMENTATION"
        title="Quality, Documentation & Traceability"
        body="For international buyers, product quality is only part of the equation. Documentation, consistency and traceability matter too."
        titleWidth={984}
        bodyWidth={542}
        desktop={{ height: 481, eyebrow: [67, 243], title: [59, 270], body: [64, 352] }}
        mobile={{ height: 495, eyebrow: [20, 184], title: [20, 209], body: [18, 366] }}
      />

      <section className="relative mx-auto max-w-[1440px] lg:h-[565px] max-lg:h-[710px] max-lg:px-[18px]">
        <div className="absolute top-[92px] left-[65px] max-lg:static max-lg:pt-[29px]">
          <SlideIn>
            <Eyebrow className="text-gold max-lg:hidden">CERTIFICATIONS</Eyebrow>
            <Eyebrow mobileSize="md" className="text-gold lg:hidden">THE AYGATE APPROACH</Eyebrow>
            <h2 className="mt-[4px] -ml-px font-serif text-h2 font-medium whitespace-nowrap max-lg:hidden">Show proof — only when verified.</h2>
            <h2 className="mt-[5px] w-[362px] max-w-full font-serif text-h3 leading-[34.9px] font-medium lg:hidden">A Sri Lankan sourcing partner built by two friends.</h2>
          </SlideIn>
          <SlideIn i={2}>
            <p className="mt-[17px] ml-[2px] w-[625px] text-p3 font-light max-lg:hidden">Each certificate card should show certificate name, issuing body, number where appropriate, validity/expiry date, scope and a View Certificate action.</p>
            <p className="mt-[15px] w-[350px] max-w-full text-p8 font-light lg:hidden">We connect selected Sri Lankan agricultural products with the practical requirements of importers, distributors, manufacturers and brands.</p>
          </SlideIn>
          <SlideIn i={3}>
          <ul className="mt-[49px] ml-[47px] list-disc space-y-[17px] text-p1 font-light marker:text-[12px] max-lg:mt-[22px] max-lg:ml-[19px] max-lg:space-y-[25px] max-lg:text-p6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>Company BR - <a href="#" className="underline hover:text-gold">Certificate 1</a></li>
            ))}
          </ul>
          </SlideIn>
        </div>

        <SlideIn from="right" i={1} className="absolute top-[54px] left-[964px] max-lg:top-[353px] max-lg:left-1/2 max-lg:-translate-x-1/2">
        <aside className="relative h-[481px] w-[409px] rounded-panel border border-gold bg-ivory pt-[23px] pl-[44px] max-lg:h-[319px] max-lg:w-[335px] max-lg:pt-[24px] max-lg:pl-0 lg:bg-transparent">
          <h2 className="font-serif text-h2 font-medium max-lg:text-center max-lg:text-h3">Testing</h2>
          <ul className="mt-[17px] -ml-[8px] list-disc pl-[35px] text-[23px] leading-[44.4px] font-light marker:text-[14px] max-lg:mt-[25px] max-lg:ml-[87px] max-lg:pl-0 max-lg:text-[12px] max-lg:leading-[23.2px] max-lg:marker:text-[10px]">
            {testingList.map((t) => <li key={t} className="whitespace-nowrap">{t}</li>)}
          </ul>
          <Button to="/contact" className="mt-[24px] w-[321px] max-lg:absolute max-lg:top-[241px] max-lg:left-[100px] max-lg:mt-0 max-lg:!h-[46px] max-lg:w-[122px] max-lg:!text-[12px]">Contact Us</Button>
        </aside>
        </SlideIn>
      </section>

      <section className="relative overflow-hidden shadow-soft lg:h-[484px] max-lg:h-[468px]">
        <img src="/images/bg-leaf-484.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-468.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto max-w-[1440px] pt-[60px] pl-[64px] max-lg:px-[18px] max-lg:pt-[38px]">
          <SlideIn className="pl-px"><Eyebrow>SUPPLIER CHECKS</Eyebrow></SlideIn>
          <TypedHeading className="mt-[4px] font-serif text-h2 font-medium max-lg:text-h3">A simple, <br className="lg:hidden" />visible quality workflow.</TypedHeading>
          <SlideIn i={1}><p className="mt-[7px] text-p4 max-lg:mt-[5px] max-lg:w-[350px] max-lg:max-w-full max-lg:text-p8">From source to shipment, we follow a clear process to ensure consistent quality and reliable supply for our buyers.</p></SlideIn>
          <div className="mt-[48px] ml-[63px] hidden gap-[36px] lg:flex">
            {qualitySteps.map((s, i) => (
              <SlideIn key={s.n} from="right" i={2 + i} kind="card" className="shrink-0">
              <article className="relative h-[228px] w-[371px] rounded-panel border border-gold bg-cream">
                                <span className="absolute top-[74px]" style={{ left: s.iconX }}><Icon name="doc-accept" size={94} className="text-gold" /></span>
                <div className="absolute top-[20px]" style={{ left: s.textX }}>
                  <span className="flex size-[54px] items-center justify-center rounded-full border-2 border-gold text-[32px] leading-[41.1px] text-gold">{s.n}</span>
                  <h3 className="mt-[6px] text-[32px] leading-[41.1px]">{s.title}</h3>
                  <p className="mt-[7px] w-[194px] text-p4">{s.text}</p>
                </div>
              </article>
              </SlideIn>
            ))}
          </div>
          <div className="mt-[20px] ml-[10px] grid grid-cols-[repeat(2,170px)] gap-x-[8px] gap-y-[17px] lg:hidden">
            {qualitySteps.map((s, i) => (
              <SlideIn key={s.n} from="right" i={1 + i} kind="card" className="grid">
              <article className="relative h-[128px] rounded-panel border border-gold bg-cream">
                <Icon name="doc-accept" size={32} className="absolute top-[10px] left-[13px] text-gold" />
                <span className="absolute top-[10px] right-[11px] flex size-[28px] items-center justify-center rounded-full border-[1.5px] border-gold text-p2 text-gold">{s.n}</span>
                <h3 className="absolute top-[41px] left-[17px] text-p3">{s.title}</h3>
                <p className="absolute top-[62px] left-[17px] w-[142px] text-p8">{s.text}</p>
              </article>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-[64px] pt-[92px] pb-[106px] max-lg:px-[52px] max-lg:pt-[21px] max-lg:pb-[39px]">
        <SlideIn className="pl-px max-lg:pl-[10px]"><Eyebrow>TRACEABILITY</Eyebrow></SlideIn>
        <TypedHeading className="mt-[4px] font-serif text-h2 font-medium max-lg:ml-[10px] max-lg:text-h3">From <br className="lg:hidden" />Source to Shipment.</TypedHeading>
        <SlideIn i={1}><p className="mt-[10px] pl-px text-p4 max-lg:ml-[12px] max-lg:mt-[3px] max-lg:w-[281px] max-lg:text-p8">We maintain product traceability through our sourcing network, processing partners and export documentation, giving our buyers confidence in origin and consistency.</p></SlideIn>
        <div className="mt-[41px] hidden max-w-[1311px] grid-cols-3 gap-[21px] lg:grid">
          {traceServices.map((s, i) => <SlideIn key={s.title} from="right" i={2 + i} kind="card" className="grid"><ServiceCard service={s} veilTop={244} textClass="text-p4" /></SlideIn>)}
        </div>
        <div className="mt-[25px] space-y-[10px] lg:hidden">
          {traceServices.map((s, i) => <SlideIn key={s.title} from="right" i={i} kind="card"><ServiceCardMobile service={s} textClass="font-normal" /></SlideIn>)}
        </div>
      </section>
    </>
  )
}
