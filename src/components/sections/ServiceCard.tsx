import type { Service } from '../../data/content'

type Props = { service: Service; veilTop?: number; textClass?: string }

export function ServiceCard({ service, veilTop = 229, textClass = 'text-p3 font-light' }: Props) {
  return (
    <article className="group relative h-[381px] overflow-hidden rounded-feature shadow-feature transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-[6px] hover:shadow-[0_18px_40px_-12px_rgba(60,40,20,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <img src={`/images/${service.image}.webp`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      <div className="absolute inset-x-0 bottom-0 bg-veil px-[23px] text-center" style={{ top: veilTop }}>
        <h3 className="mt-[24px] font-serif text-h3 font-medium whitespace-nowrap">{service.title}</h3>
        <p className={`mx-auto mt-[20px] max-w-[377px] ${textClass}`}>{service.text}</p>
      </div>
    </article>
  )
}

export function ServiceCardMobile({ service, textClass = 'font-light' }: { service: Service; textClass?: string }) {
  return (
    <article className="relative h-[271px] w-[301px] overflow-hidden rounded-feature">
      <img src={`/images/${service.image}.webp`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 top-[165px] bottom-0 bg-veil px-[16px] text-center">
        <h3 className="mt-[25px] font-serif text-h4 font-medium whitespace-nowrap">{service.title}</h3>
        <p className={`mx-auto mt-[9px] max-w-full text-p6 ${textClass}`} style={{ width: service.mobileWidth ?? 269 }}>{service.text}</p>
      </div>
    </article>
  )
}
