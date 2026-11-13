import { useEffect } from 'react'
import { pauseSmoothScroll, resumeSmoothScroll } from './smoothScroll'

/** While an overlay is open: Escape closes it and the page behind stops scrolling. */
export function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      resumeSmoothScroll()
    }
  }, [open, onClose])
}
