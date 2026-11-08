import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Eased page scrolling for mouse wheels and trackpads. Touch keeps the phone's own scrolling,
 * and visitors who ask for reduced motion get the browser default.
 */
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({
    lerp: 0.085, // lower = softer glide; ~0.1 is Lenis' default
    wheelMultiplier: 0.9,
    anchors: true,
  })
  const raf = (time: number) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

/** Jump straight to a position (e.g. top of a new page) without easing. */
export function jumpTo(top: number) {
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true })
  else window.scrollTo({ top, behavior: 'instant' })
}

/** Pause/resume eased scrolling, e.g. while a modal is open. */
export const pauseSmoothScroll = () => lenis?.stop()
export const resumeSmoothScroll = () => lenis?.start()
