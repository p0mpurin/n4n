import Link from 'next/link'
import { Music, Palette, Users, Heart, Code2, Eye, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Music className="h-5 w-5" />
            Niche4Niche
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Claim your page
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Your music taste, your page
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Build a page that sounds like{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              you
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Organize your favorite songs from Spotify, YouTube, and SoundCloud into sections.
            Theme it with AI or write your own CSS. Share your page, compare taste with friends, collect likes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-medium transition-colors hover:bg-card"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Palette className="h-5 w-5" />}
              title="AI-powered themes"
              description="Describe a vibe and get a complete CSS theme. Or write your own from scratch. Full creative freedom."
            />
            <FeatureCard
              icon={<Code2 className="h-5 w-5" />}
              title="Full code control"
              description="Edit raw HTML and CSS. Use the builder for data, or go fully custom. Your page, your markup."
            />
            <FeatureCard
              icon={<Music className="h-5 w-5" />}
              title="Multi-platform"
              description="Add songs from Spotify, YouTube, and SoundCloud. Organize them into themed sections with moods."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Friends & taste"
              description="Add friends and see what songs you have in common. Compare music taste with a match score."
            />
            <FeatureCard
              icon={<Heart className="h-5 w-5" />}
              title="Likes & views"
              description="See who likes your page and track view stats. Your page is public at niche4niche.com/you."
            />
            <FeatureCard
              icon={<Eye className="h-5 w-5" />}
              title="Instant public page"
              description="Claim a username and your page is immediately live. Share the link anywhere."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to build yours?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a username. Add your songs. Share your page.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-opacity hover:opacity-90"
          >
            Claim your page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-muted-foreground">
          <p>Niche4Niche</p>
          <p>Your music taste, your page.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-6 transition-colors hover:bg-card/50">
      <div className="mb-3 inline-flex rounded-lg border border-border bg-card p-2.5">
        {icon}
      </div>
      <h3 className="mb-1.5 text-base font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
