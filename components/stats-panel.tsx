"use client"

import { BarChart3, Music, Users, Trophy, Eye, TrendingUp, Clock, Disc } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/lib/profile-context'
import { getRarityColor, formatListeners } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function StatsPanel() {
  const { profile, style } = useProfile()

  // Calculate platform breakdown
  const allSongs = profile.sections.flatMap(s => s.songs)
  const platformCounts = {
    spotify: allSongs.filter(s => s.platform === 'spotify').length,
    youtube: allSongs.filter(s => s.platform === 'youtube').length,
    soundcloud: allSongs.filter(s => s.platform === 'soundcloud').length
  }
  const totalPlatformSongs = platformCounts.spotify + platformCounts.youtube + platformCounts.soundcloud

  // Calculate rarity breakdown
  const rarityCounts = {
    common: allSongs.filter(s => s.rarity === 'common').length,
    uncommon: allSongs.filter(s => s.rarity === 'uncommon').length,
    rare: allSongs.filter(s => s.rarity === 'rare').length,
    legendary: allSongs.filter(s => s.rarity === 'legendary').length
  }

  // Calculate mood breakdown
  const moodCounts: Record<string, number> = {}
  allSongs.forEach(song => {
    if (song.mood) {
      moodCounts[song.mood] = (moodCounts[song.mood] || 0) + 1
    }
  })
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const stats = [
    { 
      icon: Music, 
      label: 'Total Songs', 
      value: profile.stats.totalSongs,
      sublabel: `in ${profile.sections.length} sections`
    },
    { 
      icon: Users, 
      label: 'Friends', 
      value: profile.stats.totalFriends,
      sublabel: `${profile.friends.filter(f => f.status !== 'offline').length} online`
    },
    { 
      icon: Trophy, 
      label: 'Achievements', 
      value: `${profile.stats.achievementsUnlocked}/${profile.achievements.length}`,
      sublabel: 'unlocked'
    },
    { 
      icon: Eye, 
      label: 'Profile Views', 
      value: profile.stats.profileViews.toLocaleString(),
      sublabel: 'all time'
    },
  ]

  return (
    <div 
      className="space-y-6"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: style.textColor }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                </div>
                <stat.icon 
                  className="h-5 w-5" 
                  style={{ color: style.primaryColor }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Platform Breakdown */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Disc className="h-4 w-4" style={{ color: style.primaryColor }} />
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#1DB954]" />
                  <span>Spotify</span>
                </div>
                <span className="font-medium">{platformCounts.spotify}</span>
              </div>
              <Progress 
                value={totalPlatformSongs ? (platformCounts.spotify / totalPlatformSongs) * 100 : 0} 
                className="h-2 [&>div]:bg-[#1DB954]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF0000]" />
                  <span>YouTube</span>
                </div>
                <span className="font-medium">{platformCounts.youtube}</span>
              </div>
              <Progress 
                value={totalPlatformSongs ? (platformCounts.youtube / totalPlatformSongs) * 100 : 0}
                className="h-2 [&>div]:bg-[#FF0000]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5500]" />
                  <span>SoundCloud</span>
                </div>
                <span className="font-medium">{platformCounts.soundcloud}</span>
              </div>
              <Progress 
                value={totalPlatformSongs ? (platformCounts.soundcloud / totalPlatformSongs) * 100 : 0}
                className="h-2 [&>div]:bg-[#FF5500]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rarity Breakdown */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: style.primaryColor }} />
              Rarity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { rarity: 'common', count: rarityCounts.common },
                { rarity: 'uncommon', count: rarityCounts.uncommon },
                { rarity: 'rare', count: rarityCounts.rare },
                { rarity: 'legendary', count: rarityCounts.legendary },
              ].map((item) => (
                <div 
                  key={item.rarity}
                  className="p-3 rounded-lg bg-secondary/30 text-center"
                >
                  <p 
                    className="text-xl font-bold"
                    style={{ color: getRarityColor(item.rarity as 'common' | 'uncommon' | 'rare' | 'legendary') }}
                  >
                    {item.count}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{item.rarity}</p>
                </div>
              ))}
            </div>
            
            {/* Rarest Song Highlight */}
            {profile.stats.rarestSong && (
              <div className="mt-3 p-3 rounded-lg border border-dashed" style={{ borderColor: getRarityColor(profile.stats.rarestSong.rarity) }}>
                <p className="text-xs text-muted-foreground mb-1">Your Rarest Find</p>
                <p className="font-medium text-sm">{profile.stats.rarestSong.title}</p>
                <p className="text-xs text-muted-foreground">{profile.stats.rarestSong.artist}</p>
                {profile.stats.rarestSong.listeners && (
                  <Badge 
                    variant="outline" 
                    className="mt-2 text-[10px]"
                    style={{ 
                      borderColor: getRarityColor(profile.stats.rarestSong.rarity),
                      color: getRarityColor(profile.stats.rarestSong.rarity)
                    }}
                  >
                    {formatListeners(profile.stats.rarestSong.listeners)} listeners
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Moods */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" style={{ color: style.primaryColor }} />
              Top Moods
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topMoods.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topMoods.map(([mood, count]) => (
                  <Badge 
                    key={mood} 
                    variant="secondary"
                    className="text-sm capitalize"
                  >
                    {mood}
                    <span className="ml-1 text-muted-foreground">({count})</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add moods to your songs to see your taste breakdown
              </p>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: style.primaryColor }} />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sections created</span>
              <span className="font-medium">{profile.sections.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. songs per section</span>
              <span className="font-medium">
                {profile.sections.length 
                  ? Math.round(allSongs.length / profile.sections.length) 
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Taste match avg.</span>
              <span className="font-medium" style={{ color: style.primaryColor }}>
                {profile.friends.length 
                  ? Math.round(profile.friends.reduce((sum, f) => sum + (f.tasteMatch || 0), 0) / profile.friends.length)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
