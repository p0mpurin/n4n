'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import {
  createEmptyUserProfile,
  defaultStyle,
  type UserProfile,
  type ProfileStyle,
  type SongSection,
  type Song,
  type Friend,
} from './mock-data'
import { generateProfileCss, generateProfileHtml } from './profile-template'
import { useAuth } from './auth-context'
import { createClient } from './supabase/client'

interface ProfileContextType {
  profile: UserProfile
  style: ProfileStyle
  isEditMode: boolean
  setEditMode: (mode: boolean) => void
  updateStyle: (updates: Partial<ProfileStyle>) => void
  resetStyle: () => void
  updateIdentity: (updates: Partial<Pick<UserProfile, 'username' | 'displayName' | 'bio' | 'avatar'>>) => void
  addSong: (song: Song, sectionId: string) => void
  removeSong: (songId: string, sectionId: string) => void
  reorderSongs: (sectionId: string, fromIndex: number, toIndex: number) => void
  addSection: (name: string, mood?: string) => void
  removeSection: (sectionId: string) => void
  updateSection: (sectionId: string, updates: Partial<SongSection>) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  addFriend: (friend: Friend) => void
  removeFriend: (friendId: string) => void
  getSharedSongs: (friendId: string) => Song[]
  setCustomPageCode: (html: string, css: string) => void
  setUseCustomPage: (value: boolean, snapshotHtml?: string) => void
  regenerateFromData: () => void
  buildSrcDoc: () => string
  ready: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)
const STORAGE_KEY = 'niche4niche-user-profile-v1'
const SAVE_DEBOUNCE_MS = 1500

function profileFromRow(row: Record<string, unknown>): Partial<UserProfile> {
  const sections = Array.isArray(row.sections) ? (row.sections as SongSection[]) : []
  const totalSongs = sections.reduce((n, s) => n + (Array.isArray(s.songs) ? s.songs.length : 0), 0)
  return {
    id: row.id as string,
    username: row.username as string,
    displayName: (row.display_name as string) || '',
    avatar: (row.avatar_url as string) || '',
    bio: (row.bio as string) || '',
    useCustomPage: row.use_custom_page as boolean,
    customPageHTML: (row.custom_page_html as string) || '',
    customPageCSS: (row.custom_page_css as string) || '',
    sections,
    style: row.style && typeof row.style === 'object'
      ? { ...defaultStyle, ...(row.style as Partial<ProfileStyle>) }
      : defaultStyle,
    stats: {
      totalSongs,
      totalFriends: 0,
      achievementsUnlocked: 0,
      profileViews: (row.view_count as number) || 0,
      likesReceived: 0,
    },
  }
}

function profileToRow(p: UserProfile) {
  return {
    display_name: p.displayName,
    avatar_url: p.avatar,
    bio: p.bio,
    use_custom_page: p.useCustomPage,
    custom_page_html: p.customPageHTML,
    custom_page_css: p.customPageCSS,
    sections: p.sections,
    style: p.style,
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(() => createEmptyUserProfile())
  const [ready, setReady] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAuthed = !!user

  const style = profile.style

  const persistNow = useCallback(
    async (nextProfile: UserProfile) => {
      if (isAuthed && user) {
        const supabase = createClient()
        await supabase
          .from('profiles')
          .update(profileToRow(nextProfile))
          .eq('id', user.id)
      } else {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile))
        } catch { /* ignore */ }
      }
    },
    [isAuthed, user],
  )

  // --- Hydrate from Supabase (authed) or localStorage (guest) ---
  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function load() {
      if (user) {
        const supabase = createClient()
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        const [{ count: likesCount }, { count: sentAccepted }, { count: receivedAccepted }] = await Promise.all([
          supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('liked_profile_id', user.id),
          supabase
            .from('friendships')
            .select('*', { count: 'exact', head: true })
            .eq('requester_id', user.id)
            .eq('status', 'accepted'),
          supabase
            .from('friendships')
            .select('*', { count: 'exact', head: true })
            .eq('addressee_id', user.id)
            .eq('status', 'accepted'),
        ])

        if (!cancelled && data) {
          const partial = profileFromRow(data)
          setProfile((prev) => ({
            ...prev,
            ...partial,
            stats: {
              ...prev.stats,
              ...(partial.stats || {}),
              totalFriends: (sentAccepted ?? 0) + (receivedAccepted ?? 0),
              likesReceived: likesCount ?? 0,
            },
          }))
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<UserProfile>
            if (parsed && typeof parsed === 'object') {
              setProfile((prev) => ({
                ...prev,
                ...parsed,
                style: { ...prev.style, ...(parsed.style || {}) },
                sections: Array.isArray(parsed.sections) ? parsed.sections : prev.sections,
                achievements: Array.isArray(parsed.achievements) ? parsed.achievements : prev.achievements,
                friends: Array.isArray(parsed.friends) ? parsed.friends : prev.friends,
                stats: { ...prev.stats, ...(parsed.stats || {}) },
                customPageHTML: typeof parsed.customPageHTML === 'string' ? parsed.customPageHTML : prev.customPageHTML,
                customPageCSS: typeof parsed.customPageCSS === 'string' ? parsed.customPageCSS : prev.customPageCSS,
                useCustomPage: typeof parsed.useCustomPage === 'boolean' ? parsed.useCustomPage : prev.useCustomPage,
              }))
            }
          }
        } catch { /* ignore */ }
      }
      if (!cancelled) setReady(true)
    }

    load()
    return () => { cancelled = true }
  }, [user, authLoading])

  // --- Persist: debounced save to Supabase or localStorage ---
  useEffect(() => {
    if (!ready) return

    if (saveTimer.current) clearTimeout(saveTimer.current)

    saveTimer.current = setTimeout(() => {
      if (isAuthed && user) {
        const supabase = createClient()
        supabase
          .from('profiles')
          .update(profileToRow(profile))
          .eq('id', user.id)
          .then(() => { /* fire and forget */ })
      } else {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
        } catch { /* ignore */ }
      }
    }, SAVE_DEBOUNCE_MS)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [profile, ready, isAuthed, user])

  // --- All the same mutation callbacks as before ---

  const updateStyle = useCallback((updates: Partial<ProfileStyle>) => {
    setProfile((prev) => ({ ...prev, style: { ...prev.style, ...updates } }))
  }, [])

  const resetStyle = useCallback(() => {
    setProfile((prev) => ({ ...prev, style: defaultStyle }))
  }, [])

  const updateIdentity = useCallback((updates: Partial<Pick<UserProfile, 'username' | 'displayName' | 'bio' | 'avatar'>>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const addSong = useCallback((song: Song, sectionId: string) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, songs: [...s.songs, song] } : s
      ),
      stats: { ...prev.stats, totalSongs: prev.stats.totalSongs + 1 },
    }))
  }, [])

  const removeSong = useCallback((songId: string, sectionId: string) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, songs: s.songs.filter((x) => x.id !== songId) } : s
      ),
      stats: { ...prev.stats, totalSongs: Math.max(0, prev.stats.totalSongs - 1) },
    }))
  }, [])

  const reorderSongs = useCallback((sectionId: string, fromIndex: number, toIndex: number) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId) return s
        const arr = [...s.songs]
        const [removed] = arr.splice(fromIndex, 1)
        arr.splice(toIndex, 0, removed)
        return { ...s, songs: arr }
      }),
    }))
  }, [])

  const addSection = useCallback((name: string, mood?: string) => {
    setProfile((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: `sec-${Date.now()}`, name, songs: [], mood }],
    }))
  }, [])

  const removeSection = useCallback((sectionId: string) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }))
  }, [])

  const updateSection = useCallback((sectionId: string, updates: Partial<SongSection>) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    }))
  }, [])

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setProfile((prev) => {
      const arr = [...prev.sections]
      const [removed] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, removed)
      return { ...prev, sections: arr }
    })
  }, [])

  const addFriend = useCallback((friend: Friend) => {
    setProfile((prev) => ({
      ...prev,
      friends: [...prev.friends, friend],
      stats: { ...prev.stats, totalFriends: prev.stats.totalFriends + 1 },
    }))
  }, [])

  const removeFriend = useCallback((friendId: string) => {
    setProfile((prev) => ({
      ...prev,
      friends: prev.friends.filter((f) => f.id !== friendId),
      stats: { ...prev.stats, totalFriends: Math.max(0, prev.stats.totalFriends - 1) },
    }))
  }, [])

  const getSharedSongs = useCallback(
    (friendId: string): Song[] => {
      const allSongs = profile.sections.flatMap((s) => s.songs)
      const friend = profile.friends.find((f) => f.id === friendId)
      const count = friend?.sharedSongs || 0
      return allSongs.slice(0, Math.min(count, allSongs.length))
    },
    [profile.sections, profile.friends],
  )

  const setCustomPageCode = useCallback((html: string, css: string) => {
    setProfile((prev) => ({
      ...prev,
      customPageCSS: css,
      ...(prev.useCustomPage ? { customPageHTML: html } : {}),
    }))
  }, [])

  const setUseCustomPage = useCallback((value: boolean, snapshotHtml?: string) => {
    setProfile((prev) => ({
      ...prev,
      useCustomPage: value,
      ...(value && typeof snapshotHtml === 'string' ? { customPageHTML: snapshotHtml } : {}),
    }))
  }, [])

  const regenerateFromData = useCallback(() => {
    setProfile((prev) => {
      const next = {
        ...prev,
        useCustomPage: false,
        customPageHTML: '',
        customPageCSS: generateProfileCss(),
      }
      // Regenerate should be immediately reflected on public page too.
      persistNow(next).catch(() => {})
      return next
    })
  }, [persistNow])

  const buildSrcDoc = useCallback((): string => {
    const htmlBody =
      profile.useCustomPage && profile.customPageHTML.trim()
        ? profile.customPageHTML
        : generateProfileHtml(profile)
    const cssText =
      profile.customPageCSS.trim() ? profile.customPageCSS : generateProfileCss()
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssText}</style></head><body>${htmlBody}</body></html>`
  }, [profile])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        style,
        isEditMode,
        setEditMode,
        updateStyle,
        resetStyle,
        updateIdentity,
        addSong,
        removeSong,
        reorderSongs,
        addSection,
        removeSection,
        updateSection,
        reorderSections,
        addFriend,
        removeFriend,
        getSharedSongs,
        setCustomPageCode,
        setUseCustomPage,
        regenerateFromData,
        buildSrcDoc,
        ready,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}
