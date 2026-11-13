import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

/**
 * Sign-in state for the UI prototype. There is no backend yet (Aygate-Ceylon-BE is still empty),
 * so accounts live in this browser's localStorage and any password of 8+ characters is accepted.
 * When the API exists, replace the bodies of signIn / register / update / signOut with real calls;
 * the pages only use this hook, so nothing else needs to change.
 */
export type Account = {
  name: string
  email: string
  company: string
  country: string
  whatsapp: string
  buyerType: string
  provider?: 'email' | 'google'
}

type Auth = {
  user: Account | null
  signIn: (email: string, password: string) => Promise<void>
  register: (account: Account, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  update: (changes: Partial<Account>) => void
  signOut: () => void
}

const KEY = 'aygate.account'
const AuthContext = createContext<Auth | null>(null)

const load = (): Account | null => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Account) : null
  } catch {
    return null
  }
}

const save = (account: Account | null) => {
  try {
    if (account) localStorage.setItem(KEY, JSON.stringify(account))
    else localStorage.removeItem(KEY)
  } catch {
    // Private mode or blocked storage: stay signed in for this visit only.
  }
}

// A short pause so the buttons' busy state is visible, like a real request.
const wait = () => new Promise((r) => setTimeout(r, 600))

const nameFromEmail = (email: string) =>
  email.split('@')[0].split(/[._-]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') || 'Buyer'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(load)

  const set = useCallback((account: Account | null) => {
    save(account)
    setUser(account)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    await wait()
    if (password.length < 8) throw new Error('That email and password do not match.')
    const known = load()
    set(known && known.email.toLowerCase() === email.toLowerCase()
      ? known
      : { name: nameFromEmail(email), email, company: '', country: '', whatsapp: '', buyerType: '' })
  }, [set])

  const register = useCallback(async (account: Account, password: string) => {
    await wait()
    if (password.length < 8) throw new Error('Use at least 8 characters for your password.')
    set(account)
  }, [set])

  // Prototype stand-in. With the backend this becomes Google Identity Services (or a redirect to the
  // backend's /auth/google route); the returned profile then replaces the demo one below.
  const signInWithGoogle = useCallback(async () => {
    await wait()
    const known = load()
    set(known?.provider === 'google' ? known : { name: 'Google Buyer', email: 'buyer@gmail.com', company: '', country: '', whatsapp: '', buyerType: '', provider: 'google' })
  }, [set])

  const update = useCallback((changes: Partial<Account>) => {
    setUser((u) => {
      const next = u && { ...u, ...changes }
      save(next)
      return next
    })
  }, [])

  const signOut = useCallback(() => set(null), [set])

  const value = useMemo(() => ({ user, signIn, register, signInWithGoogle, update, signOut }), [user, signIn, register, signInWithGoogle, update, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
