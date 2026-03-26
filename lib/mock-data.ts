export interface Song {
  id: string
  title: string
  artist: string
  coverArt: string
  platform: 'spotify' | 'youtube' | 'soundcloud'
  url: string
  addedAt: string
  listeners?: number
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
  mood?: string
}

export interface SongSection {
  id: string
  name: string
  songs: Song[]
  mood?: string
  color?: string
}

export interface ProfileStyle {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: string
  borderRadius: string
  spacing: string
  customCSS: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export interface Friend {
  id: string
  username: string
  displayName: string
  avatar: string
  status: 'online' | 'offline' | 'listening'
  currentlyPlaying?: Song
  sharedSongs?: number
  tasteMatch?: number
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  joinedAt: string
  useCustomPage: boolean
  customPageHTML: string
  customPageCSS: string
  style: ProfileStyle
  sections: SongSection[]
  achievements: Achievement[]
  friends: Friend[]
  stats: {
    totalSongs: number
    totalFriends: number
    achievementsUnlocked: number
    profileViews: number
    likesReceived: number
    rarestSong?: Song
  }
}

export const defaultStyle: ProfileStyle = {
  primaryColor: '#0a0a0a',
  secondaryColor: '#171717',
  accentColor: '#22c55e',
  backgroundColor: '#0a0a0a',
  textColor: '#fafafa',
  fontFamily: 'Geist',
  fontSize: '16px',
  borderRadius: '12px',
  spacing: '16px',
  customCSS: ''
}

export function createEmptyUserProfile(): UserProfile {
  return {
    id: `user-${Date.now()}`,
    username: 'new-user',
    displayName: 'New Profile',
    avatar: '',
    bio: '',
    joinedAt: new Date().toISOString(),
    useCustomPage: false,
    customPageHTML: '',
    customPageCSS: '',
    style: defaultStyle,
    sections: [],
    achievements: [],
    friends: [],
    stats: {
      totalSongs: 0,
      totalFriends: 0,
      achievementsUnlocked: 0,
      profileViews: 0,
      likesReceived: 0,
      rarestSong: undefined
    }
  }
}

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Nights',
    artist: 'Frank Ocean',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ',
    addedAt: '2024-01-15',
    listeners: 850000000,
    rarity: 'common',
    mood: 'melancholy'
  },
  {
    id: '2',
    title: 'Tek It',
    artist: 'Cafuné',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273a7e5f9d7d88c5e3a7f6b0c9d',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/5fwSHlTEWyTHmjcXfKDxNW',
    addedAt: '2024-02-20',
    listeners: 45000000,
    rarity: 'uncommon',
    mood: 'dreamy'
  },
  {
    id: '3',
    title: 'Apocalypse',
    artist: 'Cigarettes After Sex',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273d4b2b7c3b8a9d8e4f5a6b7c8',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=sElE_BfQ67s',
    addedAt: '2024-03-10',
    listeners: 320000000,
    rarity: 'common',
    mood: 'intimate'
  },
  {
    id: '4',
    title: 'Glimpse of Us',
    artist: 'Joji',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0e4e5d7a8b9c0',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/6xGruZOHLs39ZbVccQTuPZ',
    addedAt: '2024-01-05',
    listeners: 920000000,
    rarity: 'common',
    mood: 'nostalgic'
  },
  {
    id: '5',
    title: 'Redbone',
    artist: 'Childish Gambino',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273f8c8297efc6022534f1e8453',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/0j3obgCsAhOvO3bSIjnJx9',
    addedAt: '2024-04-01',
    listeners: 1200000000,
    rarity: 'common',
    mood: 'groovy'
  },
  {
    id: '6',
    title: 'Motion Sickness',
    artist: 'Phoebe Bridgers',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2735a2e8e6a4c7b8f3e1d9a0c5b',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/4R2TVzaPUSNz5HjHrBgDJw',
    addedAt: '2024-02-14',
    listeners: 180000000,
    rarity: 'uncommon',
    mood: 'bittersweet'
  },
  {
    id: '7',
    title: 'Electric Feel',
    artist: 'MGMT',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=MmZexg8sxyk',
    addedAt: '2024-03-25',
    listeners: 890000000,
    rarity: 'common',
    mood: 'euphoric'
  },
  {
    id: '8',
    title: 'Ivy',
    artist: 'Frank Ocean',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/2ZWlPOoWh0626oTaHrnl2a',
    addedAt: '2024-01-20',
    listeners: 520000000,
    rarity: 'common',
    mood: 'reflective'
  },
  {
    id: '9',
    title: 'Bags',
    artist: 'Clairo',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2734c7a0b7e8b6c5d9e3f2a1c8b',
    platform: 'soundcloud',
    url: 'https://soundcloud.com/clairo/bags',
    addedAt: '2024-04-12',
    listeners: 210000000,
    rarity: 'uncommon',
    mood: 'tender'
  },
  {
    id: '10',
    title: 'Space Song',
    artist: 'Beach House',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/7H0ya83CMmgFcOhw0UB6ow',
    addedAt: '2024-02-28',
    listeners: 450000000,
    rarity: 'uncommon',
    mood: 'ethereal'
  },
  {
    id: '11',
    title: 'untitled 02',
    artist: 'Kendrick Lamar',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2739c0fb6a9d8a7b3e6f4c2d1a0',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/5GuKKvdRPuA2YJrGBHzVQW',
    addedAt: '2024-03-05',
    listeners: 85000000,
    rarity: 'rare',
    mood: 'intense'
  },
  {
    id: '12',
    title: 'Softly',
    artist: 'Clairo',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2738e6a4b2a3c9f0e1d7b5a3c2d',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/0bfv0uy4H3Y9fNxCZv4RaJ',
    addedAt: '2024-04-18',
    listeners: 35000000,
    rarity: 'rare',
    mood: 'gentle'
  },
  {
    id: '13',
    title: 'The Less I Know The Better',
    artist: 'Tame Impala',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ',
    addedAt: '2024-01-30',
    listeners: 1800000000,
    rarity: 'common',
    mood: 'psychedelic'
  },
  {
    id: '14',
    title: 'Breathe Deeper',
    artist: 'Tame Impala',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=892HqFBaJIs',
    addedAt: '2024-02-05',
    listeners: 280000000,
    rarity: 'uncommon',
    mood: 'transcendent'
  },
  {
    id: '15',
    title: 'Wusyaname',
    artist: 'Tyler, The Creator',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273aa95a399fd30fbb4f6f59fca',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/1ZMtgNgZE3SuKvwpbBCOGx',
    addedAt: '2024-03-15',
    listeners: 420000000,
    rarity: 'uncommon',
    mood: 'playful'
  },
  {
    id: '16',
    title: 'Pink + White',
    artist: 'Frank Ocean',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
    platform: 'spotify',
    url: 'https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8',
    addedAt: '2024-04-22',
    listeners: 680000000,
    rarity: 'common',
    mood: 'blissful'
  }
]

export const mockSections: SongSection[] = [
  {
    id: 'section-1',
    name: 'Late Night Vibes',
    mood: 'melancholy',
    color: '#4f46e5',
    songs: mockSongs.slice(0, 4)
  },
  {
    id: 'section-2',
    name: 'Summer Feels',
    mood: 'euphoric',
    color: '#f59e0b',
    songs: mockSongs.slice(4, 8)
  },
  {
    id: 'section-3',
    name: 'Deep Cuts',
    mood: 'intense',
    color: '#ef4444',
    songs: mockSongs.slice(8, 12)
  },
  {
    id: 'section-4',
    name: 'Favorites',
    mood: 'blissful',
    color: '#22c55e',
    songs: mockSongs.slice(12, 16)
  }
]

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Steps',
    description: 'Add your first song',
    icon: '🎵',
    unlockedAt: '2024-01-01'
  },
  {
    id: 'ach-2',
    name: 'Curator',
    description: 'Create 5 sections',
    icon: '📂',
    unlockedAt: '2024-01-15',
    progress: 5,
    maxProgress: 5
  },
  {
    id: 'ach-3',
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: '🦋',
    progress: 7,
    maxProgress: 10
  },
  {
    id: 'ach-4',
    name: 'Taste Twin',
    description: 'Find someone with 90%+ taste match',
    icon: '👯',
    unlockedAt: '2024-02-20'
  },
  {
    id: 'ach-5',
    name: 'Rare Finder',
    description: 'Add a song with less than 1M listeners',
    icon: '💎',
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'ach-6',
    name: 'Legendary',
    description: 'Share a legendary rare song with a friend',
    icon: '🏆'
  },
  {
    id: 'ach-7',
    name: 'Century',
    description: 'Add 100 songs to your collection',
    icon: '💯',
    progress: 48,
    maxProgress: 100
  },
  {
    id: 'ach-8',
    name: 'Stylist',
    description: 'Customize your profile with custom CSS',
    icon: '🎨',
    unlockedAt: '2024-03-01'
  }
]

export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    username: 'melodymaven',
    displayName: 'Melody Maven',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=melody',
    status: 'listening',
    currentlyPlaying: mockSongs[0],
    sharedSongs: 24,
    tasteMatch: 87
  },
  {
    id: 'friend-2',
    username: 'beatseeker',
    displayName: 'Beat Seeker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beat',
    status: 'online',
    sharedSongs: 18,
    tasteMatch: 72
  },
  {
    id: 'friend-3',
    username: 'vinylvibes',
    displayName: 'Vinyl Vibes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vinyl',
    status: 'offline',
    sharedSongs: 31,
    tasteMatch: 91
  },
  {
    id: 'friend-4',
    username: 'echowave',
    displayName: 'Echo Wave',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=echo',
    status: 'listening',
    currentlyPlaying: mockSongs[6],
    sharedSongs: 12,
    tasteMatch: 65
  },
  {
    id: 'friend-5',
    username: 'synesthesia',
    displayName: 'Synesthesia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=syn',
    status: 'online',
    sharedSongs: 42,
    tasteMatch: 94
  }
]

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  username: 'soundscape',
  displayName: 'Soundscape',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=soundscape',
  bio: 'Music curator & late night listener. Always looking for the next sound that moves me.',
  joinedAt: '2023-06-15',
  useCustomPage: false,
  customPageHTML: '',
  customPageCSS: '',
  style: defaultStyle,
  sections: mockSections,
  achievements: mockAchievements,
  friends: mockFriends,
  stats: {
    totalSongs: 156,
    totalFriends: 47,
    achievementsUnlocked: 5,
    profileViews: 1247,
    likesReceived: 0,
    rarestSong: mockSongs[11]
  }
}

export const fontOptions = [
  { name: 'Geist', value: 'Geist' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Space Grotesk', value: 'Space Grotesk' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Comic Neue', value: 'Comic Neue' },
  { name: 'Courier Prime', value: 'Courier Prime' },
  { name: 'VT323', value: 'VT323' }
]

export const moodOptions = [
  { name: 'Melancholy', color: '#6366f1' },
  { name: 'Euphoric', color: '#f59e0b' },
  { name: 'Dreamy', color: '#8b5cf6' },
  { name: 'Intense', color: '#ef4444' },
  { name: 'Chill', color: '#06b6d4' },
  { name: 'Nostalgic', color: '#ec4899' },
  { name: 'Energetic', color: '#22c55e' },
  { name: 'Intimate', color: '#f97316' }
]

export function getRarityFromListeners(listeners: number): Song['rarity'] {
  if (listeners < 1000000) return 'legendary'
  if (listeners < 10000000) return 'rare'
  if (listeners < 100000000) return 'uncommon'
  return 'common'
}

export function getRarityColor(rarity: Song['rarity']): string {
  switch (rarity) {
    case 'legendary': return '#fbbf24'
    case 'rare': return '#a855f7'
    case 'uncommon': return '#3b82f6'
    default: return '#6b7280'
  }
}

export function getPlatformIcon(platform: Song['platform']): string {
  switch (platform) {
    case 'spotify': return '🟢'
    case 'youtube': return '🔴'
    case 'soundcloud': return '🟠'
  }
}

export function formatListeners(listeners: number): string {
  if (listeners >= 1000000000) {
    return `${(listeners / 1000000000).toFixed(1)}B`
  }
  if (listeners >= 1000000) {
    return `${(listeners / 1000000).toFixed(1)}M`
  }
  if (listeners >= 1000) {
    return `${(listeners / 1000).toFixed(1)}K`
  }
  return listeners.toString()
}
