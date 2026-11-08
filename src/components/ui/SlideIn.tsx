import type { CSSProperties, ReactNode } from 'react'
import { slideDelay, useInView, type SlideKind } from '../../hooks/useInView'

type Props = { children: ReactNode; from?: 'left' | 'right' | 'up'; i?: number; kind?: SlideKind; className?: string; style?: CSSProperties }

/**
 * Reveals its content once it scrolls into view. `i` staggers siblings that enter together;
 * `kind` is 'text' (quiet fade, default), 'card' (slide) or 'media' (photo wipe). Positioning classes can go straight on it.
 */
export function SlideIn({ children, from = 'left', i = 0, kind = 'text', className, style }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2)
  return (
    <div
      ref={ref}
      data-inview={inView ? 'on' : 'off'}
      data-slide={from}
      data-card={kind === 'card' ? '' : undefined}
      data-media={kind === 'media' ? '' : undefined}
      className={className}
      style={{ ...style, '--slide-delay': slideDelay(i) } as CSSProperties}
    >
      {children}
    </div>
  )
}
