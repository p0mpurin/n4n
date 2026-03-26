"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Music, Code2, User, FolderPlus, Plus, Trash2,
  ChevronDown, ExternalLink, RefreshCcw, Eye, Users,
  Grid3X3, GalleryHorizontalEnd, ImageIcon
} from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { useAuth } from '@/lib/auth-context'
import { generateProfileCss, generateProfileHtml } from '@/lib/profile-template'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AddSongModal } from '@/components/add-song-modal'
import { AiPromptPanel } from '@/components/ai-prompt-panel'
import { FriendsPanel } from '@/components/friends-panel'

type Tab = 'data' | 'code' | 'friends'

export default function StudioPage() {
  const { user, signOut } = useAuth()
  const {
    profile, ready, addSection, removeSection, updateSection, removeSong,
    updateIdentity, setCustomPageCode, regenerateFromData, buildSrcDoc
  } = useProfile()
  const [tab, setTab] = useState<Tab>('data')
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')

  useEffect(() => {
    if (!ready) return
    setCss(profile.customPageCSS || generateProfileCss())
  }, [ready, profile.customPageCSS])

  useEffect(() => {
    if (!ready || profile.useCustomPage) return
    setHtml(generateProfileHtml(profile))
  }, [ready, profile.useCustomPage, profile.sections, profile.displayName, profile.username, profile.bio, profile.avatar, profile.stats])

  useEffect(() => {
    if (!ready || !profile.useCustomPage) return
    setHtml(profile.customPageHTML || generateProfileHtml(profile))
  }, [ready, profile.useCustomPage, profile.customPageHTML])

  const saveCode = () => setCustomPageCode(html, css)

  const srcDoc = buildSrcDoc()

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Music className="h-10 w-10 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="n4n-studio-shell flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {!!profile.customPageCSS.trim() && <style>{profile.customPageCSS}</style>}

      {/* ---- Header ---- */}
      <header className="n4n-studio-header flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold tracking-tight hover:opacity-80">
            <Music className="h-4 w-4" />
            Niche4Niche
          </Link>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Studio</span>
        </div>
        <div className="flex items-center gap-2">
          {profile.username && profile.username !== 'new-user' && (
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href={`/${profile.username}`} target="_blank">
                <ExternalLink className="mr-1 h-3 w-3" />
                /{profile.username}
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <Link href="/studio/preview" target="_blank">
              <Eye className="mr-1 h-3 w-3" />
              Preview
            </Link>
          </Button>
          {user && (
            <div className="flex items-center gap-2 border-l border-border pl-2 ml-1">
              {profile.avatar && (
                <img src={profile.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
              )}
              <span className="text-xs text-muted-foreground">@{profile.username}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="h-7 text-[11px]">
                Sign out
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Sidebar ---- */}
        <aside className="n4n-studio-sidebar flex w-[400px] min-w-[340px] max-w-[460px] flex-col border-r border-border">
          <div className="flex border-b border-border">
            {(['data', 'code', 'friends'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { if (t === 'code') saveCode(); setTab(t) }}
                className={`n4n-studio-tab flex-1 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  tab === t ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'data' && <User className="mr-1 inline h-3 w-3" />}
                {t === 'code' && <Code2 className="mr-1 inline h-3 w-3" />}
                {t === 'friends' && <Users className="mr-1 inline h-3 w-3" />}
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {tab === 'data' && <DataPanel />}
            {tab === 'code' && (
              <CodePanel html={html} css={css} onHtmlChange={setHtml} onCssChange={setCss} onSave={saveCode} onRegenerate={regenerateFromData} />
            )}
            {tab === 'friends' && <FriendsPanel />}
          </div>
        </aside>

        {/* ---- Preview ---- */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="n4n-studio-preview-toolbar flex items-center border-b border-border bg-card/20 px-4 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Live preview
            </span>
          </div>
          <iframe
            title="Profile preview"
            className="flex-1 w-full border-0"
            srcDoc={srcDoc}
          />
        </main>
      </div>
    </div>
  )
}

/* ============================================================
   DATA PANEL
   ============================================================ */
function DataPanel() {
  const { profile, addSection, updateIdentity } = useProfile()

  return (
    <div className="space-y-6">
      {/* Identity */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Profile</h2>

        {/* Avatar */}
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="h-14 w-14 rounded-full border border-border object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted/30">
                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <Label className="text-[11px]">Avatar URL</Label>
              <Input
                value={profile.avatar}
                onChange={(e) => updateIdentity({ avatar: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="mt-0.5 h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-[11px]">Display name</Label>
          <Input
            value={profile.displayName}
            onChange={(e) => updateIdentity({ displayName: e.target.value })}
            className="mt-0.5 h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-[11px]">Handle</Label>
          <div className="mt-0.5 flex h-8 items-center rounded-md border border-border bg-muted/30 px-2.5 text-xs font-mono text-muted-foreground">
            @{profile.username}
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground/60">Set during signup</p>
        </div>

        <div>
          <Label className="text-[11px]">Bio</Label>
          <Textarea
            value={profile.bio}
            onChange={(e) => updateIdentity({ bio: e.target.value })}
            className="mt-0.5 text-xs"
            rows={2}
            placeholder="Tell people about your taste..."
          />
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Sections ({profile.sections.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const name = prompt('Section name:')
              if (name?.trim()) addSection(name.trim())
            }}
          >
            <FolderPlus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>

        {profile.sections.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-6 text-center">
            <Music className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No sections yet. Create one to start adding songs.</p>
          </div>
        )}

        {profile.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </section>
    </div>
  )
}

function SectionBlock({ section }: { section: import('@/lib/mock-data').SongSection }) {
  const { removeSection, updateSection, removeSong } = useProfile()
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-xl border border-border bg-card/20 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-card/40"
      >
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
        <span className="flex-1 truncate text-xs">{section.name}</span>
        <span className="text-[10px] text-muted-foreground">{section.songs.length} songs</span>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2.5 space-y-2.5">
          {/* Section controls */}
          <div className="flex items-center gap-1.5">
            <Input
              value={section.name}
              onChange={(e) => updateSection(section.id, { name: e.target.value })}
              className="h-7 flex-1 text-xs"
            />
            {/* Layout toggle */}
            <button
              onClick={() => updateSection(section.id, { layout: 'grid' })}
              className={`rounded-md p-1.5 transition-colors ${(!section.layout || section.layout === 'grid') ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid layout"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => updateSection(section.id, { layout: 'scroll' })}
              className={`rounded-md p-1.5 transition-colors ${section.layout === 'scroll' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Horizontal scroll"
            >
              <GalleryHorizontalEnd className="h-3.5 w-3.5" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive"
              onClick={() => { if (confirm(`Delete "${section.name}"?`)) removeSection(section.id) }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Songs */}
          {section.songs.length === 0 && (
            <p className="py-2 text-center text-[11px] text-muted-foreground/60">No songs in this section</p>
          )}
          {section.songs.map((song) => (
            <div key={song.id} className="group flex items-center gap-2 rounded-lg bg-background/40 px-2 py-1.5 transition-colors hover:bg-background/60">
              {song.coverArt ? (
                <img src={song.coverArt} alt="" className="h-9 w-9 rounded-md object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">?</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium">{song.title}</div>
                <div className="truncate text-[10px] text-muted-foreground">{song.artist}</div>
              </div>
              <a href={song.url} target="_blank" rel="noreferrer" className="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => removeSong(song.id, section.id)}
                className="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <AddSongModal
            trigger={
              <Button variant="ghost" size="sm" className="h-7 w-full text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Add song
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}

/* ============================================================
   CODE PANEL
   ============================================================ */
function CodePanel({
  html, css, onHtmlChange, onCssChange, onSave, onRegenerate,
}: {
  html: string; css: string
  onHtmlChange: (v: string) => void; onCssChange: (v: string) => void
  onSave: () => void; onRegenerate: () => void
}) {
  const { profile, setUseCustomPage, setCustomPageCode } = useProfile()

  return (
    <div className="space-y-4">
      <AiPromptPanel />

      <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold">Custom HTML</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
              Off: HTML auto-generated from library. Paste CSS to theme. On: frozen markup.
            </p>
          </div>
          <Switch
            checked={profile.useCustomPage}
            onCheckedChange={(checked) => {
              if (checked) setUseCustomPage(true, html)
              else setUseCustomPage(false)
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onRegenerate}>
          <RefreshCcw className="mr-1 h-3 w-3" />
          Regenerate
        </Button>
        <Button size="sm" className="h-7 text-xs" onClick={onSave}>
          Save
        </Button>
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          HTML {profile.useCustomPage ? '' : '(read-only)'}
        </Label>
        <Textarea
          value={html}
          readOnly={!profile.useCustomPage}
          onChange={(e) => {
            if (!profile.useCustomPage) return
            onHtmlChange(e.target.value)
            setCustomPageCode(e.target.value, css)
          }}
          className={`mt-1 min-h-[24vh] font-mono text-[11px] leading-relaxed ${!profile.useCustomPage ? 'cursor-default bg-muted/20 text-muted-foreground' : ''}`}
          spellCheck={false}
        />
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          CSS (paste AI theme here)
        </Label>
        <Textarea
          value={css}
          onChange={(e) => {
            onCssChange(e.target.value)
            setCustomPageCode(html, e.target.value)
          }}
          className="mt-1 min-h-[24vh] font-mono text-[11px] leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
