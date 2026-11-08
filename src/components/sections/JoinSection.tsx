import type { FormEvent } from 'react'
import { Button, Eyebrow, TextField, TypedHeading } from '../ui'
import { slide, useReveal } from '../../hooks/useInView'
import { shareRequirements } from '../../data/content'

const prevent = (e: FormEvent) => e.preventDefault()

export function JoinSection({ wide }: { wide?: boolean }) {
  const join = useReveal<HTMLElement>()
  return (
    <section ref={join.ref} {...join.attrs} className="relative h-[366px] overflow-hidden max-lg:h-[359px]">
      <img src="/images/bg-join.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
      <img src="/images/bg-join-m.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center pt-[49px] text-center max-lg:items-start max-lg:px-[18px] max-lg:pt-[48px] max-lg:text-left">
        <div {...slide(0, 'up')}><Eyebrow size="md" mobileSize="md" className="text-gold max-lg:text-gold-muted">START THE CONVERSATION</Eyebrow></div>
        <TypedHeading running={join.inView} className="mt-[14px] font-serif text-h2 font-medium max-lg:mt-[3px] max-lg:text-h3">Join With Us</TypedHeading>
        <p {...slide(2, 'up')} className="mt-[9px] w-[668px] max-w-full text-p3 font-light max-lg:mt-[6px] max-lg:w-[341px] max-lg:text-p8">{shareRequirements}</p>
        <form {...slide(4, 'up')} onSubmit={prevent} className={`mt-[27px] flex items-end text-left max-lg:mt-[14px] max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-[19px] ${wide ? 'w-[746px] gap-[24px]' : 'w-[608px] gap-[19px] lg:-translate-x-[69px]'}`}>
          <div className={`max-lg:w-full ${wide ? 'w-[362px]' : 'w-[420px]'}`}>
            <TextField label="Email" type="email" placeholder="email@gamil.com" highlighted labelClassName="!pl-[18px] max-lg:!pl-[21px] max-lg:!text-p8 max-lg:!mb-px" className="!text-p5 !px-[18px] max-lg:!px-[21px]" />
          </div>
          <Button type="submit" size="md" arrow={!!wide} hoverArrow={!wide} className={`!h-[45px] max-lg:!h-[49px] max-lg:w-full ${wide ? 'w-[360px]' : 'w-[169px]'}`}>Submit</Button>
        </form>
      </div>
    </section>
  )
}
