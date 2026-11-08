import { Children, isValidElement, type ReactNode } from 'react'

type Segment = string | ReactNode

/** Flattens text and line-break elements into segments; only strings count towards the typed length. */
export function segments(node: ReactNode): Segment[] {
  const out: Segment[] = []
  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') out.push(String(child))
    else if (isValidElement<{ children?: ReactNode }>(child) && child.props.children !== undefined) out.push(...segments(child.props.children))
    else if (child != null && typeof child !== 'boolean') out.push(child)
  })
  return out
}

export const typedLength = (segs: Segment[]) => segs.reduce<number>((n, s) => n + (typeof s === 'string' ? s.length : 0), 0)

type Props = { segs: Segment[]; count: number; caret?: boolean }

/**
 * Shows the first `count` characters. The rest stays in the layout but invisible,
 * so lines never reflow while typing and screen readers still get the full text.
 */
export function TypedText({ segs, count, caret }: Props) {
  let left = count
  let caretPlaced = false
  const caretEl = (key: string) => (
    <span key={key} aria-hidden className="relative inline-block w-0">
      <span className="hero-caret absolute bottom-[0.12em] left-[0.04em] h-[0.95em] w-[2px] bg-gold" />
    </span>
  )

  const parts = segs.map((seg, i) => {
    if (typeof seg !== 'string') return <span key={i}>{seg}</span>
    const shown = seg.slice(0, Math.max(0, left))
    const hidden = seg.slice(shown.length)
    left -= shown.length
    const placeCaret = caret && !caretPlaced && (hidden.length > 0 || left === 0 && i === lastTextIndex(segs))
    if (placeCaret) caretPlaced = true
    return (
      <span key={i}>
        {shown}
        {placeCaret && caretEl(`c${i}`)}
        {hidden && <span className="invisible">{hidden}</span>}
      </span>
    )
  })

  return <>{parts}</>
}

function lastTextIndex(segs: Segment[]) {
  for (let i = segs.length - 1; i >= 0; i--) if (typeof segs[i] === 'string') return i
  return -1
}
