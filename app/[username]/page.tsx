import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateProfileHtml, generateProfileCss } from '@/lib/profile-template'
import { incrementView } from '@/lib/views'
import { PublicProfileBar } from '@/components/public-profile-bar'
import type { UserProfile, SongSection, ProfileStyle } from '@/lib/mock-data'
import { defaultStyle } from '@/lib/mock-data'

const RESERVED = new Set([
  'studio', 'login', 'signup', 'preview', 'settings', 'api', 'admin',
  'about', 'help', 'terms', 'privacy',
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

  // Build srcDoc the same way the studio does
  const fakeProfile: UserProfile = {
    id: row.id,
    username: row.username,
    displayName: row.display_name || '',
    avatar: row.avatar_url || '',
    bio: row.bio || '',
    joinedAt: row.created_at,
    useCustomPage: row.use_custom_page,
    customPageHTML: row.custom_page_html || '',
    customPageCSS: row.custom_page_css || '',
    sections: Array.isArray(row.sections) ? (row.sections as SongSection[]) : [],
    style: row.style && typeof row.style === 'object'
      ? { ...defaultStyle, ...(row.style as Partial<ProfileStyle>) }
      : defaultStyle,
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

  const htmlBody =
    fakeProfile.useCustomPage && fakeProfile.customPageHTML.trim()
      ? fakeProfile.customPageHTML
      : generateProfileHtml(fakeProfile)
  const cssText =
    fakeProfile.customPageCSS.trim() ? fakeProfile.customPageCSS : generateProfileCss()

  const srcDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssText}\nbody{padding-bottom:60px;}</style></head><body>${htmlBody}</body></html>`

  return (
    <div className="n4n-public-shell relative h-screen w-screen bg-black">
      <iframe
        title={`${fakeProfile.displayName}'s profile`}
        className="h-full w-full border-0"
        srcDoc={srcDoc}
      />
      <PublicProfileBar
        profileId={row.id}
        profileUsername={row.username}
        themeCss={cssText}
      />
    </div>
  )
}
