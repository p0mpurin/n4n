'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserPlus, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  acceptRequest,
  declineRequest,
  getFriendshipWithProfile,
  sendFriendRequest,
  type FriendshipWithProfileStatus,
} from '@/lib/friends'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  profileId: string
  profileUsername: string
  className?: string
}

export function PublicFriendAction({ profileId, profileUsername, className }: Props) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const [state, setState] = useState<FriendshipWithProfileStatus>({ status: 'none' })
  const [fetching, setFetching] = useState(false)
  const [acting, setActing] = useState(false)
  const [reqErr, setReqErr] = useState('')

  const refresh = useCallback(async () => {
    if (!user || user.id === profileId) return
    setFetching(true)
    const s = await getFriendshipWithProfile(user.id, profileId)
    setState(s)
    setFetching(false)
  }, [user, profileId])

  useEffect(() => {
    if (loading) return
    if (!user || user.id === profileId) {
      setState({ status: 'none' })
      return
    }
    void refresh()
  }, [loading, user, profileId, refresh])

  const ownProfile = Boolean(user && user.id === profileId)
  if (ownProfile) return null

  const next = encodeURIComponent(pathname || '/')

  return (
    <div
      className={cn(
        'n4n-public-chrome pointer-events-auto fixed bottom-4 right-4 z-[100] flex flex-wrap items-center justify-end gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm',
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          …
        </span>
      ) : !user ? (
        <Button size="sm" className="h-8 text-xs" asChild>
          <Link href={`/login?next=${next}`}>
            <UserPlus className="mr-1 h-3.5 w-3.5" />
            Sign in to add friend
          </Link>
        </Button>
      ) : fetching ? (
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading…
        </span>
      ) : state.status === 'accepted' ? (
        <span className="text-xs text-muted-foreground">
          You&apos;re friends ·{' '}
          <Link href="/studio" className="font-medium text-foreground underline-offset-2 hover:underline">
            Studio
          </Link>
        </span>
      ) : state.status === 'pending_sent' ? (
        <span className="text-xs text-muted-foreground">Request sent</span>
      ) : state.status === 'pending_received' ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Wants to be friends</span>
          <Button
            size="sm"
            className="h-7 text-xs"
            disabled={acting}
            onClick={async () => {
              setActing(true)
              await acceptRequest(state.friendship_id)
              setActing(false)
              await refresh()
            }}
          >
            {acting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Check className="mr-1 h-3.5 w-3.5" />
                Accept
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            disabled={acting}
            onClick={async () => {
              setActing(true)
              await declineRequest(state.friendship_id)
              setActing(false)
              await refresh()
            }}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Decline
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-1">
          {reqErr ? <p className="max-w-[220px] text-right text-[10px] text-destructive">{reqErr}</p> : null}
          <Button
            size="sm"
            className="h-8 text-xs"
            disabled={acting}
            onClick={async () => {
              if (!user) return
              setReqErr('')
              setActing(true)
              const r = await sendFriendRequest(profileUsername, user.id)
              setActing(false)
              if (r.error) {
                setReqErr(r.error)
                return
              }
              await refresh()
            }}
          >
            {acting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="mr-1 h-3.5 w-3.5" />}
            Add friend
          </Button>
        </div>
      )}
    </div>
  )
}
