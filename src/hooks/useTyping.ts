import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { segments, typedLength } from '../components/ui/TypedText'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Milliseconds since `running` became true, ticking each frame until `until`. Infinity for reduced motion. */
function useClock(running: boolean, until: number) {
  const [t, setT] = useState(() => (reducedMotion() ? Infinity : 0))
  useEffect(() => {
    if (!running || t === Infinity) return
    const t0 = performance.now()
    let id = requestAnimationFrame(function tick(now) {
      const el = now - t0
      setT(el)
      if (el < until) id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, until])
  return t
}

/** One line to type: per-character speed, capped so long text never takes longer than `max`. */
export type Line = { text: ReactNode; char: number; max: number }

const GAP = 80
const CARET_LINGER = 700

/**
 * Types several lines one after another. Each line takes len × char ms, capped at `max`,
 * so a long paragraph finishes as fast as a short title.
 */
export function useTyping(lines: Line[], running: boolean, delay = 0) {
  const plan = useMemo(() => {
    let at = delay
    return lines.map((l) => {
      const segs = segments(l.text)
      const len = typedLength(segs)
      const dur = Math.min(len * l.char, l.max)
      const step = { segs, len, start: at, end: at + dur }
      at += dur + GAP
      return step
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...lines.map((l) => l.text)])

  const end = plan.length ? plan[plan.length - 1].end : delay
  const t = useClock(running, end + CARET_LINGER)
  const typing = plan.findIndex((p) => t < p.end)
  const caretAt = typing === -1 ? (t < end + CARET_LINGER ? plan.length - 1 : -1) : t >= plan[typing].start || typing === 0 ? typing : typing - 1

  return {
    lines: plan.map((p, i) => ({
      segs: p.segs,
      count: t >= p.end ? p.len : Math.max(0, Math.floor(((t - p.start) / (p.end - p.start)) * p.len)),
      caret: running && t >= delay && i === caretAt,
    })),
    done: t >= end,
  }
}
