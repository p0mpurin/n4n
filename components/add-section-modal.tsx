"use client"

import { useState } from 'react'
import { FolderPlus, Palette } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { moodOptions } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AddSectionModal() {
  const NO_MOOD = '__none__'
  const { addSection } = useProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [mood, setMood] = useState(NO_MOOD)
  const [color, setColor] = useState('#22c55e')

  const handleCreate = () => {
    if (!name.trim()) return
    addSection(name.trim(), mood === NO_MOOD ? undefined : mood)
    handleReset()
    setIsOpen(false)
  }

  const handleReset = () => {
    setName('')
    setMood(NO_MOOD)
    setColor('#22c55e')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          New Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Section</DialogTitle>
          <DialogDescription>
            Organize your songs into themed sections or folders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Section Name</Label>
            <Input
              id="name"
              placeholder="Late Night Vibes, Summer Hits, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mood / Theme (Optional)</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_MOOD}>No mood</SelectItem>
                {moodOptions.map((m) => (
                  <SelectItem key={m.name} value={m.name.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: m.color }}
                      />
                      {m.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Section Color</Label>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 h-8 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Preview</Label>
            <div 
              className="p-4 rounded-xl border bg-card/30"
              style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="h-5 w-5 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="font-semibold">{name || 'Section Name'}</span>
                {mood !== NO_MOOD && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">
                    {mood}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
