import Link from 'next/link'
import { Music, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { listCssThemes } from '@/lib/css-themes'
import { ThemesGallery } from '@/components/themes-gallery'

export const metadata = {
  title: 'CSS themes — Niche4Niche',
  description: 'Browse community CSS themes for your music profile.',
}

export default async function ThemesPage() {
  const supabase = await createClient()
  const [themes, { data: userData }] = await Promise.all([
    listCssThemes(supabase),
    supabase.auth.getUser(),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <Music className="h-4 w-4 text-primary" />
            Niche4Niche
          </Link>
          <nav className="flex items-center gap-3 text-xs sm:text-sm">
            <Link href="/studio" className="text-muted-foreground hover:text-foreground">
              Studio
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community CSS themes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Apply a shared stylesheet to your profile—no coding required. Your songs and layout from
              Data stay as they are; only CSS changes.
            </p>
          </div>
        </div>

        <ThemesGallery themes={themes} currentUserId={userData.user?.id ?? null} />
      </main>
    </div>
  )
}
