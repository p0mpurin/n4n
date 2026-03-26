"use client"

import { useState, useRef } from 'react'
import { Grid, List, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { SongSection } from './song-section'
import { AddSectionModal } from './add-section-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SongLibrary() {
  const { profile, style, isEditMode, updateSection, removeSection, reorderSongs, reorderSections } = useProfile()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'rarity'>('date')
  const draggedSectionIndex = useRef<number | null>(null)

  const handleSectionDragStart = (index: number) => {
    draggedSectionIndex.current = index
  }

  const handleSectionDragEnd = () => {
    draggedSectionIndex.current = null
  }

  const handleSectionDrop = (toIndex: number) => {
    if (draggedSectionIndex.current !== null && draggedSectionIndex.current !== toIndex) {
      reorderSections(draggedSectionIndex.current, toIndex)
    }
    draggedSectionIndex.current = null
  }

  // Filter sections based on search
  const filteredSections = profile.sections.map(section => ({
    ...section,
    songs: section.songs.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => 
    searchQuery === '' || section.songs.length > 0 || section.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort songs within sections
  const sortedSections = filteredSections.map(section => ({
    ...section,
    songs: [...section.songs].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'rarity':
          const rarityOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3 }
          return (rarityOrder[a.rarity || 'common']) - (rarityOrder[b.rarity || 'common'])
        case 'date':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })
  }))

  const totalSongs = profile.sections.reduce((sum, s) => sum + s.songs.length, 0)

  return (
    <div 
      className="space-y-6"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold" style={{ color: style.textColor }}>
            Music Library
          </h2>
          <span className="text-sm text-muted-foreground">
            {totalSongs} songs in {profile.sections.length} sections
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date Added {sortBy === 'date' && '•'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name {sortBy === 'name' && '•'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rarity')}>
                Rarity {sortBy === 'rarity' && '•'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View Toggle */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {/* Add Section */}
          {isEditMode && <AddSectionModal />}
        </div>
      </div>
      
      {/* Sections */}
      <div className="space-y-4">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            draggable={isEditMode}
            onDragStart={() => handleSectionDragStart(index)}
            onDragEnd={handleSectionDragEnd}
            onDragOver={(e) => {
              e.preventDefault()
            }}
            onDrop={() => handleSectionDrop(index)}
          >
            <SongSection
              section={section}
              isEditMode={isEditMode}
              onUpdateName={(name) => updateSection(section.id, { name })}
              onRemove={() => removeSection(section.id)}
              onRemoveSong={(songId) => {
                const idx = section.songs.findIndex(s => s.id === songId)
                if (idx !== -1) {
                  // Remove song by reordering to end then slicing
                  updateSection(section.id, {
                    songs: section.songs.filter(s => s.id !== songId)
                  })
                }
              }}
              onReorderSongs={(fromIndex, toIndex) => reorderSongs(section.id, fromIndex, toIndex)}
              isDragging={draggedSectionIndex.current === index}
            />
          </div>
        ))}
        
        {sortedSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <SlidersHorizontal className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No sections yet</p>
            <p className="text-sm">Create your first section to start organizing your music</p>
            {isEditMode && (
              <div className="mt-4">
                <AddSectionModal />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
