import { useState, type ReactNode } from 'react'
import { authCopy } from '../../data/content'
import { Eyebrow, Icon } from '../ui'

type Props = {
  image: string
  eyebrow: string
  title: string
  body: string
  asideEyebrow: string
  asideTitle: string
  children: ReactNode
}

/**
 * Login and registration frame. Not in Figma, so it borrows the quote popup's look:
 * a photo on the left and the leaf-textured ivory panel on the right. Phones drop the photo.
 */
export function AuthShell({ image, eyebrow, title, body, asideEyebrow, asideTitle, children }: Props) {
  return (
    <section className="mx-auto max-w-[1440px] px-[98px] pt-[170px] pb-[110px] max-lg:px-0 max-lg:pt-[70px] max-lg:pb-0">
      <div className="flex min-h-[640px] overflow-hidden rounded-panel shadow-feature max-lg:min-h-0 max-lg:rounded-none max-lg:shadow-none">
        <aside className="relative w-[480px] shrink-0 overflow-hidden bg-ink text-white max-lg:hidden">
          <img src={`/images/${image}.webp`} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/5" />
          <div className="absolute inset-x-[40px] bottom-[44px]">
            <Eyebrow size="lg">{asideEyebrow}</Eyebrow>
            <p className="mt-[14px] font-serif text-h3 font-medium">{asideTitle}</p>
            <span className="mt-[18px] block h-[2px] w-[33px] bg-gold" />
            <ul className="mt-[18px] space-y-[10px] text-p4 font-light">
              {authCopy.benefits.map((b) => (
                <li key={b} className="flex items-center gap-[10px]">
                  <Icon name="leaf" size={16} className="text-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="relative min-w-0 flex-1 bg-ivory px-[64px] pt-[52px] pb-[48px] max-lg:px-[18px] max-lg:pt-[36px] max-lg:pb-[56px]" style={{ backgroundImage: 'url(/images/bg-leaf-panel.webp)', backgroundSize: 'cover' }}>
          <div className="mx-auto max-w-[560px]">
            <Eyebrow size="md" mobileSize="sm">{eyebrow}</Eyebrow>
            <h1 className="mt-[12px] font-serif text-h1 font-normal max-lg:text-h3 max-lg:font-medium">{title}</h1>
            <p className="mt-[10px] text-p3 font-light max-lg:mt-[6px] max-lg:text-p6">{body}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Password input with a show/hide toggle. */
export function usePasswordToggle() {
  const [shown, setShown] = useState(false)
  const toggle = (
    <button type="button" onClick={() => setShown((v) => !v)} aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown} className="icon-lift text-muted hover:text-gold">
      <Icon name={shown ? 'eye-off' : 'eye'} size={20} />
    </button>
  )
  return { type: shown ? 'text' : 'password', toggle }
}

/** "Continue with Google" button, following Google's sign-in button guidelines (white, G mark, plain label). */
export function GoogleButton({ label, onClick, busy }: { label: string; onClick: () => void; busy?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} className="flex h-[51px] w-full items-center justify-center gap-[12px] rounded-control border border-[#dadce0] bg-white text-[16px] leading-[19px] font-medium text-[#3c4043] shadow-[0_1px_2px_rgb(0_0_0/0.08)] transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-[1px] hover:bg-[#f8f9fa] hover:shadow-[0_6px_14px_-8px_rgb(0_0_0/0.3)] active:translate-y-0 disabled:opacity-70 max-lg:h-[46px] max-lg:text-[13px]">
      <svg viewBox="0 0 48 48" aria-hidden className="size-[20px]">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
      {busy ? 'Connecting…' : label}
    </button>
  )
}

export function OrDivider({ children }: { children: string }) {
  return (
    <div className="my-[22px] flex items-center gap-[16px] text-p6 tracking-[0.3em] text-muted uppercase max-lg:my-[16px]">
      <span className="h-px flex-1 bg-gold/40" />{children}<span className="h-px flex-1 bg-gold/40" />
    </div>
  )
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null
  return <p role="alert" className="rounded-field border border-[#b4441f]/40 bg-[#b4441f]/8 px-[16px] py-[10px] text-p5 text-[#8f3317]">{children}</p>
}

export function Checkbox({ children, ...rest }: { children: ReactNode } & React.ComponentProps<'input'>) {
  return (
    <label className="flex cursor-pointer items-start gap-[10px] text-p5 font-light select-none">
      <input type="checkbox" className="mt-[1px] size-[16px] shrink-0 cursor-pointer accent-gold" {...rest} />
      <span>{children}</span>
    </label>
  )
}
