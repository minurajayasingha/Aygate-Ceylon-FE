// With `onSelect` the dots become buttons that jump to a slide.
export function Dots({ count = 4, active = 0, onSelect }: { count?: number; active?: number; onSelect?: (i: number) => void }) {
  const dot = (i: number) => `size-[10px] rounded-full transition-colors duration-500 ${i === active ? 'bg-gold' : 'bg-muted'}`
  if (onSelect)
    return (
      <div className="hidden items-center gap-[9px] lg:flex">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" aria-label={`Show card ${i + 1}`} aria-current={i === active} onClick={() => onSelect(i)} className={`${dot(i)} cursor-pointer`} />
        ))}
      </div>
    )
  return (
    <div className="hidden items-center gap-[9px] lg:flex" aria-hidden>
      {Array.from({ length: count }, (_, i) => <span key={i} className={dot(i)} />)}
    </div>
  )
}

// Mobile pagination: a long gold bar for the current slide, faint bars for the rest.
export function BarDots({ count = 4, active = 0, className = '' }: { count?: number; active?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-[5px] ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-[3px] rounded-[1.5px] ${i === active ? 'w-[27px] bg-gold' : 'w-[10px] bg-gold/25'}`} />
      ))}
    </div>
  )
}
