"use client"

import { useState, useRef } from 'react'
import { ChevronDown, ChevronRight, Folder, Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type SongSection as SongSectionType } from '@/lib/mock-data'
import { SongCard } from './song-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface SongSectionProps {
  section: SongSectionType
  isEditMode: boolean
  onUpdateName: (name: string) => void
  onRemove: () => void
  onRemoveSong: (songId: string) => void
  onReorderSongs: (fromIndex: number, toIndex: number) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

export function SongSection({
  section,
  isEditMode,
  onUpdateName,
  onRemove,
  onRemoveSong,
  onReorderSongs,
  onDragStart,
  onDragEnd,
  isDragging
}: SongSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(section.name)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const draggedIndex = useRef<number | null>(null)

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdateName(editName.trim())
    }
    setIsEditing(false)
  }

  const handleDragStart = (index: number) => {
    draggedIndex.current = index
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (index: number) => {
    if (draggedIndex.current !== null && draggedIndex.current !== index) {
      onReorderSongs(draggedIndex.current, index)
    }
    draggedIndex.current = null
    setDragOverIndex(null)
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/30 overflow-hidden transition-all",
        isDragging && "opacity-50 scale-[0.98]"
      )}
      style={section.color ? { borderLeftColor: section.color, borderLeftWidth: '3px' } : undefined}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 p-4 bg-card/50">
          {isEditMode && (
            <div 
              className="drag-handle cursor-grab active:cursor-grabbing"
              onMouseDown={onDragStart}
              onMouseUp={onDragEnd}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <Folder 
            className="h-5 w-5" 
            style={{ color: section.color || 'currentColor' }}
          />
          
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="h-8 max-w-[200px]"
              autoFocus
            />
          ) : (
            <h3 className="font-semibold flex-1">{section.name}</h3>
          )}
          
          {section.mood && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
              {section.mood}
            </span>
          )}
          
          <span className="text-sm text-muted-foreground">
            {section.songs.length} songs
          </span>
          
          {isEditMode && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <CollapsibleContent>
          <div className="p-4 pt-0">
            {section.songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Folder className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No songs in this section</p>
                {isEditMode && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Song
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {section.songs.map((song, index) => (
                  <div
                    key={song.id}
                    draggable={isEditMode}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(index)}
                    className={cn(
                      "transition-transform",
                      dragOverIndex === index && "transform scale-105"
                    )}
                  >
                    <SongCard
                      song={song}
                      showDragHandle={isEditMode}
                      onRemove={isEditMode ? () => onRemoveSong(song.id) : undefined}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
