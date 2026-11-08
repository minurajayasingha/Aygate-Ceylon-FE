import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

type Variant = 'primary' | 'outline' | 'outline-light'
type Size = 'lg' | 'md' | 'sm'

// Hover fill, lift and press live in index.css under "Buttons" (.btn, .btn-*).
const variants: Record<Variant, string> = {
  primary: 'btn btn-primary bg-gold text-white',
  outline: 'btn btn-outline border border-gold-deep text-gold-deep hover:text-white',
  'outline-light': 'btn btn-outline-light border border-white text-white hover:text-ink',
}

const sizes: Record<Size, string> = {
  lg: 'h-[59px] text-[16px] leading-[19px]',
  md: 'h-[51px] text-[16px] leading-[19px]',
  sm: 'h-[46px] text-[12px] leading-[14.2px]',
}

type Props = {
  variant?: Variant
  size?: Size
  arrow?: boolean
  // Desktop hover collapses the label into a gold arrow pill (Figma "Frame 18"). Primary only.
  hoverArrow?: boolean
  to?: string
  href?: string
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'button'>, 'className' | 'children'>

export function Button({ variant = 'primary', size = 'lg', arrow = true, hoverArrow, to, href, className = '', children, type = 'button', ...rest }: Props) {
  // The outer box keeps its size so the hover area doesn't shrink away from the cursor.
  const classes = hoverArrow
    ? `group relative inline-flex whitespace-nowrap text-white ${sizes[size]} ${className}`
    : `inline-flex items-center ${arrow ? 'justify-center' : 'justify-start'} gap-[13px] rounded-control px-5 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`
  const content = hoverArrow ? (
    <span className="btn-morph absolute inset-0 m-auto flex size-full items-center justify-center gap-[13px] overflow-hidden rounded-control bg-gold lg:group-hover:h-[42px] lg:group-hover:w-[50px] lg:group-hover:rounded-[26px] lg:group-hover:bg-gold-deep">
      <span className="btn-morph-label lg:group-hover:scale-90 lg:group-hover:opacity-0">{children}</span>
      {arrow ? (
        <span className="flex"><Icon name="arrow-right" size={16} /></span>
      ) : (
        <span className="btn-morph-arrow absolute inset-0 flex items-center justify-center opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"><Icon name="arrow-right" size={16} /></span>
      )}
    </span>
  ) : (
    <>
      {children}
      {arrow && <span className="btn-arrow inline-flex"><Icon name="arrow-right" size={16} /></span>}
    </>
  )
  if (to) return <Link to={to} className={classes}>{content}</Link>
  if (href) return <a href={href} className={classes}>{content}</a>
  return <button type={type} className={classes} {...rest}>{content}</button>
}
