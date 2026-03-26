"use client"

import { useState } from 'react'
import { X, Sparkles, Music, Trophy, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Friend, type Song, getRarityColor, formatListeners } from '@/lib/mock-data'
import { useProfile } from '@/lib/profile-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SongCard } from './song-card'

interface TasteComparisonProps {
  friend: Friend
  isOpen: boolean
  onClose: () => void
}

export function TasteComparison({ friend, isOpen, onClose }: TasteComparisonProps) {
  const { profile, getSharedSongs } = useProfile()
  const [imageError, setImageError] = useState(false)
  
  const sharedSongs = getSharedSongs(friend.id)
  
  // Find rarest shared song
  const rarestShared = [...sharedSongs].sort((a, b) => 
    (a.listeners || Infinity) - (b.listeners || Infinity)
  )[0]
  
  // Generate taste breakdown
  const tasteBreakdown = [
    { category: 'Alternative', userScore: 85, friendScore: 78 },
    { category: 'Indie', userScore: 72, friendScore: 88 },
    { category: 'R&B', userScore: 65, friendScore: 70 },
    { category: 'Electronic', userScore: 45, friendScore: 52 },
    { category: 'Hip Hop', userScore: 58, friendScore: 40 },
  ]
  
  // Calculate achievements from comparison
  const comparisonAchievements = [
    {
      unlocked: (friend.tasteMatch || 0) >= 90,
      name: 'Taste Twins',
      description: '90%+ music compatibility',
      icon: '👯'
    },
    {
      unlocked: sharedSongs.some(s => s.rarity === 'rare' || s.rarity === 'legendary'),
      name: 'Rare Bond',
      description: 'Share a rare song',
      icon: '💎'
    },
    {
      unlocked: (friend.sharedSongs || 0) >= 20,
      name: 'Deep Connection',
      description: 'Share 20+ songs',
      icon: '🎵'
    },
    {
      unlocked: sharedSongs.some(s => (s.listeners || 0) < 1000000),
      name: 'Underground Together',
      description: 'Share an underground gem',
      icon: '🌙'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Music Taste Comparison</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          {/* Profile Comparison Header */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Your Profile */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium text-sm">{profile.displayName}</p>
                <p className="text-xs text-muted-foreground">You</p>
              </div>
            </div>
            
            {/* Match Score */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-primary flex items-center justify-center bg-primary/10">
                  <span className="text-2xl font-bold text-primary">
                    {friend.tasteMatch || 0}%
                  </span>
                </div>
                {(friend.tasteMatch || 0) >= 90 && (
                  <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px]">
                    Twin!
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Match</p>
            </div>
            
            {/* Friend Profile */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 border-2 border-secondary">
                {!imageError ? (
                  <AvatarImage 
                    src={friend.avatar} 
                    onError={() => setImageError(true)}
                  />
                ) : null}
                <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium text-sm">{friend.displayName}</p>
                <p className="text-xs text-muted-foreground">@{friend.username}</p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="shared" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shared">
                <Music className="h-4 w-4 mr-2" />
                Shared ({sharedSongs.length})
              </TabsTrigger>
              <TabsTrigger value="breakdown">
                Taste Breakdown
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
            </TabsList>
            
            {/* Shared Songs */}
            <TabsContent value="shared" className="mt-4">
              <ScrollArea className="h-[350px] pr-4">
                {/* Rarest Shared Highlight */}
                {rarestShared && rarestShared.rarity !== 'common' && (
                  <div className="mb-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: getRarityColor(rarestShared.rarity) }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4" style={{ color: getRarityColor(rarestShared.rarity) }} />
                      <span className="text-sm font-medium" style={{ color: getRarityColor(rarestShared.rarity) }}>
                        Rarest Shared Find
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img 
                        src={rarestShared.coverArt}
                        alt={rarestShared.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{rarestShared.title}</p>
                        <p className="text-sm text-muted-foreground">{rarestShared.artist}</p>
                        {rarestShared.listeners && (
                          <p className="text-xs mt-1" style={{ color: getRarityColor(rarestShared.rarity) }}>
                            Only {formatListeners(rarestShared.listeners)} listeners
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={rarestShared.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Shared Songs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sharedSongs.map((song) => (
                    <SongCard key={song.id} song={song} showDragHandle={false} />
                  ))}
                </div>
                
                {sharedSongs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Music className="h-12 w-12 mb-3 opacity-50" />
                    <p className="font-medium">No shared songs yet</p>
                    <p className="text-sm">Keep exploring to find common ground!</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Taste Breakdown */}
            <TabsContent value="breakdown" className="mt-4">
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {tasteBreakdown.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">
                          {Math.abs(item.userScore - item.friendScore)}% difference
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">You</span>
                            <span>{item.userScore}%</span>
                          </div>
                          <Progress value={item.userScore} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{friend.displayName}</span>
                            <span>{item.friendScore}%</span>
                          </div>
                          <Progress value={item.friendScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Insight */}
                  <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm">
                      <Sparkles className="h-4 w-4 inline mr-2 text-primary" />
                      <strong>Insight:</strong> You both have strong taste in{' '}
                      <span className="text-primary font-medium">Indie</span> and{' '}
                      <span className="text-primary font-medium">R&B</span> music!
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Achievements */}
            <TabsContent value="achievements" className="mt-4">
              <ScrollArea className="h-[350px] pr-4">
                <div className="grid grid-cols-2 gap-3">
                  {comparisonAchievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        achievement.unlocked 
                          ? "bg-primary/10 border-primary/30" 
                          : "bg-muted/30 border-border opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="mt-2 text-[10px]">
                              Unlocked!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
