'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Trash2 } from 'lucide-react'
import type { CssThemeListItem } from '@/lib/css-themes'
import { applyCssThemeToProfile, deleteMyCssTheme } from '@/lib/css-themes'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Props = {
  themes: CssThemeListItem[]
  currentUserId: string | null
}

export function ThemesGallery({ themes, currentUserId }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const apply = async (themeId: string) => {
    if (!currentUserId) return
    setBusyId(themeId)
    setMessage(null)
    const { error } = await applyCssThemeToProfile(themeId, currentUserId)
    setBusyId(null)
    if (error) setMessage({ type: 'err', text: error })
    else
      setMessage({
        type: 'ok',
        text: 'Theme applied to your profile CSS. Open Studio to preview or tweak.',
      })
  }

  const remove = async (themeId: string) => {
    if (!currentUserId) return
    setBusyId(themeId)
    setMessage(null)
    const { error } = await deleteMyCssTheme(themeId, currentUserId)
    setBusyId(null)
    if (error) setMessage({ type: 'err', text: error })
    else window.location.reload()
  }

  if (themes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card/20 px-6 py-12 text-center text-sm text-muted-foreground">
        No themes yet. Publish CSS from the Studio Code tab to share one.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {message && (
        <p
          role="status"
          className={
            message.type === 'ok'
              ? 'rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground'
              : 'rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'
          }
        >
          {message.text}
          {message.type === 'ok' && (
            <>
              {' '}
              <Link href="/studio" className="font-medium underline underline-offset-2">
                Go to Studio
              </Link>
            </>
          )}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {themes.map((t) => (
          <li
            key={t.id}
            className="flex flex-col rounded-xl border border-border bg-card/30 p-4 shadow-sm"
          >
            <h2 className="text-base font-semibold leading-tight">{t.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              by @{t.author_username}
              {t.author_display_name ? ` · ${t.author_display_name}` : ''}
            </p>
            {t.description ? (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{t.description}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {currentUserId ? (
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={busyId === t.id}
                  onClick={() => {
                    if (
                      !confirm(
                        'Apply this theme? This replaces your profile CSS only; your HTML and song data stay the same.',
                      )
                    )
                      return
                    void apply(t.id)
                  }}
                >
                  {busyId === t.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    'Apply to my profile'
                  )}
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs" asChild>
                  <Link href={`/login?next=${encodeURIComponent('/themes')}`}>Log in to apply</Link>
                </Button>
              )}
              {currentUserId && t.author_id === currentUserId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      disabled={busyId === t.id}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this theme?</AlertDialogTitle>
                      <AlertDialogDescription>
                        It will be removed from the gallery for everyone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => remove(t.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
