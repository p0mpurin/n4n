import { createClient } from '@/lib/supabase/client'

export interface FriendRow {
  friendship_id: string
  friend_id: string
  username: string
  display_name: string
  avatar_url: string
  status: 'pending' | 'accepted' | 'declined'
  direction: 'sent' | 'received'
  sections: unknown[]
}

export async function sendFriendRequest(username: string, myId: string): Promise<{ error?: string }> {
  const supabase = createClient()

  const { data: target } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle()

  if (!target) return { error: 'User not found.' }
  if (target.id === myId) return { error: "You can't friend yourself." }

  // Check existing
  const { data: existing } = await supabase
    .from('friendships')
    .select('id, status')
    .or(`and(requester_id.eq.${myId},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${myId})`)
    .maybeSingle()

  if (existing) {
    if (existing.status === 'accepted') return { error: 'Already friends.' }
    if (existing.status === 'pending') return { error: 'Request already pending.' }
  }

  const { error } = await supabase.from('friendships').insert({
    requester_id: myId,
    addressee_id: target.id,
  })

  if (error) return { error: error.message }
  return {}
}

export async function acceptRequest(friendshipId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
}

export async function declineRequest(friendshipId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
}

export async function removeFriend(friendshipId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
}

export async function getFriendsAndRequests(myId: string): Promise<FriendRow[]> {
  const supabase = createClient()

  const { data: rows } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id, status')
    .or(`requester_id.eq.${myId},addressee_id.eq.${myId}`)

  if (!rows || rows.length === 0) return []

  const friendIds = rows.map((r) =>
    r.requester_id === myId ? r.addressee_id : r.requester_id,
  )

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, sections')
    .in('id', friendIds)

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

  return rows
    .map((r) => {
      const friendId = r.requester_id === myId ? r.addressee_id : r.requester_id
      const p = profileMap.get(friendId)
      if (!p) return null
      return {
        friendship_id: r.id,
        friend_id: friendId,
        username: p.username,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        status: r.status as FriendRow['status'],
        direction: r.requester_id === myId ? 'sent' : 'received',
        sections: Array.isArray(p.sections) ? p.sections : [],
      } satisfies FriendRow
    })
    .filter(Boolean) as FriendRow[]
}

export function computeSharedSongs(
  mySections: { songs: { url: string }[] }[],
  theirSections: { songs: { url: string }[] }[],
): { count: number; urls: string[] } {
  const myUrls = new Set(mySections.flatMap((s) => s.songs.map((x) => x.url)))
  const shared = theirSections
    .flatMap((s) => s.songs.map((x) => x.url))
    .filter((u) => myUrls.has(u))
  const unique = [...new Set(shared)]
  return { count: unique.length, urls: unique }
}
