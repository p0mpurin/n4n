'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { UserPlus, Check, X, Trash2, Music, Loader2, Search, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useProfile } from '@/lib/profile-context'
import {
  getFriendsAndRequests,
  sendFriendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  computeSharedSongs,
  type FriendRow,
} from '@/lib/friends'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FriendsPanel() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [rows, setRows] = useState<FriendRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [searchError, setSearchError] = useState('')
  const [sending, setSending] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await getFriendsAndRequests(user.id)
    setRows(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSend = async () => {
    if (!user || !searchVal.trim()) return
    setSending(true)
    setSearchError('')
    const result = await sendFriendRequest(searchVal, user.id)
    if (result.error) setSearchError(result.error)
    else {
      setSearchVal('')
      await refresh()
    }
    setSending(false)
  }

  const handleAccept = async (id: string) => {
    await acceptRequest(id)
    await refresh()
  }

  const handleDecline = async (id: string) => {
    await declineRequest(id)
    await refresh()
  }

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this friend?')) return
    await removeFriend(id)
    await refresh()
  }

  if (!user) {
    return (
      <div className="py-8 text-center">
        <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Sign in to add friends</p>
      </div>
    )
  }

  const pendingReceived = rows.filter((r) => r.status === 'pending' && r.direction === 'received')
  const pendingSent = rows.filter((r) => r.status === 'pending' && r.direction === 'sent')
  const friends = rows.filter((r) => r.status === 'accepted')

  return (
    <div className="n4n-friends-panel space-y-5">
      {/* Search / add */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add friend</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchVal}
              onChange={(e) => { setSearchVal(e.target.value); setSearchError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter username"
              className="h-8 pl-8 text-xs font-mono"
            />
          </div>
          <Button size="sm" onClick={handleSend} disabled={sending || !searchVal.trim()}>
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          </Button>
        </div>
        {searchError && <p className="text-xs text-destructive">{searchError}</p>}
      </section>

      {/* Pending received */}
      {pendingReceived.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Requests ({pendingReceived.length})
          </h2>
          {pendingReceived.map((r) => (
            <div key={r.friendship_id} className="flex items-center gap-2 rounded-lg border border-border bg-card/30 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{r.display_name || r.username}</p>
                <p className="truncate text-xs text-muted-foreground">@{r.username}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-500" onClick={() => handleAccept(r.friendship_id)}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDecline(r.friendship_id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </section>
      )}

      {/* Pending sent */}
      {pendingSent.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Sent ({pendingSent.length})
          </h2>
          {pendingSent.map((r) => (
            <div key={r.friendship_id} className="flex items-center gap-2 rounded-lg border border-border bg-card/30 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{r.display_name || r.username}</p>
                <p className="truncate text-xs text-muted-foreground">@{r.username} &middot; pending</p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDecline(r.friendship_id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </section>
      )}

      {/* Friends */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Friends ({friends.length})
        </h2>
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && friends.length === 0 && (
          <p className="text-sm text-muted-foreground">No friends yet. Search by username to add one.</p>
        )}
        {friends.map((r) => {
          const shared = computeSharedSongs(
            profile.sections as { songs: { url: string }[] }[],
            r.sections as { songs: { url: string }[] }[],
          )
          const myTotal = profile.sections.reduce((n, s) => n + s.songs.length, 0)
          const matchPct = myTotal > 0 ? Math.round((shared.count / myTotal) * 100) : 0

          return (
            <div key={r.friendship_id} className="n4n-friends-card rounded-lg border border-border bg-card/30 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Link href={`/${r.username}`} target="_blank" className="truncate text-sm font-medium hover:underline">
                    {r.display_name || r.username}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">@{r.username}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive/70 hover:text-destructive" onClick={() => handleRemove(r.friendship_id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {(shared.count > 0 || myTotal > 0) && (
                <div className="mt-2 flex items-center gap-2">
                  <Music className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {shared.count} shared song{shared.count !== 1 ? 's' : ''}
                    {myTotal > 0 && ` (${matchPct}% match)`}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
