import type { CSSProperties, ReactNode } from 'react'
import { slideDelay, useInView } from '../../hooks/useInView'

type Props = { children: ReactNode; running?: boolean; className?: string; as?: 'h1' | 'h2' | 'h3'; i?: number }

/**
 * Section heading that fades up gently with its section. (It used to type itself in; only the hero types now.)
 * Pass `running` to start it with its section; otherwise it starts when it scrolls into view.
 */
export function TypedHeading({ children, running, className, as: Tag = 'h2', i = 1 }: Props) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.5)
  const on = running ?? inView
  return (
    <Tag ref={ref} data-inview={on ? 'on' : 'off'} data-slide="up" className={className} style={{ '--slide-delay': `calc(var(--slide-base, 0ms) + ${slideDelay(i)})` } as CSSProperties}>
      {children}
    </Tag>
  )
}
