'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const RESERVED_USERNAMES = new Set([
  'studio', 'login', 'signup', 'preview', 'settings', 'api', 'admin',
  'about', 'help', 'terms', 'privacy', 'themes', 'u', 'app', 'auth', 'profile',
])

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const ensureProfileForUser = useCallback(
    async (u: User, preferredUsername?: string): Promise<{ error?: string }> => {
      const usernameFromMeta =
        typeof u.user_metadata?.username === 'string' ? u.user_metadata.username : ''
      const normalizedPreferred = (preferredUsername || usernameFromMeta || u.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 20)
      const fallback = `${normalizedPreferred || 'user'}-${u.id.slice(0, 6)}`
      const baseUsername = /^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/.test(normalizedPreferred)
        ? normalizedPreferred
        : fallback

      // If profile already exists, nothing to do.
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', u.id)
        .maybeSingle()
      if (existing) return {}

      let candidate = baseUsername
      for (let i = 0; i < 5; i += 1) {
        const { data: usernameTaken } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', candidate)
          .maybeSingle()
        if (!usernameTaken && !RESERVED_USERNAMES.has(candidate)) break
        candidate = `${baseUsername.slice(0, 14)}-${Math.random().toString(36).slice(2, 6)}`
      }

      const { error } = await supabase.from('profiles').insert({
        id: u.id,
        username: candidate,
        display_name: candidate,
      })
      if (error) return { error: error.message }
      return {}
    },
    [supabase],
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = useCallback(
    async (email: string, password: string, username: string): Promise<{ error?: string }> => {
      const handle = username.toLowerCase().trim()

      if (!/^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/.test(handle)) {
        return { error: 'Username must be 3-20 characters: lowercase letters, numbers, hyphens, underscores.' }
      }
      if (RESERVED_USERNAMES.has(handle)) {
        return { error: 'That username is reserved.' }
      }

      // Check availability
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', handle)
        .maybeSingle()

      if (existing) {
        return { error: 'Username is already taken.' }
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: handle } },
      })
      if (authError) return { error: authError.message }
      if (!data.user) return { error: 'Sign-up failed. Please try again.' }

      // If email confirmation is enabled, there may be no authenticated session yet.
      // In that case, profile creation is deferred until first successful sign-in.
      if (data.session) {
        const ensured = await ensureProfileForUser(data.user, handle)
        if (ensured.error) return ensured
      }

      return {}
    },
    [supabase, ensureProfileForUser],
  )

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      if (data.user) {
        const ensured = await ensureProfileForUser(data.user)
        if (ensured.error) return ensured
      }
      return {}
    },
    [supabase, ensureProfileForUser],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
