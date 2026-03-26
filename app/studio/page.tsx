"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Music, Code2, User, FolderPlus, Plus, Trash2,
  ChevronDown, ExternalLink, RefreshCcw, Eye, Users,
  Grid3X3, GalleryHorizontalEnd, ImageIcon, Palette, Loader2,
} from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { useAuth } from '@/lib/auth-context'
import { generateProfileCss, generateProfileHtml } from '@/lib/profile-template'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { AddSongModal } from '@/components/add-song-modal'
import { AiPromptPanel } from '@/components/ai-prompt-panel'
import { FriendsPanel } from '@/components/friends-panel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { publishCssTheme } from '@/lib/css-themes'
import { cn } from '@/lib/utils'

type Tab = 'data' | 'code' | 'friends'

export default function StudioPage() {
  const { user, signOut } = useAuth()
  const {
    profile, ready, addSection, removeSection, updateSection, removeSong,
    updateIdentity, setCustomPageCode, regenerateFromData, buildSrcDoc,
    persistToBackend,
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
  }, [
    ready,
    profile.useCustomPage,
    profile.sections,
    profile.displayName,
    profile.username,
    profile.bio,
    profile.avatar,
    profile.backgroundImage,
    profile.style.backgroundOverlayOpacity,
    profile.style.backgroundBlurPx,
    profile.stats,
  ])

  useEffect(() => {
    if (!ready || !profile.useCustomPage) return
    setHtml(profile.customPageHTML || generateProfileHtml(profile))
  }, [ready, profile.useCustomPage, profile.customPageHTML])

  useEffect(() => {
    return () => {
      if (ready) void persistToBackend()
    }
  }, [ready, persistToBackend])

  const saveCode = () => {
    setCustomPageCode(html, css)
    void persistToBackend({
      ...profile,
      customPageCSS: css,
      ...(profile.useCustomPage ? { customPageHTML: html } : {}),
    })
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
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <Link href="/themes" target="_blank" rel="noreferrer">
              <Palette className="mr-1 h-3 w-3" />
              Themes
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
  const { profile, addSection, updateIdentity, updateStyle } = useProfile()
  const overlayPct = Math.round((profile.style.backgroundOverlayOpacity ?? 0.35) * 100)
  const blurPx = profile.style.backgroundBlurPx ?? 0

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

        <div className="flex items-start gap-3">
          <div className="shrink-0">
            {profile.backgroundImage?.trim() ? (
              <div
                className="relative h-14 w-24 overflow-hidden rounded-md border border-border"
                title="Background preview"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${JSON.stringify(profile.backgroundImage.trim())})`,
                    filter: `blur(${Math.min(blurPx, 24) * 0.2}px)`,
                    transform: 'scale(1.08)',
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[rgb(10,10,16)]"
                  style={{ opacity: overlayPct / 100 }}
                />
              </div>
            ) : (
              <div className="flex h-14 w-24 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <Label className="text-[11px]">Background image URL</Label>
            <Input
              value={profile.backgroundImage}
              onChange={(e) => updateIdentity({ backgroundImage: e.target.value })}
              placeholder="https://example.com/wallpaper.jpg"
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground/60">
              Full-page cover behind your profile. The app paints it on <code className="font-mono text-[9px]">body</code>{' '}
              via <code className="font-mono text-[9px]">:root</code> variables{' '}
              <code className="font-mono text-[9px]">--page-bg-image</code>,{' '}
              <code className="font-mono text-[9px]">--page-bg-scrim-alpha</code>,{' '}
              <code className="font-mono text-[9px]">--page-bg-blur</code>.
            </p>
          </div>
        </div>

        {!!profile.backgroundImage?.trim() && (
          <div className="space-y-4 rounded-lg border border-border/60 bg-card/20 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Background look
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[11px]">Overlay darkness</Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">{overlayPct}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[overlayPct]}
                onValueChange={(v) => updateStyle({ backgroundOverlayOpacity: (v[0] ?? 0) / 100 })}
              />
              <p className="text-[9px] text-muted-foreground/70">How much the dark scrim covers the photo (0 = photo only).</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[11px]">Blur</Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">{blurPx}px</span>
              </div>
              <Slider
                min={0}
                max={24}
                step={1}
                value={[blurPx]}
                onValueChange={(v) => updateStyle({ backgroundBlurPx: v[0] ?? 0 })}
              />
              <p className="text-[9px] text-muted-foreground/70">Softens the wallpaper (max 24px in Studio; theme CSS can use up to 48px).</p>
            </div>
          </div>
        )}
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
              onClick={() =>
                updateSection(section.id, {
                  layout: 'scroll',
                  scrollNav: section.scrollNav === 'native' ? 'native' : 'arrows',
                })}
              className={`rounded-md p-1.5 transition-colors ${section.layout === 'scroll' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Horizontal row (arrows or scrollbar — see below)"
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

          {section.layout === 'scroll' && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border/60 bg-background/30 px-2 py-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">Row navigation</span>
              <button
                type="button"
                onClick={() => updateSection(section.id, { scrollNav: 'arrows' })}
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] transition-colors',
                  section.scrollNav !== 'native' ? 'bg-foreground/15 text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Arrows
              </button>
              <button
                type="button"
                onClick={() => updateSection(section.id, { scrollNav: 'native' })}
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] transition-colors',
                  section.scrollNav === 'native' ? 'bg-foreground/15 text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Scrollbar
              </button>
              <span className="text-[9px] text-muted-foreground/70">Theme with CSS vars on .song-scroll-row</span>
            </div>
          )}

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
  const { user } = useAuth()
  const [pubOpen, setPubOpen] = useState(false)
  const [pubTitle, setPubTitle] = useState('')
  const [pubDesc, setPubDesc] = useState('')
  const [pubErr, setPubErr] = useState('')
  const [pubBusy, setPubBusy] = useState(false)
  const [justPublished, setJustPublished] = useState(false)

  const submitPublish = async () => {
    setPubErr('')
    if (!user) return
    setPubBusy(true)
    const r = await publishCssTheme({
      authorId: user.id,
      title: pubTitle,
      description: pubDesc,
      css,
    })
    setPubBusy(false)
    if (r.error) {
      setPubErr(r.error)
      return
    }
    setPubOpen(false)
    setPubTitle('')
    setPubDesc('')
    setJustPublished(true)
    window.setTimeout(() => setJustPublished(false), 8000)
  }

  return (
    <div className="space-y-4">
      <AiPromptPanel />

      {justPublished && (
        <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-foreground">
          Theme published.{' '}
          <Link href="/themes" target="_blank" className="font-medium underline underline-offset-2">
            Open gallery
          </Link>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
          <Link href="/themes" target="_blank" rel="noreferrer">
            <Palette className="mr-1 h-3 w-3" />
            Browse community themes
          </Link>
        </Button>
        <Dialog
          open={pubOpen}
          onOpenChange={(o) => {
            setPubOpen(o)
            if (o) setPubErr('')
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              disabled={!user?.id}
              title={!user?.id ? 'Sign in to publish' : undefined}
            >
              Publish CSS to gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Publish CSS theme</DialogTitle>
              <DialogDescription>
                Others can apply this stylesheet to their profile from the themes gallery. Only the CSS
                below (current editor contents) is shared.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label htmlFor="n4n-pub-title" className="text-xs">
                  Title
                </Label>
                <Input
                  id="n4n-pub-title"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder="e.g. Midnight glass"
                  className="mt-1 h-9 text-sm"
                  maxLength={120}
                />
              </div>
              <div>
                <Label htmlFor="n4n-pub-desc" className="text-xs">
                  Description (optional)
                </Label>
                <Textarea
                  id="n4n-pub-desc"
                  value={pubDesc}
                  onChange={(e) => setPubDesc(e.target.value)}
                  placeholder="What vibe or layout does this theme suit?"
                  className="mt-1 min-h-[72px] text-sm"
                  rows={3}
                />
              </div>
              {pubErr ? <p className="text-xs text-destructive">{pubErr}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPubOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={pubBusy || !pubTitle.trim() || !css.trim()} onClick={() => void submitPublish()}>
                {pubBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
