import type { ReactNode } from 'react'

const sizes = {
  xl: 'text-[14px] leading-[16.6px] tracking-[0.52em]',
  lg: 'text-[12px] leading-[14.2px] tracking-[0.52em]',
  md: 'text-[11px] leading-[13px] tracking-[0.52em]',
}

const mobile = {
  md: 'max-lg:text-[11px] max-lg:leading-[13px] max-lg:tracking-[0.18em]',
  sm: 'max-lg:text-[10px] max-lg:leading-[11.8px] max-lg:tracking-[0.18em]',
}

type Props = {
  children: ReactNode
  size?: keyof typeof sizes
  mobileSize?: keyof typeof mobile
  className?: string
}

export function Eyebrow({ children, size = 'xl', mobileSize = 'sm', className = 'text-gold' }: Props) {
  return <p className={`whitespace-nowrap uppercase ${sizes[size]} ${mobile[mobileSize]} ${className}`}>{children}</p>
}
