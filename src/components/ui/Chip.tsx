import type { ComponentProps } from 'react'

export function FilterChip({ active, className = '', ...props }: { active?: boolean } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center justify-center rounded-[18px] px-5 text-[16px] leading-[19px] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,scale] duration-300 ease-out active:scale-[0.96] lg:rounded-chip ${
        active ? 'bg-gold text-white shadow-[0_6px_16px_-8px_rgb(196_140_64/0.7)]' : 'border border-gold text-gold hover:bg-gold hover:text-white'
      } ${className}`}
      {...props}
    />
  )
}

export function Tag({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`inline-flex h-[26px] items-center rounded-control border-[0.5px] border-gold bg-cream px-[10px] text-p6 font-light ${className}`}>{children}</span>
}

// Single-choice option button, such as product quality variants.
export function OptionChip({ active, className = '', ...props }: { active?: boolean } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center justify-center rounded-control text-[14px] leading-[18px] transition-[width,height,color,background-color,border-color,scale] duration-300 ease-out active:scale-90 max-lg:text-[12px] max-lg:leading-[15.4px] ${
        active ? 'h-[28px] w-[34px] bg-gold text-white max-lg:h-[25px]' : 'h-[26px] w-[36px] border border-gold hover:bg-gold/15 max-lg:h-[23px]'
      } ${className}`}
      {...props}
    />
  )
}
