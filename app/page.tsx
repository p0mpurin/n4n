import Link from 'next/link'
import { Music, Palette, Users, Heart, Code2, Eye, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0c0a0f] text-[#e8e0f0]">
      {/* Nav */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Music className="h-5 w-5 text-pink-300/80" />
            <span>Niche4Niche</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm text-white/50 transition-colors hover:text-white/80">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-400/90 to-violet-400/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition-all hover:shadow-pink-500/20 hover:brightness-110"
            >
              Claim your page
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-b from-pink-500/[0.08] via-violet-500/[0.05] to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-xl">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/40">
            <Sparkles className="h-3 w-3 text-pink-300/60" />
            Your music taste, your page
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Build a page that{' '}
            <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-violet-300 bg-clip-text text-transparent">
              sounds like you
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/40">
            Organize songs from Spotify, YouTube, and SoundCloud.
            Theme it with AI. Share your page. Compare taste with friends.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400/90 to-violet-400/90 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition-all hover:shadow-pink-500/25 hover:brightness-110"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-7 py-3 text-sm font-medium text-white/50 transition-colors hover:border-white/[0.15] hover:text-white/70"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/[0.05] bg-white/[0.01]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-10 text-center text-xl font-bold tracking-tight text-white/80 sm:text-2xl">
            Everything you need
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Palette className="h-4.5 w-4.5 text-pink-300/70" />}
              title="AI-powered themes"
              description="Describe a vibe, get a complete CSS theme. Or write your own. Full creative freedom."
            />
            <FeatureCard
              icon={<Code2 className="h-4.5 w-4.5 text-violet-300/70" />}
              title="Full code control"
              description="Edit raw HTML and CSS. Use the builder or go fully custom — your page, your markup."
            />
            <FeatureCard
              icon={<Music className="h-4.5 w-4.5 text-rose-300/70" />}
              title="Multi-platform"
              description="Add songs from Spotify, YouTube, SoundCloud. Organize into themed sections."
            />
            <FeatureCard
              icon={<Users className="h-4.5 w-4.5 text-teal-300/70" />}
              title="Friends & taste"
              description="Add friends, see shared songs, get a taste match percentage."
            />
            <FeatureCard
              icon={<Heart className="h-4.5 w-4.5 text-pink-300/70" />}
              title="Likes & views"
              description="See who likes your page. Track views. Everything on your public page."
            />
            <FeatureCard
              icon={<Eye className="h-4.5 w-4.5 text-violet-300/70" />}
              title="Instant public page"
              description="Claim a username, your page is live. Share the link anywhere."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-xl font-bold tracking-tight text-white/80 sm:text-2xl">
            Ready to build yours?
          </h2>
          <p className="mt-2 text-sm text-white/35">
            Pick a username. Add songs. Share your page.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400/90 to-violet-400/90 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition-all hover:shadow-pink-500/25 hover:brightness-110"
          >
            Claim your page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 text-[11px] text-white/20">
          <p className="flex items-center gap-1.5">
            <Music className="h-3 w-3" />
            Niche4Niche
          </p>
          <p>Your music taste, your page.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.03]">
      <div className="mb-3 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-2">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white/80">{title}</h3>
      <p className="text-xs leading-relaxed text-white/35">{description}</p>
    </div>
  )
}
