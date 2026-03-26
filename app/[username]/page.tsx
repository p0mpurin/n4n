import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  generateProfileHtml,
  generateProfileCss,
  finalizeProfileHtmlBody,
  composeProfileStylesheet,
} from '@/lib/profile-template'
import { incrementView } from '@/lib/views'
import { PublicLikeEnhancer } from '@/components/public-like-enhancer'
import { PublicFriendAction } from '@/components/public-friend-action'
import { SongScrollNavMount } from '@/components/song-scroll-nav-mount'
import type { UserProfile, SongSection } from '@/lib/mock-data'
import { backgroundImageFromRow, mergeProfileStyle } from '@/lib/profile-row-helpers'

export const dynamic = 'force-dynamic'

const RESERVED = new Set([
  'studio', 'login', 'signup', 'preview', 'settings', 'api', 'admin',
  'about', 'help', 'terms', 'privacy', 'themes',
])

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params

  if (RESERVED.has(username)) notFound()

  const supabase = await createClient()

  const { data: row } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!row) notFound()

  // Increment view count (fire-and-forget)
  incrementView(row.id).catch(() => {})

  // Get like count
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_profile_id', row.id)
  const [{ count: sentAccepted }, { count: receivedAccepted }] = await Promise.all([
    supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .eq('requester_id', row.id)
      .eq('status', 'accepted'),
    supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .eq('addressee_id', row.id)
      .eq('status', 'accepted'),
  ])

  const mergedStyle = mergeProfileStyle(row.style)
  const bgUrl = backgroundImageFromRow(row as Record<string, unknown>)

  // Build srcDoc the same way the studio does (keep style.backgroundImage in sync for resolveBackgroundVars)
  const fakeProfile: UserProfile = {
    id: row.id,
    username: row.username,
    displayName: row.display_name || '',
    avatar: row.avatar_url || '',
    backgroundImage: bgUrl,
    bio: row.bio || '',
    joinedAt: row.created_at,
    useCustomPage: row.use_custom_page,
    customPageHTML: row.custom_page_html || '',
    customPageCSS: row.custom_page_css || '',
    sections: Array.isArray(row.sections) ? (row.sections as SongSection[]) : [],
    style: { ...mergedStyle, backgroundImage: bgUrl || mergedStyle.backgroundImage || '' },
    achievements: [],
    friends: [],
    stats: {
      totalSongs: 0,
      totalFriends: (sentAccepted ?? 0) + (receivedAccepted ?? 0),
      achievementsUnlocked: 0,
      profileViews: row.view_count || 0,
      likesReceived: likeCount ?? 0,
    },
  }

  const rawHtml =
    fakeProfile.useCustomPage && fakeProfile.customPageHTML.trim()
      ? fakeProfile.customPageHTML
      : generateProfileHtml(fakeProfile)
  const htmlBody = finalizeProfileHtmlBody(fakeProfile, rawHtml)
  const cssText = composeProfileStylesheet(
    fakeProfile.customPageCSS.trim() ? fakeProfile.customPageCSS : generateProfileCss(),
    fakeProfile,
  )

  return (
    <div className="n4n-public-shell relative min-h-screen">
      <style>{cssText}</style>
      <div className="n4n-profile-root block w-full max-w-full min-w-0" dangerouslySetInnerHTML={{ __html: htmlBody }} />
      <SongScrollNavMount />
      <PublicLikeEnhancer profileId={row.id} initialLikes={likeCount ?? 0} />
      <PublicFriendAction profileId={row.id} profileUsername={row.username} />
    </div>
  )
}
