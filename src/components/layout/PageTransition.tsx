import { Fragment, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation, type Location } from 'react-router-dom'
import { jumpTo } from '../../lib/smoothScroll'

/** Total length of the page change; must match the longest animation in index.css. */
const DURATION_MS = 1000

type Layer = { location: Location; offset: number }

/**
 * Page change: the old and new page are stacked for a moment. The new hero wipes in
 * left to right over the old one, while the old content below it drops away and the
 * new content comes down from the top. Styles live in index.css under "Page change".
 */
export function PageTransition({ children }: { children: (location: Location) => ReactNode }) {
  const location = useLocation()
  const [current, setCurrent] = useState(location)
  const [leaving, setLeaving] = useState<Layer | null>(null)

  // Same page (e.g. only the query changed): swap in place, no animation.
  if (location !== current && location.pathname === current.pathname) setCurrent(location)
  // New page: keep the old one as the leaving layer, pinned where the visitor was scrolled.
  if (location.pathname !== current.pathname) {
    setLeaving({ location: current, offset: window.scrollY })
    setCurrent(location)
  }

  useLayoutEffect(() => {
    jumpTo(0)
  }, [current.pathname])

  useLayoutEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setLeaving(null), DURATION_MS)
    return () => clearTimeout(t)
  }, [leaving])

  const layers = leaving ? [leaving, { location: current, offset: 0 }] : [{ location: current, offset: 0 }]

  return (
    <div className="pt-stage">
      {layers.map(({ location: loc, offset }) => {
        const role = !leaving ? '' : loc === current ? 'pt-in' : 'pt-out'
        return (
          <div
            key={loc.key}
            className={`pt-layer ${role}`}
            style={offset ? { transform: `translateY(${-offset}px)` } : undefined}
            aria-hidden={role === 'pt-out' || undefined}
            inert={role === 'pt-out' || undefined}
          >
            <Fragment>{children(loc)}</Fragment>
          </div>
        )
      })}
    </div>
  )
}
