import { Link } from 'react-router-dom'

export function Logo({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <Link to="/" aria-label="Aygate Ceylon home" className={`block ${className}`}>
      <img src={`/images/logo-${tone === 'light' ? 'white' : 'green'}.webp`} alt="" className="size-full object-contain" />
    </Link>
  )
}
