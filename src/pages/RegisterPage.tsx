import { RedirectOnce } from '../components/layout/RedirectOnce'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authCopy, buyerTypes } from '../data/content'
import { useAuth } from '../lib/auth'
import { Button, SelectField, TextField } from '../components/ui'
import { AuthShell, Checkbox, FormError, GoogleButton, OrDivider, usePasswordToggle } from '../components/sections/AuthShell'

const linkClass = 'link-sweep font-medium text-gold-deep hover:text-gold'

export function RegisterPage() {
  const { user, register, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const password = usePasswordToggle()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  const google = async () => {
    setGoogleBusy(true)
    setBusy(true)
    await signInWithGoogle()
    navigate('/account', { replace: true })
  }

  if (user && !busy) return <RedirectOnce to="/account" />

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (d.password.length < 8) return setError('Use at least 8 characters for your password.')
    if (d.password !== d.confirm) return setError('The two passwords do not match.')
    setBusy(true)
    try {
      await register({ name: d.name, company: d.company, email: d.email, country: d.country, whatsapp: d.whatsapp, buyerType: d.buyerType, provider: 'email' }, d.password)
      navigate('/account', { replace: true })
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  const c = authCopy.register
  const half = 'grid grid-cols-2 gap-x-[20px] max-lg:grid-cols-1 max-lg:gap-y-[12px]'

  return (
    <AuthShell image="service-bulk" {...c}>
      <div className="mt-[28px] max-lg:mt-[20px]">
        <GoogleButton label="Sign up with Google" onClick={google} busy={googleBusy} />
        <OrDivider>or with email</OrDivider>
      </div>
      <form onSubmit={submit} className="grid gap-y-[14px] max-lg:gap-y-[12px]">
        <FormError>{error}</FormError>
        <div className={half}>
          <TextField label="Full Name" name="name" placeholder="Your full name" autoComplete="name" required />
          <TextField label="Company" name="company" placeholder="Company name" autoComplete="organization" />
        </div>
        <div className={half}>
          <TextField label="Email" name="email" type="email" placeholder="email@company.com" autoComplete="email" required />
          <TextField label="WhatsApp" name="whatsapp" type="tel" placeholder="+94" autoComplete="tel" />
        </div>
        <div className={half}>
          <TextField label="Country" name="country" placeholder="Country" autoComplete="country-name" required />
          <SelectField label="I am a" name="buyerType" options={buyerTypes} />
        </div>
        <div className={half}>
          <TextField label="Password" name="password" type={password.type} placeholder="8+ characters" autoComplete="new-password" required minLength={8} trailing={password.toggle} />
          <TextField label="Confirm Password" name="confirm" type={password.type} placeholder="Repeat password" autoComplete="new-password" required />
        </div>
        <div className="mt-[6px] grid gap-y-[10px] pl-[4px]">
          <Checkbox name="terms" required>I agree to the terms of use and to Aygate Ceylon contacting me about my inquiries.</Checkbox>
          <Checkbox name="news">Send me occasional updates on harvests, grades and availability.</Checkbox>
        </div>
        <Button type="submit" size="md" disabled={busy} className="mt-[14px] w-full disabled:opacity-70 max-lg:!h-[46px] max-lg:!text-[12px]">
          {busy && !googleBusy ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <p className="mt-[24px] text-center text-p4 font-light">
        Already registered? <Link to="/login" className={linkClass}>Sign in</Link>
      </p>
    </AuthShell>
  )
}
