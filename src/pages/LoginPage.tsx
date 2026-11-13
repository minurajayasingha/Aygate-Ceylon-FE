import { RedirectOnce } from '../components/layout/RedirectOnce'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authCopy } from '../data/content'
import { useAuth } from '../lib/auth'
import { Button, TextField } from '../components/ui'
import { AuthShell, Checkbox, FormError, GoogleButton, OrDivider, usePasswordToggle } from '../components/sections/AuthShell'

const linkClass = 'link-sweep font-medium text-gold-deep hover:text-gold'

export function LoginPage() {
  const { user, signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/account'
  const password = usePasswordToggle()
  const [mode, setMode] = useState<'signin' | 'reset' | 'sent'>('signin')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  const google = async () => {
    setGoogleBusy(true)
    setBusy(true)
    await signInWithGoogle()
    navigate(from, { replace: true })
  }

  if (user && mode === 'signin' && !busy) return <RedirectOnce to={from} />

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (mode === 'reset') {
      setMode('sent')
      return
    }
    const data = new FormData(e.currentTarget)
    setBusy(true)
    try {
      await signIn(email, String(data.get('password')))
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  const c = authCopy.login
  const resetting = mode !== 'signin'

  return (
    <AuthShell
      image="service-sourcing"
      eyebrow={resetting ? 'Account help' : c.eyebrow}
      title={resetting ? 'Reset Your Password' : c.title}
      body={resetting ? 'Enter the email you registered with and we will send you a link to choose a new password.' : c.body}
      asideEyebrow={c.asideEyebrow}
      asideTitle={c.asideTitle}
    >
      {mode === 'sent' ? (
        <div className="mt-[32px] rounded-panel border border-gold bg-cream/70 px-[24px] py-[22px]">
          <p className="font-serif text-h4 font-semibold">Check your inbox</p>
          <p className="mt-[8px] text-p4 font-light">If an account exists for <b className="font-medium">{email}</b>, a reset link is on its way.</p>
          <button type="button" onClick={() => setMode('signin')} className={`mt-[16px] text-p4 ${linkClass}`}>Back to sign in</button>
        </div>
      ) : (
        <>
        {mode === 'signin' && (
          <div className="mt-[30px] max-lg:mt-[20px]">
            <GoogleButton label="Continue with Google" onClick={google} busy={googleBusy} />
            <OrDivider>or with email</OrDivider>
          </div>
        )}
        <form onSubmit={submit} className={`grid gap-y-[16px] max-lg:gap-y-[12px] ${mode === 'reset' ? 'mt-[32px] max-lg:mt-[20px]' : ''}`}>
          <FormError>{error}</FormError>
          <TextField label="Email" name="email" type="email" placeholder="email@company.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {mode === 'signin' && (
            <>
              <TextField label="Password" name="password" type={password.type} placeholder="Your password" autoComplete="current-password" required minLength={8} trailing={password.toggle} />
              <div className="flex items-center justify-between pl-[4px] text-p5">
                <Checkbox name="remember" defaultChecked>Keep me signed in</Checkbox>
                <button type="button" onClick={() => { setError(''); setMode('reset') }} className={linkClass}>Forgot password?</button>
              </div>
            </>
          )}
          <Button type="submit" size="md" disabled={busy} className="mt-[14px] w-full disabled:opacity-70 max-lg:!h-[46px] max-lg:!text-[12px]">
            {busy && !googleBusy ? 'Signing in…' : mode === 'reset' ? 'Send Reset Link' : 'Sign In'}
          </Button>
          {mode === 'reset' && (
            <button type="button" onClick={() => setMode('signin')} className={`justify-self-center text-p4 ${linkClass}`}>Back to sign in</button>
          )}
        </form>
        </>
      )}

      <div className="mt-[34px] flex items-center gap-[16px] text-p6 tracking-[0.3em] text-muted uppercase">
        <span className="h-px flex-1 bg-gold/40" />New here<span className="h-px flex-1 bg-gold/40" />
      </div>
      <Button to="/register" variant="outline" size="md" className="mt-[20px] w-full max-lg:!h-[46px] max-lg:!text-[12px]">Create a Buyer Account</Button>
      <p className="mt-[22px] text-center text-p5 font-light text-placeholder">
        Just need a price? <Link to="/contact" className={linkClass}>Request a quote</Link> without an account.
      </p>
    </AuthShell>
  )
}
