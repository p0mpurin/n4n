"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Music, Code2, User, FolderPlus, Plus, Trash2,
  ChevronDown, ExternalLink, RefreshCcw, Eye, Users
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
  const ctx = useProfile()
  const { user, signOut } = useAuth()
  const {
    profile, ready, addSection, removeSection, updateSection, removeSong,
    updateIdentity, setCustomPageCode, regenerateFromData, buildSrcDoc
  } = ctx
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
  }, [ready, profile.useCustomPage, profile.sections, profile.displayName, profile.username, profile.bio])

  useEffect(() => {
    if (!ready || !profile.useCustomPage) return
    setHtml(profile.customPageHTML || generateProfileHtml(profile))
  }, [ready, profile.useCustomPage, profile.customPageHTML])

  const saveCode = () => {
    setCustomPageCode(html, css)
  }

  const handleRegenerate = () => {
    regenerateFromData()
  }

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
      {!!profile.customPageCSS.trim() && (
        <style>{profile.customPageCSS}</style>
      )}
      {/* Top bar */}
      <header className="n4n-studio-header flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-bold tracking-tight hover:opacity-80">Niche4Niche</Link>
          <span className="text-xs text-muted-foreground">Studio</span>
        </div>
        <div className="flex items-center gap-2">
          {profile.username && profile.username !== 'new-user' && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${profile.username}`} target="_blank">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                /{profile.username}
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/studio/preview" target="_blank">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Link>
          </Button>
          {user && (
            <div className="flex items-center gap-2 border-l border-border pl-2 ml-1">
              <span className="text-xs text-muted-foreground">@{profile.username}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-xs">
                Sign out
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Sidebar ---- */}
        <aside className="n4n-studio-sidebar flex w-[420px] min-w-[360px] max-w-[480px] flex-col border-r border-border">
          {/* Tab switcher */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab('data')}
              className={`n4n-studio-tab flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === 'data' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <User className="mr-1.5 inline h-3.5 w-3.5" />
              Data
            </button>
            <button
              onClick={() => { setTab('code'); saveCode() }}
              className={`n4n-studio-tab flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === 'code' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Code2 className="mr-1.5 inline h-3.5 w-3.5" />
              Code
            </button>
            <button
              onClick={() => setTab('friends')}
              className={`n4n-studio-tab flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === 'friends' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users className="mr-1.5 inline h-3.5 w-3.5" />
              Friends
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {tab === 'data' && <DataPanel />}
            {tab === 'code' && (
              <CodePanel
                html={html}
                css={css}
                onHtmlChange={setHtml}
                onCssChange={setCss}
                onSave={saveCode}
                onRegenerate={handleRegenerate}
              />
            )}
            {tab === 'friends' && <FriendsPanel />}
          </div>
        </aside>

        {/* ---- Preview ---- */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="n4n-studio-preview-toolbar flex items-center gap-2 border-b border-border bg-card/30 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live preview
            </span>
            <div className="n4n-studio-stats ml-auto flex items-center gap-3 text-xs text-muted-foreground" />
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
   DATA PANEL — profile identity + sections + songs
   ============================================================ */
function DataPanel() {
  const { profile, addSection, removeSection, updateSection, removeSong, updateIdentity } = useProfile()

  return (
    <>
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile</h2>
        <div className="space-y-2">
          <div>
            <Label className="text-xs">Display name</Label>
            <Input
              value={profile.displayName}
              onChange={(e) => updateIdentity({ displayName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => updateIdentity({ bio: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Sections ({profile.sections.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const name = prompt('Section name:')
              if (name?.trim()) addSection(name.trim())
            }}
          >
            <FolderPlus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        {profile.sections.length === 0 && (
          <p className="text-sm text-muted-foreground">No sections yet. Create one to start adding songs.</p>
        )}

        {profile.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </section>
    </>
  )
}

function SectionBlock({ section }: { section: import('@/lib/mock-data').SongSection }) {
  const { removeSection, updateSection, removeSong } = useProfile()
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-lg border border-border bg-card/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium hover:bg-card/50"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? '' : '-rotate-90'}`} />
        <span className="flex-1 truncate">{section.name}</span>
        <span className="text-xs text-muted-foreground">{section.songs.length}</span>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2.5 space-y-2">
          <div className="flex gap-2">
            <Input
              value={section.name}
              onChange={(e) => updateSection(section.id, { name: e.target.value })}
              className="h-8 text-xs"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive shrink-0"
              onClick={() => {
                if (confirm(`Delete "${section.name}"?`)) removeSection(section.id)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {section.songs.map((song) => (
            <div key={song.id} className="flex items-center gap-2 rounded-md bg-background/50 px-2 py-1.5">
              {song.coverArt ? (
                <img src={song.coverArt} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs">?</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium">{song.title}</div>
                <div className="truncate text-[11px] text-muted-foreground">{song.artist}</div>
              </div>
              <a href={song.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => removeSong(song.id, section.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <AddSongModal
            trigger={
              <Button variant="ghost" size="sm" className="w-full">
                <Plus className="mr-1 h-3.5 w-3.5" />
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
   CODE PANEL — raw HTML + CSS editors
   ============================================================ */
function CodePanel({
  html, css, onHtmlChange, onCssChange, onSave, onRegenerate,
}: {
  html: string
  css: string
  onHtmlChange: (v: string) => void
  onCssChange: (v: string) => void
  onSave: () => void
  onRegenerate: () => void
}) {
  const { profile, setUseCustomPage, setCustomPageCode } = useProfile()

  return (
    <div className="space-y-4">
      <AiPromptPanel />
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Custom HTML (advanced)</p>
            <p className="text-xs text-muted-foreground">
              Off (default): HTML is always generated from your library; paste <strong>CSS</strong> from AI to theme it. New sections use the same CSS automatically. On: frozen HTML you paste—data changes won&apos;t update the page.
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
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <RefreshCcw className="mr-1 h-3.5 w-3.5" />
          Regenerate from data
        </Button>
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>

      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          HTML {profile.useCustomPage ? '(custom)' : '(live from library — read-only)'}
        </Label>
        <Textarea
          value={html}
          readOnly={!profile.useCustomPage}
          onChange={(e) => {
            if (!profile.useCustomPage) return
            const v = e.target.value
            onHtmlChange(v)
            setCustomPageCode(v, css)
          }}
          className={`mt-1 min-h-[28vh] font-mono text-xs ${!profile.useCustomPage ? 'cursor-default bg-muted/40' : ''}`}
          spellCheck={false}
        />
      </div>

      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          CSS (theme — paste AI output here)
        </Label>
        <Textarea
          value={css}
          onChange={(e) => {
            const v = e.target.value
            onCssChange(v)
            setCustomPageCode(html, v)
          }}
          className="mt-1 min-h-[28vh] font-mono text-xs"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
