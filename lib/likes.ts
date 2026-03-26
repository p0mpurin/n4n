import { createClient } from '@/lib/supabase/client'

export async function getLikeCount(profileId: string): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_profile_id', profileId)
  return count ?? 0
}

export async function hasUserLiked(profileId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('liked_profile_id', profileId)
    .eq('liker_id', userId)
    .maybeSingle()
  return !!data
}

export async function toggleLike(profileId: string, userId: string): Promise<{ liked: boolean; count: number }> {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('liked_profile_id', profileId)
    .eq('liker_id', userId)
    .maybeSingle()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('likes').insert({ liker_id: userId, liked_profile_id: profileId })
  }

  const count = await getLikeCount(profileId)
  return { liked: !existing, count }
}
