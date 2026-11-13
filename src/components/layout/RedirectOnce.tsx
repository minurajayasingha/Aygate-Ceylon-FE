import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Like <Navigate>, but fires only once. Pages stay mounted for a moment while they animate out
 * (see PageTransition), and a <Navigate> there would fire again on every re-render and loop.
 */
export function RedirectOnce({ to, state }: { to: string; state?: unknown }) {
  const navigate = useNavigate()
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    navigate(to, { replace: true, state })
  }, [navigate, to, state])
  return null
}
