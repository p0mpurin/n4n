"use client"

import { useState } from 'react'
import { Link2, Loader2, Music, Check, AlertCircle } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { type Song, type SongSection, getRarityFromListeners } from '@/lib/mock-data'
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
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ParsedSongData {
  title: string
  artist: string
  coverArt: string
  platform: 'spotify' | 'youtube' | 'soundcloud'
  url: string
  listeners?: number
}

type OEmbedResponse = {
  title?: string
  author_name?: string
  thumbnail_url?: string
}

function detectPlatform(url: string): ParsedSongData['platform'] | null {
  const lower = url.toLowerCase()
  if (lower.includes('spotify.com')) return 'spotify'
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube'
  if (lower.includes('soundcloud.com')) return 'soundcloud'
  return null
}

function splitTitleAndArtist(title: string, fallbackArtist?: string): { title: string; artist: string } {
  const parts = title.split(' - ')
  if (parts.length >= 2) {
    return {
      title: parts[0].trim(),
      artist: parts.slice(1).join(' - ').trim() || (fallbackArtist || 'Unknown artist')
    }
  }

  return {
    title: title.trim(),
    artist: (fallbackArtist || 'Unknown artist').trim()
  }
}

async function fetchOEmbed(url: string, platform: ParsedSongData['platform']): Promise<OEmbedResponse | null> {
  const endpointByPlatform: Record<ParsedSongData['platform'], string> = {
    spotify: `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
    youtube: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    soundcloud: `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`
  }

  try {
    const res = await fetch(endpointByPlatform[platform])
    if (!res.ok) return null
    return (await res.json()) as OEmbedResponse
  } catch {
    return null
  }
}

async function parseLink(url: string): Promise<ParsedSongData | null> {
  const trimmed = url.trim()
  const platform = detectPlatform(trimmed)
  if (!platform) return null

  const oembed = await fetchOEmbed(trimmed, platform)
  if (!oembed) return null

  const rawTitle = oembed.title || 'Untitled'
  const rawAuthor = oembed.author_name || 'Unknown artist'
  const split = splitTitleAndArtist(rawTitle, rawAuthor)

  return {
    title: split.title || rawTitle,
    artist: split.artist || rawAuthor,
    coverArt: oembed.thumbnail_url || '',
    platform,
    url: trimmed
  }
}

interface AddSongModalProps {
  trigger?: React.ReactNode
}

export function AddSongModal({ trigger }: AddSongModalProps) {
  const { profile, addSong } = useProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedSongData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string>(profile.sections[0]?.id || '')
  const [editedTitle, setEditedTitle] = useState('')
  const [editedArtist, setEditedArtist] = useState('')

  const handlePasteLink = async () => {
    if (profile.sections.length === 0) {
      setError('Create a section first, then add songs to it.')
      return
    }

    if (!url.trim()) {
      setError('Please enter a link')
      return
    }

    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const data = await parseLink(url)
      if (data) {
        setParsedData(data)
        setEditedTitle(data.title)
        setEditedArtist(data.artist)
        if (!selectedSection && profile.sections[0]) {
          setSelectedSection(profile.sections[0].id)
        }
      } else {
        setError('Could not fetch metadata for this link. Use a public Spotify, YouTube, or SoundCloud URL.')
      }
    } catch {
      setError('Failed to fetch song data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSong = () => {
    if (!parsedData || !selectedSection) return

    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: editedTitle || parsedData.title,
      artist: editedArtist || parsedData.artist,
      coverArt: parsedData.coverArt,
      platform: parsedData.platform,
      url: parsedData.url,
      addedAt: new Date().toISOString().split('T')[0],
      listeners: parsedData.listeners,
      rarity: parsedData.listeners ? getRarityFromListeners(parsedData.listeners) : 'common'
    }

    addSong(newSong, selectedSection)
    handleReset()
    setIsOpen(false)
  }

  const handleReset = () => {
    setUrl('')
    setParsedData(null)
    setError(null)
    setEditedTitle('')
    setEditedArtist('')
  }

  const platformIcons = {
    spotify: '🟢',
    youtube: '🔴',
    soundcloud: '🟠'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Music className="h-4 w-4" />
            Add Song
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Song</DialogTitle>
          <DialogDescription>
            Paste a Spotify, YouTube, or SoundCloud link. Metadata is fetched from provider oEmbed endpoints.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Song Link</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://open.spotify.com/track/... or youtube/soundcloud link"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setError(null)
                  }}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handlePasteLink} 
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Fetch metadata'
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Parsed Data Preview */}
          {parsedData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex gap-4 p-4 rounded-lg bg-card border">
                <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  <img 
                    src={parsedData.coverArt} 
                    alt="Cover art"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platformIcons[parsedData.platform]}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {parsedData.platform}
                    </span>
                  </div>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Song title"
                    className="h-8"
                  />
                  <Input
                    value={editedArtist}
                    onChange={(e) => setEditedArtist(e.target.value)}
                    placeholder="Artist name"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Section Selection */}
              <div className="space-y-2">
                <Label>Add to Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {profile.sections.map((section: SongSection) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name} ({section.songs.length} songs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            onClick={handleAddSong} 
            disabled={!parsedData || !selectedSection}
          >
            <Check className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
