"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit2, Eye, Users, Music, Trophy, TrendingUp, ExternalLink, Settings } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { formatListeners, getRarityColor } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { StyleCustomizer } from './style-customizer'
import { AddSongModal } from './add-song-modal'

export function ProfileHeader() {
  const { profile, style, isEditMode, setEditMode } = useProfile()
  const [imageError, setImageError] = useState(false)

  const stats = [
    { icon: Music, label: 'Songs', value: profile.stats.totalSongs },
    { icon: Users, label: 'Friends', value: profile.stats.totalFriends },
    { icon: Trophy, label: 'Achievements', value: `${profile.stats.achievementsUnlocked}/${profile.achievements.length}` },
    { icon: Eye, label: 'Views', value: profile.stats.profileViews.toLocaleString() },
  ]

  return (
    <TooltipProvider>
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundColor: style.secondaryColor,
          fontFamily: style.fontFamily
        }}
      >
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${style.primaryColor}40 0%, ${style.accentColor}20 100%)`
          }}
        />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div 
                className="relative group"
                style={{ borderRadius: style.borderRadius }}
              >
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4" style={{ borderColor: style.primaryColor }}>
                  {!imageError ? (
                    <AvatarImage 
                      src={profile.avatar} 
                      alt={profile.displayName}
                      onError={() => setImageError(true)}
                    />
                  ) : null}
                  <AvatarFallback className="text-3xl bg-card">
                    {(profile.displayName || profile.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status Indicator */}
                <div 
                  className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-card"
                  style={{ backgroundColor: style.primaryColor }}
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: style.textColor }}
                  >
                    {profile.displayName}
                  </h1>
                  <p 
                    className="text-sm opacity-70"
                    style={{ color: style.textColor }}
                  >
                    @{profile.username}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" asChild>
                    <Link href="/code-editor">Code Editor</Link>
                  </Button>
                  <AddSongModal />
                  <StyleCustomizer />
                  <Button 
                    variant={isEditMode ? "default" : "outline"}
                    onClick={() => setEditMode(!isEditMode)}
                    className="gap-2"
                    style={isEditMode ? { backgroundColor: style.primaryColor } : undefined}
                  >
                    {isEditMode ? (
                      <>
                        <Settings className="h-4 w-4 animate-spin-slow" />
                        Editing
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Bio */}
              <p 
                className="mt-4 text-sm md:text-base max-w-2xl"
                style={{ color: style.textColor, opacity: 0.85 }}
              >
                {profile.bio || 'No bio yet. Open edit mode to personalize your profile.'}
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6">
                {stats.map((stat) => (
                  <Tooltip key={stat.label}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-default">
                        <stat.icon 
                          className="h-4 w-4"
                          style={{ color: style.primaryColor }}
                        />
                        <span 
                          className="font-semibold"
                          style={{ color: style.textColor }}
                        >
                          {stat.value}
                        </span>
                        <span 
                          className="text-sm opacity-60 hidden sm:inline"
                          style={{ color: style.textColor }}
                        >
                          {stat.label}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stat.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              
              {/* Rarest Song Badge */}
              {profile.stats.rarestSong && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="gap-1"
                    style={{ 
                      borderColor: getRarityColor(profile.stats.rarestSong.rarity),
                      color: getRarityColor(profile.stats.rarestSong.rarity)
                    }}
                  >
                    <TrendingUp className="h-3 w-3" />
                    Rarest Find
                  </Badge>
                  <span 
                    className="text-sm"
                    style={{ color: style.textColor }}
                  >
                    {profile.stats.rarestSong.title} by {profile.stats.rarestSong.artist}
                  </span>
                  {profile.stats.rarestSong.listeners && (
                    <span className="text-xs opacity-60" style={{ color: style.textColor }}>
                      ({formatListeners(profile.stats.rarestSong.listeners)} listeners)
                    </span>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={profile.stats.rarestSong.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              )}
              
              {/* Joined Date */}
              <p 
                className="mt-3 text-xs opacity-50"
                style={{ color: style.textColor }}
              >
                Curating since {new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
