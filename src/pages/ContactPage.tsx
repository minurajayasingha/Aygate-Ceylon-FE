import type { FormEvent } from 'react'
import { contactDetails, inquiryOptions, productOptions, quantityOptions, shareRequirements } from '../data/content'
import { Button, Eyebrow, Icon, SelectField, SlideIn, TextArea, TextField } from '../components/ui'
import { Hero } from '../components/sections/Hero'

const prevent = (e: FormEvent) => e.preventDefault()

export function ContactPage() {
  return (
    <>
      <Hero
        image="hero-contact"
        eyebrow="CONTACT US"
        title="Request a quote or Product Sample"
        body="From two friends with an interest in farming to a growing ambition to take Sri Lankan products to international buyers."
        titleWidth={820}
        bodyWidth={476}
        desktop={{ height: 481, eyebrow: [67, 243], title: [59, 270], body: [64, 416] }}
        mobile={{ height: 490, eyebrow: [18, 223], title: [18, 241], body: [21, 401] }}
      />

      <section className="relative mx-auto max-w-[1440px] lg:h-[844px]">
        <div className="relative overflow-hidden rounded-panel bg-ivory shadow-soft max-lg:h-[943px] max-lg:rounded-none lg:absolute lg:top-[41px] lg:left-[59px] lg:h-[721px] lg:w-[764px]">
          <img src="/images/bg-leaf-panel.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
          <img src="/images/bg-leaf-m-946.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
          <div className="relative pt-[31px] pl-[30px] max-lg:px-[18px] max-lg:pt-[18px]">
            <Eyebrow size="md" mobileSize="sm">START THE CONVERSATION</Eyebrow>
            <h2 className="mt-[14px] font-serif text-h2 font-medium max-lg:mt-[13px] max-lg:text-h3">Tell Us What You Need</h2>
            <p className="mt-[9px] w-[668px] max-w-full text-p3 font-light max-lg:mt-[6px] max-lg:text-p6">{shareRequirements}</p>
            <form onSubmit={prevent} className="mt-[29px] grid w-[692px] grid-cols-[330px_330px] gap-x-[32px] gap-y-[14px] max-lg:mt-[13px] max-lg:w-[364px] max-lg:max-w-full max-lg:grid-cols-1 max-lg:gap-y-[12px] max-lg:px-[17px]">
              <TextField label="Full Name" placeholder="Your Full name" />
              <TextField label="Email" placeholder="email@gamil.com" type="email" labelClassName="lg:!pl-[18px]" className="lg:!px-[18px]" />
              <TextField label="Country" placeholder="Sri Lannka" />
              <TextField label="Destination" placeholder="Colombo" labelClassName="lg:!pl-[18px]" className="lg:!px-[18px]" />
              <TextField label="WhatsApp" placeholder="+94" type="tel" />
              <div className="grid grid-cols-[184px_135px] gap-x-[11px] max-lg:grid-cols-[1fr_135px] lg:-mb-[3px] lg:pt-[3px]">
                <SelectField label="Product" options={productOptions} />
                <SelectField label="Quantity" options={quantityOptions} center labelClassName="!pl-[9px]" />
              </div>
              <div className="col-span-2 max-lg:col-span-1">
                <TextArea label="Additional Massage" placeholder="Type Here" labelClassName="lg:!pl-[18px]" className="h-[117px] max-lg:h-[127px]" />
              </div>
              <SelectField label="Inquiry Type" options={inquiryOptions} />
              <div className="self-end max-lg:flex max-lg:justify-center">
                <Button type="submit" size="md" className="w-[328px] max-lg:mt-[8px] max-lg:!h-[46px] max-lg:w-[169px] max-lg:!text-[12px]">Submit</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="relative max-lg:h-[644px] max-lg:pt-[43px] lg:absolute lg:top-[72px] lg:left-[888px] lg:w-[452px]">
          <div className="max-lg:px-[18px]">
            <SlideIn from="right" i={0}>
              <Eyebrow size="md" mobileSize="sm">GET IN TOUCH</Eyebrow>
              <h2 className="mt-[14px] font-serif text-h2 font-medium max-lg:mt-[20px] max-lg:text-h3">Let’s discuss <br className="lg:hidden" />your requirement.</h2>
            </SlideIn>
            <SlideIn from="right" i={2}><p className="mt-[7px] text-p3 font-light max-lg:mt-[13px] max-lg:text-p6">Direct contact information and monitored channels.</p></SlideIn>
          </div>
          <ul className="absolute top-[197px] left-[42px] max-lg:top-[218px] max-lg:left-[86px]">
            {contactDetails.map((c, i) => (
              <li key={c.title}>
              <SlideIn from="right" i={4 + i} className="relative mb-[33px] pl-[54px] text-p2 font-light">
                <Icon name={c.icon} size={38} className="absolute top-px left-0 text-gold" />
                <p>{c.title}</p>
                {c.lines.map((l) => <p key={l} className="whitespace-nowrap">{l}</p>)}
              </SlideIn>
              </li>
            ))}
          </ul>
          <SlideIn from="right" i={9} className="lg:absolute lg:top-[589px] lg:-left-[7px] max-lg:absolute max-lg:top-[551px] max-lg:left-1/2 max-lg:-translate-x-1/2">
            <Button href="https://wa.me/94740055791" size="md" className="w-[442px] max-lg:!h-[46px] max-lg:w-[188px] max-lg:!text-[12px]">
              <span className="lg:hidden">WhatsApp</span>
              <span className="max-lg:hidden">Whatsapp Us</span>
            </Button>
          </SlideIn>
        </div>
      </section>
    </>
  )
}
