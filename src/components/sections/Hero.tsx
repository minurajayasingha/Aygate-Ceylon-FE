import type { ReactNode } from 'react'
import { Eyebrow } from '../ui'
import { TypedText } from '../ui/TypedText'
import { useTyping } from '../../hooks/useTyping'

type Pos = [x: number, y: number]
type Layout = { height: number; eyebrow: Pos; title: Pos; body?: Pos; actions?: Pos }

type Props = {
  image: string
  eyebrow: string
  title: ReactNode
  body?: string
  actions?: ReactNode
  eyebrowSize?: 'xl' | 'lg'
  titleSize?: 'display' | 'h1'
  titleWidth: number
  bodyWidth: number
  desktop: Layout
  mobile: Layout
}

const px = (v?: number) => (v === undefined ? undefined : `${v}px`)

// Typing starts while the page-change wipe is still finishing; each line is capped so the intro stays short.
const START = 400
const EYEBROW = { char: 14, max: 320 }
const TITLE = { char: 16, max: 750 }
const BODY = { char: 4, max: 650 }

// Figma places hero copy at fixed coordinates, so each page passes its own positions.
export function Hero({ image, eyebrow, title, body, actions, eyebrowSize = 'xl', titleSize = 'display', titleWidth, bodyWidth, desktop, mobile }: Props) {
  const vars = {
    '--dh': px(desktop.height), '--mh': px(mobile.height),
    '--dex': px(desktop.eyebrow[0]), '--dey': px(desktop.eyebrow[1]), '--mex': px(mobile.eyebrow[0]), '--mey': px(mobile.eyebrow[1]),
    '--dtx': px(desktop.title[0]), '--dty': px(desktop.title[1]), '--mtx': px(mobile.title[0]), '--mty': px(mobile.title[1]),
    '--dbx': px(desktop.body?.[0]), '--dby': px(desktop.body?.[1]), '--mbx': px(mobile.body?.[0]), '--mby': px(mobile.body?.[1]),
    '--dax': px(desktop.actions?.[0]), '--day': px(desktop.actions?.[1]), '--max': px(mobile.actions?.[0]), '--may': px(mobile.actions?.[1]),
    '--tw': px(titleWidth), '--bw': px(bodyWidth),
  } as React.CSSProperties

  const typing = useTyping([{ text: eyebrow, ...EYEBROW }, { text: title, ...TITLE }, ...(body ? [{ text: body, ...BODY }] : [])], true, START)
  const [eyebrowLine, titleLine, bodyLine] = typing.lines
  const revealed = typing.done ? 'on' : 'off'

  return (
    <section data-hero className="relative h-(--mh) overflow-hidden bg-ink text-white lg:h-(--dh)" style={vars}>
      <picture>
        <source media="(min-width: 1024px)" srcSet={`/images/${image}.webp`} />
        <img src={`/images/${image}-m.webp`} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      </picture>
      <div className="relative mx-auto h-full max-w-[1440px]">
        <div className="absolute top-(--mey) left-(--mex) lg:top-(--dey) lg:left-(--dex)"><Eyebrow size={eyebrowSize}><TypedText {...eyebrowLine} /></Eyebrow></div>
        <h1 className={`absolute top-(--mty) left-(--mtx) w-[min(var(--tw-m,327px),calc(100vw-40px))] font-serif text-h2-m font-medium lg:top-(--dty) lg:left-(--dtx) lg:w-(--tw) ${titleSize === 'display' ? 'lg:text-display' : 'lg:text-h1'}`}>
          <TypedText {...titleLine} />
        </h1>
        {body && bodyLine && <p className="absolute top-(--mby) left-(--mbx) w-[min(343px,calc(100vw-40px))] text-p6 lg:top-(--dby) lg:left-(--dbx) lg:w-(--bw) lg:text-p4"><TypedText {...bodyLine} /></p>}
        {actions && <div data-reveal-items={revealed} className="absolute top-(--may) left-(--max) flex items-end gap-[10px] lg:top-(--day) lg:left-(--dax) lg:gap-[15px]">{actions}</div>}
      </div>
    </section>
  )
}
