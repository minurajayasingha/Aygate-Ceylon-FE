import { useEffect, useRef, useState, type CSSProperties } from 'react'

/** True once the element has scrolled into view; stays true so the intro only plays once. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (typeof IntersectionObserver === 'undefined') return setInView(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold])
  return [ref, inView] as const
}

/**
 * Section-level reveal: put `ref` and `attrs` on the section, and `slide(i)` on the parts that slide in.
 * `waitOnLoad` holds the parts back by that many ms when the section is already in view as the page opens
 * (e.g. right under the hero, so it plays after the hero intro instead of on top of it).
 */
export function useReveal<T extends Element>(threshold?: number, waitOnLoad = 0) {
  const [ref, inView] = useInView<T>(threshold)
  const [mountedAt] = useState(() => performance.now())
  // Decided in render (not an effect) so the first animated frame already has the right delay.
  const seenAt = useRef<number | null>(null)
  if (inView && seenAt.current === null) seenAt.current = performance.now()
  const base = waitOnLoad && seenAt.current !== null && seenAt.current - mountedAt < 400 ? waitOnLoad : 0
  return { ref, inView, attrs: { 'data-inview': inView ? 'on' : 'off', style: { '--slide-base': `${base}ms` } as CSSProperties } }
}

export type SlideKind = 'text' | 'card' | 'media'

/** Stagger between parts that enter together. */
export const slideDelay = (i: number) => `${120 + i * 90}ms`

/**
 * Props for one revealing part; `i` staggers it after the ones before and `from` picks its side.
 * `kind`: 'text' (default) fades in with a short drift, 'card' slides in, 'media' wipes in (see index.css).
 */
export const slide = (i = 0, from: 'left' | 'right' | 'up' = 'left', kind: SlideKind = 'text') => ({
  'data-slide': from,
  ...(kind === 'card' && { 'data-card': '' }),
  ...(kind === 'media' && { 'data-media': '' }),
  style: { '--slide-delay': `calc(var(--slide-base, 0ms) + ${slideDelay(i)})` } as CSSProperties,
})
