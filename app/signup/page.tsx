'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Music, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RESERVED = new Set([
  'studio', 'login', 'signup', 'preview', 'settings', 'api', 'admin',
  'about', 'help', 'terms', 'privacy', 'u', 'app', 'auth', 'profile',
])

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateUsername = (raw: string) => {
    const v = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
    setUsername(v)

    if (v.length < 3) {
      setUsernameStatus('idle')
      return
    }
    if (!/^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/.test(v)) {
      setUsernameStatus('invalid')
      return
    }
    if (RESERVED.has(v)) {
      setUsernameStatus('taken')
      return
    }

    setUsernameStatus('checking')
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('id')
      .eq('username', v)
      .maybeSingle()
      .then(({ data }) => {
        setUsernameStatus(data ? 'taken' : 'available')
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (usernameStatus !== 'available') {
      setError('Choose an available username first.')
      return
    }
    setLoading(true)

    const result = await signUp(email, password, username)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/studio')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
            <Music className="h-6 w-6" />
            Niche4Niche
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Claim your page</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick a username and start building</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => validateUsername(e.target.value)}
                placeholder="your-handle"
                className="pl-7 font-mono"
                required
                autoFocus
                minLength={3}
                maxLength={20}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {usernameStatus === 'available' && <Check className="h-4 w-4 text-green-500" />}
                {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <X className="h-4 w-4 text-destructive" />}
              </div>
            </div>
            {usernameStatus === 'available' && (
              <p className="text-xs text-green-500">niche4niche.com/{username} is yours</p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-xs text-destructive">That username is taken or reserved.</p>
            )}
            {usernameStatus === 'invalid' && (
              <p className="text-xs text-destructive">3-20 chars, lowercase letters, numbers, hyphens, underscores.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading || usernameStatus !== 'available'}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
