"use client"

import { useState } from 'react'
import { ExternalLink, GripVertical, Trash2, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Song, getRarityColor, formatListeners } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SongCardProps {
  song: Song
  isDragging?: boolean
  onRemove?: () => void
  showDragHandle?: boolean
  compact?: boolean
}

export function SongCard({ song, isDragging, onRemove, showDragHandle = true, compact = false }: SongCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const platformColors = {
    spotify: 'bg-[#1DB954]',
    youtube: 'bg-[#FF0000]',
    soundcloud: 'bg-[#FF5500]'
  }
  
  const platformLabels = {
    spotify: 'Spotify',
    youtube: 'YouTube',
    soundcloud: 'SoundCloud'
  }

  const handleOpenInPlatform = () => {
    window.open(song.url, '_blank', 'noopener,noreferrer')
  }

  if (compact) {
    return (
      <div
        className={cn(
          "group flex items-center gap-3 p-2 rounded-lg bg-card/50 hover:bg-card transition-all",
          isDragging && "opacity-50 scale-[1.02]"
        )}
      >
        {showDragHandle && (
          <div className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        
        <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 bg-muted">
          {!imageError ? (
            <img
              src={song.coverArt}
              alt={`${song.title} cover`}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
              No Art
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{song.title}</p>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        <div className={cn(
          "h-2 w-2 rounded-full flex-shrink-0",
          platformColors[song.platform]
        )} />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100"
          onClick={handleOpenInPlatform}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        isDragging && "opacity-50 scale-[1.02] rotate-2"
      )}
    >
      {/* Cover Art */}
      <div className="relative aspect-square bg-muted">
        {!imageError ? (
          <img
            src={song.coverArt}
            alt={`${song.title} cover`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <span className="text-2xl">🎵</span>
          </div>
        )}
        
        {/* Drag Handle Overlay */}
        {showDragHandle && (
          <div className="absolute top-2 left-2 drag-handle opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm">
              <GripVertical className="h-4 w-4 text-foreground" />
            </div>
          </div>
        )}
        
        {/* Platform Badge */}
        <div className={cn(
          "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white",
          platformColors[song.platform]
        )}>
          {platformLabels[song.platform]}
        </div>
        
        {/* Rarity Badge */}
        {song.rarity && song.rarity !== 'common' && (
          <div 
            className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-background/80 backdrop-blur-sm"
            style={{ color: getRarityColor(song.rarity) }}
          >
            {song.rarity}
          </div>
        )}
        
        {/* Open in Platform Button */}
        <button
          onClick={handleOpenInPlatform}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-sm font-medium">
            <ExternalLink className="h-4 w-4" />
            Open
          </div>
        </button>
      </div>
      
      {/* Song Info */}
      <div className="p-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate">{song.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
          
          {onRemove && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleOpenInPlatform}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in {platformLabels[song.platform]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Listener Count */}
        {song.listeners && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary/60"
                style={{ 
                  width: `${Math.min(100, (song.listeners / 2000000000) * 100)}%` 
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatListeners(song.listeners)}
            </span>
          </div>
        )}
        
        {/* Mood Tag */}
        {song.mood && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground">
              {song.mood}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
