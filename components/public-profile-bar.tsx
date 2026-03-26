'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Music, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toggleLike, getLikeCount, hasUserLiked } from '@/lib/likes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Props {
  profileId: string
  profileUsername: string
  themeCss?: string
}

export function PublicProfileBar({ profileId, profileUsername, themeCss = '' }: Props) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none')

  useEffect(() => {
    if (!user) return
    hasUserLiked(profileId, user.id).then(setLiked)

    const supabase = createClient()
    supabase
      .from('friendships')
      .select('status')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${profileId}),and(requester_id.eq.${profileId},addressee_id.eq.${user.id})`)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setFriendStatus('none')
        else if (data.status === 'accepted') setFriendStatus('friends')
        else setFriendStatus('pending')
      })
  }, [user, profileId])

  const handleLike = async () => {
    if (!user) return
    const result = await toggleLike(profileId, user.id)
    setLiked(result.liked)
  }

  const handleAddFriend = async () => {
    if (!user) return
    const supabase = createClient()
    await supabase.from('friendships').insert({
      requester_id: user.id,
      addressee_id: profileId,
    })
    setFriendStatus('pending')
  }

  const isOwnProfile = user?.id === profileId

  return (
    <div className="n4n-public-bar fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-md">
      {!!themeCss.trim() && <style>{themeCss}</style>}
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 pr-1">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white">
            <Music className="h-4 w-4" />
            Niche4Niche
          </Link>
          <span className="text-xs text-white/60">@{profileUsername}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={!user || isOwnProfile}
            style={{ display: 'inline-flex', visibility: 'visible', opacity: 1 }}
            className={`n4n-public-bar-like inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              liked
                ? 'bg-pink-500/20 text-pink-400'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            } disabled:opacity-50 disabled:cursor-default`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </button>

          {user && !isOwnProfile && friendStatus === 'none' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFriend}
              className="n4n-public-bar-friend h-auto rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20 hover:text-white"
            >
              <UserPlus className="mr-1 h-3.5 w-3.5" />
              Add friend
            </Button>
          )}
          {friendStatus === 'pending' && (
            <span className="rounded-full bg-yellow-500/15 px-3 py-1.5 text-xs text-yellow-400/80">
              Request sent
            </span>
          )}
          {friendStatus === 'friends' && (
            <span className="rounded-full bg-green-500/15 px-3 py-1.5 text-xs text-green-400/80">
              Friends
            </span>
          )}

          {!user && (
            <Link
              href="/signup"
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              Sign up to like
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
