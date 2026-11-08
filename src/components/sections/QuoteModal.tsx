import { useEffect, useSyncExternalStore, type FormEvent } from 'react'
import { pauseSmoothScroll, resumeSmoothScroll } from '../../lib/smoothScroll'
import { inquiryOptions, productOptions, quantityOptions, shareRequirements } from '../../data/content'
import { Button, Eyebrow, Icon, SelectField, TextArea, TextField } from '../ui'

// The mobile popup in Figma uses different labels and placeholders, and placeholders can't switch in CSS.
const mobileQuery = '(width < 1024px)'
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(mobileQuery)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const useMobile = () => useSyncExternalStore(subscribe, () => window.matchMedia(mobileQuery).matches)

const copy = {
  desktop: { name: ['Name', 'Your Name'], address: ['Address', 'Street, City, Country'], whatsapp: '+94' },
  mobile: { name: ['Full Name', 'Your Full name'], address: ['Addres', 'no'], whatsapp: 'Number' },
}

export function QuoteModal({ title, image, onClose }: { title: string; image: string; onClose: () => void }) {
  const text = copy[useMobile() ? 'mobile' : 'desktop']
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      resumeSmoothScroll()
    }
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={title} data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-white/25 backdrop-blur-[10px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mx-auto my-10 flex w-[1244px] max-w-[calc(100%-32px)] overflow-hidden rounded-panel shadow-[7px_4px_12.3px_rgb(0_0_0/0.25)] max-lg:my-0 max-lg:max-w-full max-lg:rounded-control">
        <img src={`/images/${image}.webp`} alt="" className="w-[480px] object-cover max-lg:hidden" />
        <div className="relative min-w-0 flex-1 bg-ivory px-[30px] pt-[31px] pb-[38px] max-lg:px-[32px] max-lg:pt-[21px]" style={{ backgroundImage: 'url(/images/bg-leaf-panel.webp)', backgroundSize: 'cover' }}>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute top-[28px] right-[30px] hover:text-gold max-lg:top-[21px] max-lg:right-[28px]"><Icon name="close" size={22} /></button>
          <Eyebrow size="md" mobileSize="sm"><span className="max-lg:hidden">For Bulk and Private label</span><span className="lg:hidden">Start the conversation</span></Eyebrow>
          <h2 className="mt-[9px] font-serif text-h1 font-normal max-lg:text-h3 max-lg:font-medium"><span className="max-lg:hidden">{title}</span><span className="lg:hidden">Tell Us What You Need</span></h2>
          <p className="mt-[8px] w-[668px] max-w-full text-p3 font-light max-lg:mt-[6px] max-lg:text-p6">{shareRequirements}</p>
          <form onSubmit={submit} className="mt-[29px] grid grid-cols-[330px_330px] gap-x-[32px] gap-y-[5px] max-lg:mt-[13px] max-lg:grid-cols-1 max-lg:gap-y-3 max-lg:px-[17px]">
            <div className="grid grid-cols-[184px_135px] gap-x-[11px] max-lg:grid-cols-[1fr_135px]">
              <SelectField label="Product" options={productOptions} />
              <SelectField label="Quantity" options={quantityOptions} center labelClassName="!pl-[15px]" />
            </div>
            <div className="max-lg:order-2"><TextField label={text.name[0]} name="Name" placeholder={text.name[1]} /></div>
            <div className="max-lg:order-3"><TextField label={text.address[0]} name="Address" placeholder={text.address[1]} /></div>
            <div className="max-lg:order-1"><SelectField label="Inquiry Type" options={inquiryOptions} /></div>
            <div className="max-lg:order-4"><TextField label="WhatsApp" placeholder={text.whatsapp} type="tel" /></div>
            <div className="max-lg:order-5"><TextField label="Email" placeholder="email@gamil.com" type="email" labelClassName="!pl-[18px]" className="!px-[18px]" /></div>
            <div className="col-span-2 max-lg:order-6 max-lg:col-span-1">
              <TextArea label="Additional Massage" placeholder="Type Here" labelClassName="!pl-[18px]" className="h-[117px] max-lg:h-[127px]" />
            </div>
            <Button type="submit" size="md" className="mt-[36px] ml-[6px] w-[328px] max-lg:order-7 max-lg:mx-auto max-lg:mt-[10px] max-lg:h-[46px] max-lg:w-[169px] max-lg:text-[12px]">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
