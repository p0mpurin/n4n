"use client"

import { useState } from 'react'
import { Music, UserMinus, ExternalLink, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Friend, type Song } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Progress } from '@/components/ui/progress'

interface FriendCardProps {
  friend: Friend
  onRemove?: () => void
  onCompare?: () => void
  sharedSongs?: Song[]
}

export function FriendCard({ friend, onRemove, onCompare, sharedSongs = [] }: FriendCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    listening: 'bg-primary animate-pulse'
  }

  const tasteMatchColor = friend.tasteMatch 
    ? friend.tasteMatch >= 90 ? 'text-green-400' 
    : friend.tasteMatch >= 70 ? 'text-blue-400'
    : friend.tasteMatch >= 50 ? 'text-yellow-400'
    : 'text-muted-foreground'
    : 'text-muted-foreground'

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="group flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card transition-all cursor-pointer">
          {/* Avatar with Status */}
          <div className="relative">
            <Avatar className="h-12 w-12">
              {!imageError ? (
                <AvatarImage 
                  src={friend.avatar} 
                  alt={friend.displayName}
                  onError={() => setImageError(true)}
                />
              ) : null}
              <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
              statusColors[friend.status]
            )} />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{friend.displayName}</h4>
              {friend.tasteMatch && friend.tasteMatch >= 90 && (
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  Twin
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">@{friend.username}</p>
          </div>
          
          {/* Taste Match */}
          {friend.tasteMatch && (
            <div className="text-right">
              <span className={cn("text-lg font-bold", tasteMatchColor)}>
                {friend.tasteMatch}%
              </span>
              <p className="text-[10px] text-muted-foreground">match</p>
            </div>
          )}
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14">
              {!imageError ? (
                <AvatarImage src={friend.avatar} alt={friend.displayName} />
              ) : null}
              <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold">{friend.displayName}</h4>
              <p className="text-sm text-muted-foreground">@{friend.username}</p>
              <Badge variant="outline" className="mt-1 text-[10px]">
                {friend.status === 'listening' ? 'Now Playing' : friend.status}
              </Badge>
            </div>
          </div>
          
          {/* Currently Playing */}
          {friend.status === 'listening' && friend.currentlyPlaying && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
              <Music className="h-4 w-4 text-primary animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{friend.currentlyPlaying.title}</p>
                <p className="text-xs text-muted-foreground truncate">{friend.currentlyPlaying.artist}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={friend.currentlyPlaying.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          )}
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-secondary/30 text-center">
              <p className="text-lg font-bold">{friend.sharedSongs || 0}</p>
              <p className="text-[10px] text-muted-foreground">Shared Songs</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 text-center">
              <p className={cn("text-lg font-bold", tasteMatchColor)}>
                {friend.tasteMatch || 0}%
              </p>
              <p className="text-[10px] text-muted-foreground">Taste Match</p>
            </div>
          </div>
          
          {/* Taste Match Progress */}
          {friend.tasteMatch && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Music Compatibility</span>
                <span className={tasteMatchColor}>{friend.tasteMatch}%</span>
              </div>
              <Progress value={friend.tasteMatch} className="h-2" />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onCompare}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Compare
            </Button>
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove}>
                <UserMinus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
