import { exportServices, exportServicesMobile, journeySteps } from '../data/content'
import { Button, Eyebrow, Icon, SlideIn, TypedHeading } from '../components/ui'
import { Hero } from '../components/sections/Hero'
import { ServiceCard, ServiceCardMobile } from '../components/sections/ServiceCard'
import { pageSeo, useSeo } from '../seo'

export function ExportPage() {
  useSeo(pageSeo('/export-services'))
  return (
    <>
      <Hero
        image="hero-export"
        eyebrow="EXPORT SERVICES"
        title={<>Export Support Built<br />Around Your Requirement</>}
        body="Whether you are an importer, distributor, manufacturer or brand, Aygate Ceylon can work with you to define product, quantity, packing and delivery requirements."
        titleWidth={820}
        bodyWidth={542}
        desktop={{ height: 481, eyebrow: [67, 243], title: [59, 270], body: [64, 409] }}
        mobile={{ height: 495, eyebrow: [20, 187], title: [20, 209], body: [18, 407] }}
      />

      <section className="mx-auto max-w-[1440px] px-[62px] pt-[70px] pb-[48px] max-lg:px-[20px] max-lg:pt-[18px] max-lg:pb-[17px]">
        <SlideIn className="pl-[3px] max-lg:pl-0"><Eyebrow>OUR EXPORT SERVICES</Eyebrow></SlideIn>
        <TypedHeading className="mt-[4px] pl-[2px] font-serif text-h2 font-medium max-lg:mt-[4px] max-lg:pl-0 max-lg:text-h3">Flexible Solutions <br className="lg:hidden" />for Global Buyers</TypedHeading>
        <SlideIn i={1}><p className="mt-[17px] ml-[5px] w-[625px] text-p3 font-light max-lg:mt-[3px] max-lg:ml-0 max-lg:w-[366px] max-lg:max-w-[calc(100vw-36px)] max-lg:text-p8">We work with importers, distributors, manufacturers and brands to meet diverse market requirements with the right products, packing and delivery support.</p></SlideIn>
        <div className="mt-[42px] hidden grid-cols-3 gap-x-[21px] gap-y-[24px] lg:grid">
          {exportServices.map((s, i) => <SlideIn key={s.title} from="right" i={2 + (i % 3)} kind="card" className="grid"><ServiceCard service={s} /></SlideIn>)}
        </div>
        <div className="mt-[30px] ml-[32px] space-y-[10px] lg:hidden">
          {exportServicesMobile.map((s, i) => <SlideIn key={s.title} from="right" i={i % 2} kind="card"><ServiceCardMobile service={s} textClass="font-normal" /></SlideIn>)}
        </div>
      </section>

      <section className="relative overflow-hidden shadow-soft lg:h-[484px] max-lg:h-[839px]">
        <img src="/images/bg-leaf-484.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-839.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto max-w-[1440px] pt-[60px] pl-[64px] max-lg:px-[24px] max-lg:pt-[33px]">
          <SlideIn className="pl-px max-lg:pl-0"><Eyebrow>BUYER JOURNEY</Eyebrow></SlideIn>
          <TypedHeading className="mt-[4px] font-serif text-h2 font-medium max-lg:mt-[6px] max-lg:text-h3">From <br className="lg:hidden" />requirement to shipment.</TypedHeading>
          <SlideIn i={1}><p className="mt-[7px] text-p4 max-lg:mt-[10px] max-lg:w-[350px] max-lg:max-w-full max-lg:text-p8">A clear and simple process to ensure your requirements are understood and handled with care from product selection to delivery.</p></SlideIn>

          <ol className="mt-[78px] ml-[62px] hidden gap-[65px] lg:flex">
            {journeySteps.map((step, i) => (
              <li key={step}>
              <SlideIn from="right" i={2 + i} kind="card" className="relative pt-[75px] text-p4 whitespace-pre-line">
                {i === 0 ? (
                  <>
                    <Icon name="doc-accept" size={94} className="absolute -top-[30px] left-[15px] text-gold" />
                    <span className="absolute top-[30px] left-[9px] flex size-[27px] items-center justify-center rounded-full bg-ink text-p3 text-white">1</span>
                  </>
                ) : (
                  <span className="absolute top-0 left-1/2 flex size-[54px] -translate-x-1/2 items-center justify-center rounded-full border border-gold text-[32px] leading-[41.1px] text-gold">{i + 1}</span>
                )}
                {step}
              </SlideIn>
              </li>
            ))}
          </ol>

          <ol className="mt-[24px] ml-[2px] grid grid-cols-[repeat(2,170px)] gap-x-[10px] gap-y-[10px] lg:hidden">
            {journeySteps.map((step, i) => (
              <li key={step} className="grid">
              <SlideIn from="right" i={1 + (i % 2)} kind="card" className="relative h-[128px] rounded-panel border border-gold bg-cream">
                <Icon name="doc-accept" size={38} className="absolute top-[7px] left-[11px] text-gold" />
                <span className="absolute top-[10px] right-[11px] flex size-[28px] items-center justify-center rounded-full border-[1.5px] border-gold text-p2 text-gold">{i + 1}</span>
                <span className={`absolute left-[17px] w-[104px] text-p4 whitespace-pre-line ${i === 6 ? 'top-[80px]' : 'top-[61px]'}`}>{step}</span>
              </SlideIn>
              </li>
            ))}
          </ol>

          <div className="mt-[25px] flex justify-center lg:absolute lg:top-[379px] lg:left-[560px] lg:mt-0 lg:block">
            <SlideIn from="up" i={3}><Button to="/contact" className="w-[321px] max-lg:!h-[56px] max-lg:!text-[12px]">Discuss Your Requirement</Button></SlideIn>
          </div>
        </div>
      </section>
    </>
  )
}
