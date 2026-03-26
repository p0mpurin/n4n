import Link from 'next/link'
import { Music, Palette, Users, Heart, Code2, Eye, ArrowRight, Leaf } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="n4n-landing relative flex min-h-screen flex-col overflow-x-hidden bg-[#0c0a11] text-zinc-300">
      <div className="n4n-landing-grid-bg" aria-hidden />

      {/* Ambient blobs */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="n4n-landing-blob-drift absolute -left-[22%] top-[6%] h-[min(560px,58vw)] w-[min(500px,92vw)]">
          <div className="n4n-landing-blob-inner h-full w-full rounded-[46%] bg-[#6b9b72]/[0.28] blur-3xl" />
        </div>
        <div className="n4n-landing-blob-drift--slow absolute -right-[18%] top-[22%] h-[min(480px,52vw)] w-[min(440px,88vw)]">
          <div className="n4n-landing-blob-inner n4n-landing-blob-inner--b h-full w-full rounded-[48%] bg-[#9b7cc4]/[0.22] blur-3xl" />
        </div>
        <div className="n4n-landing-blob-drift--lag absolute bottom-[2%] left-[25%] h-[min(400px,48vw)] w-[min(540px,96vw)]">
          <div className="n4n-landing-blob-inner n4n-landing-blob-inner--c h-full w-full rounded-[44%] bg-[#c9956e]/[0.18] blur-3xl" />
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0c0a11]/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="n4n-landing-nav-fade mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-zinc-100 transition-colors hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-violet-500/20 ring-1 ring-white/10">
              <Music className="h-4 w-4 text-emerald-300/90" />
            </span>
            <span>Niche4Niche</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/themes"
              className="rounded-full px-2.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-zinc-200 sm:px-3"
            >
              Themes
            </Link>
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600/90 to-emerald-500/85 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-8px_rgba(52,211,153,0.45)] ring-1 ring-emerald-400/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_-6px_rgba(52,211,153,0.55)] active:scale-[0.98]"
            >
              Start
              <ArrowRight className="h-3.5 w-3.5 opacity-90" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-10 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-20">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_min(38%,360px)] lg:gap-20">
            <div className="n4n-landing-hero-seq min-w-0">
              <p className="n4n-landing-fade-up mb-7 inline-flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-[13px] text-zinc-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                <Leaf className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={2} />
                <span className="leading-snug">A quiet home for your playlists</span>
              </p>
              <h1 className="n4n-landing-fade-up text-balance text-[2.25rem] font-medium leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl lg:text-[3rem]">
                A page that{' '}
                <span className="n4n-landing-headline-shine inline-block bg-gradient-to-r from-emerald-200 via-violet-200 to-amber-100 bg-clip-text text-transparent">
                  sounds like you
                </span>
              </h1>
              <p className="n4n-landing-fade-up mt-7 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-zinc-400 sm:text-base">
                Pull in tracks from Spotify, YouTube, and SoundCloud. Style it by mood or by hand with
                CSS—then share the link and see where you overlap with friends.
              </p>
              <div className="n4n-landing-fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_28px_-10px_rgba(16,185,129,0.55)] ring-1 ring-emerald-400/35 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] active:scale-[0.98]"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.08]"
                >
                  I have an account
                </Link>
              </div>
            </div>

            {/* Collage */}
            <div
              className="relative mx-auto hidden h-[min(400px,54vh)] w-full max-w-[320px] lg:mx-0 lg:block"
              aria-hidden
            >
              <div className="n4n-landing-deco-float absolute inset-0">
                <div className="n4n-landing-deco-panel absolute right-[4%] top-[4%] aspect-square w-[44%] rounded-[1.4rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.12] to-white/[0.03] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.06]" />
                <div className="n4n-landing-deco-panel n4n-landing-deco-panel--b absolute right-[32%] top-[30%] aspect-square w-[38%] rounded-[1.3rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/20 to-transparent shadow-[0_16px_40px_-20px_rgba(139,92,246,0.35)] ring-1 ring-violet-400/10" />
                <div className="n4n-landing-deco-panel n4n-landing-deco-panel--c absolute bottom-[12%] right-[8%] aspect-[5/4] w-[50%] rounded-[1.45rem] border border-amber-200/10 bg-gradient-to-br from-amber-500/15 to-transparent shadow-[0_24px_56px_-22px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/10" />
              </div>
              <div className="absolute -left-1 bottom-[20%] max-w-[10rem] -rotate-2 rounded-xl border border-white/[0.1] bg-zinc-950/80 px-3 py-2 text-[10px] leading-snug text-zinc-500 shadow-lg backdrop-blur-md">
                Mixtapes, sections, your rules.
              </div>
            </div>
          </div>
        </section>

        {/* Wave */}
        <div className="relative z-10 -mt-1 h-10 w-full text-[#12101c] sm:h-14" aria-hidden>
          <svg
            className="h-full w-full min-w-full"
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,28 C200,4 400,52 600,28 C800,4 1000,52 1200,28 C1320,12 1380,36 1440,24 L1440,56 L0,56 Z"
            />
          </svg>
        </div>

        {/* Bento */}
        <section className="relative z-10 -mt-px bg-[#12101c] pb-24 pt-6 sm:pt-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-10">
            <div className="n4n-landing-features-intro mb-12 max-w-2xl lg:mb-16">
              <p className="n4n-landing-fade-up text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Inside the box
              </p>
              <h2 className="n4n-landing-fade-up mt-3 text-2xl font-medium leading-snug tracking-tight text-zinc-100 sm:text-3xl lg:text-[2rem]">
                Room for your taste—not a template factory.
              </h2>
            </div>

            <div className="n4n-landing-bento grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
              <FeatureCard
                className="lg:col-span-7 lg:row-span-2 lg:min-h-[min(320px,42vh)]"
                featured
                tint="peach"
                icon={<Music className="h-6 w-6 sm:h-7 sm:w-7" />}
                title="All your platforms"
                description="Spotify, YouTube, SoundCloud in one library. Group songs into sections like chapters—not a rigid grid of widgets."
              />
              <FeatureCard
                className="lg:col-span-5"
                tint="mint"
                icon={<Palette className="h-5 w-5" />}
                title="Themes your way"
                description="Start from a mood or paste CSS. No lock-in to one look."
              />
              <FeatureCard
                className="lg:col-span-5"
                tint="lilac"
                icon={<Code2 className="h-5 w-5" />}
                title="HTML & CSS"
                description="Open the hood when you want. Builder or full custom markup."
              />
              <FeatureCard
                className="lg:col-span-4"
                tint="sky"
                icon={<Users className="h-5 w-5" />}
                title="Friends"
                description="Requests, shared songs, taste overlap."
              />
              <FeatureCard
                className="lg:col-span-4"
                tint="rose"
                icon={<Heart className="h-5 w-5" />}
                title="Likes & views"
                description="Signals on your public page, simply."
              />
              <FeatureCard
                className="lg:col-span-4"
                tint="cream"
                icon={<Eye className="h-5 w-5" />}
                title="Live URL"
                description="Claim a username—your page is up. Share anywhere."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 border-t border-white/[0.06] bg-[#0c0a11] px-5 py-20 sm:px-10 sm:py-24">
          <div className="n4n-landing-fade-up n4n-landing-cta-wrap n4n-landing-cta-aura mx-auto max-w-xl rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-10 text-center backdrop-blur-md sm:p-12">
            <h2 className="text-xl font-medium tracking-tight text-zinc-50 sm:text-2xl">
              Claim a corner of the internet
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Username, songs, style. Nothing more unless you want it.
            </p>
            <Link
              href="/signup"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3.5 text-sm font-medium text-white shadow-[0_0_28px_-10px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/30 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
            >
              Claim your page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.06] bg-[#0a0810]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:grid-cols-[1fr_auto] sm:items-end sm:px-10">
            <div>
              <p className="flex items-center gap-2.5 text-sm font-medium text-zinc-200">
                <Music className="h-4 w-4 text-emerald-400/80" />
                Niche4Niche
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                Small tool, big shelf—for the music you actually return to.
              </p>
            </div>
            <p className="text-sm text-zinc-600 sm:text-right sm:pb-0.5">
              Your music taste, your page.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

const tintStyles = {
  mint: 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/25',
  lilac: 'bg-violet-400/15 text-violet-200 ring-1 ring-violet-400/25',
  peach: 'bg-amber-400/12 text-amber-100 ring-1 ring-amber-400/22',
  sky: 'bg-sky-400/14 text-sky-200 ring-1 ring-sky-400/22',
  rose: 'bg-rose-400/14 text-rose-200 ring-1 ring-rose-400/22',
  cream: 'bg-stone-400/12 text-stone-200 ring-1 ring-stone-400/18',
} as const

type Tint = keyof typeof tintStyles

function FeatureCard({
  icon,
  title,
  description,
  tint,
  featured,
  className = '',
}: {
  icon: React.ReactNode
  title: string
  description: string
  tint: Tint
  featured?: boolean
  className?: string
}) {
  return (
    <div
      className={`n4n-landing-fade-up group flex flex-col rounded-[1.65rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-[0_28px_64px_-36px_rgba(16,185,129,0.35)] sm:p-6 ${featured ? 'lg:p-9' : ''} ${className}`}
    >
      <div
        className={`mb-4 inline-flex w-fit rounded-2xl p-2.5 ${tintStyles[tint]} ${featured ? 'p-3.5' : ''}`}
      >
        {icon}
      </div>
      <h3
        className={`font-medium text-zinc-100 ${featured ? 'text-lg sm:text-xl' : 'text-[15px]'}`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 leading-relaxed text-zinc-400 ${featured ? 'text-sm sm:text-[15px]' : 'text-xs sm:text-sm'}`}
      >
        {description}
      </p>
    </div>
  )
}
