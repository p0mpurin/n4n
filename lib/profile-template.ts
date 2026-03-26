import type { UserProfile } from './mock-data'
import { SONG_SCROLL_NAV_INLINE } from './song-scroll-nav'

export const DATA_PAGE_MARKUP_REFERENCE = `
<div class="n4n-public-shell">
<div class="page"> (wallpaper from Data tab is applied via stylesheet \`:root\` vars + \`body::before\` / \`body::after\` — no extra classes needed)
  <header class="hero">
    <img class="avatar" src="USER_AVATAR_URL" alt="" /> (optional, circular pfp)
    <h1 class="name">…</h1>
    <p class="handle">…</p>
    <p class="bio">…</p> (optional)
    <div class="social-stats">
      <button class="stat-pill stat-likes stat-like-action" type="button" data-n4n-like-btn>…</button>
      <span class="stat-pill stat-views">…</span>
      <span class="stat-pill stat-friends">…</span>
    </div>
  </header>
  <main class="sections">
    <section class="section">
      <div class="section-head">
        <h2>…</h2>
        <span class="mood">…</span> (optional)
      </div>
      <div class="song-grid"> or horizontal row with arrows:
      <div class="song-scroll-row" data-n4n-scroll>
        <button class="song-scroll-btn song-scroll-btn--prev" type="button">…</button>
        <div class="song-grid song-scroll">…</div>
        <button class="song-scroll-btn song-scroll-btn--next" type="button">…</button>
      </div>
      or <div class="song-grid song-scroll song-scroll--native"> (scrollbar only)
        <a class="song-card" href="STREAM_URL" target="_blank" rel="noreferrer">
          <div class="song-art"><img src="COVER_URL" alt="" loading="lazy" /></div>
          <div class="song-info">
            <span class="song-title">…</span>
            <span class="song-artist">…</span>
          </div>
          <span class="platform-dot" title="platform"></span>
        </a>
        <p class="empty">…</p>
      </div>
    </section>
  </main>
  <footer class="site-footer">…</footer>
</div>
</div>
`.trim()

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const BG_SCRIM_DEFAULT = 0.35
const BG_BLUR_MAX = 48

function clampBg(n: number, min: number, max: number): number {
  if (typeof n !== 'number' || Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

/** URL from Data tab — top-level field and/or `style.backgroundImage` (Supabase JSON). */
export function effectiveBackgroundImageUrl(profile: UserProfile): string {
  const top = profile.backgroundImage?.trim() || ''
  if (top) return top
  const inStyle =
    typeof profile.style?.backgroundImage === 'string' ? profile.style.backgroundImage.trim() : ''
  return inStyle
}

export function resolveBackgroundVars(profile: UserProfile): {
  bgUrl: string
  scrimAlpha: number
  blurPx: number
} | null {
  const bgUrl = effectiveBackgroundImageUrl(profile)
  if (!bgUrl) return null
  const scrimAlpha = clampBg(
    profile.style.backgroundOverlayOpacity ?? BG_SCRIM_DEFAULT,
    0,
    1,
  )
  const blurPx = clampBg(profile.style.backgroundBlurPx ?? 0, 0, BG_BLUR_MAX)
  return { bgUrl, scrimAlpha, blurPx }
}

const PROFILE_HOST_WIDTH_PREPEND = `
/* Niche4Niche: full-width stage (prepended) */
.n4n-profile-root,
.n4n-profile-root .n4n-public-shell,
body > .n4n-public-shell {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
`.trim()

/** Appended last so custom CSS cannot zero out `.page` margins; hero rules beat flex-start themes. */
const PROFILE_HOST_LAYOUT_APPEND = `
/* Niche4Niche: layout tail — runs after your theme */
.n4n-profile-root .page,
body > .n4n-public-shell .page {
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
.n4n-profile-root .hero,
body > .n4n-public-shell .hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.n4n-profile-root .hero .bio,
body > .n4n-public-shell .hero .bio {
  max-width: 55ch;
}
.n4n-profile-root .hero .avatar,
body > .n4n-public-shell .hero .avatar {
  display: block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
}
`.trim()

/** Prepend width helpers, append background + wallpaper rules, append centering last. */
export function composeProfileStylesheet(cssBase: string, profile: UserProfile): string {
  const layered = `${PROFILE_HOST_WIDTH_PREPEND}\n${cssBase.trimStart()}`
  const withBg = ensureBackgroundCss(layered, profile)
  return `${withBg.trimEnd()}\n${PROFILE_HOST_LAYOUT_APPEND}`
}

/** @deprecated Wallpaper vars are injected in {@link ensureBackgroundCss} on `:root`; returns empty string. */
export function buildPageBackgroundInlineStyle(_profile: UserProfile): string {
  return ''
}

/** Appends wallpaper on `body` so it works in the Studio iframe and inside Next (nested shells / stacking). */
export function ensureBackgroundCss(cssText: string, profile: UserProfile): string {
  const v = resolveBackgroundVars(profile)
  if (!v) return cssText
  const { bgUrl, scrimAlpha, blurPx } = v
  const url = `url(${JSON.stringify(bgUrl)})`
  const append = `
/* Niche4Niche: full-page background (Data tab) — body layers, not .page (avoids stacking bugs on host) */
:root {
  --page-bg-image: ${url};
  --page-bg-scrim-alpha: ${scrimAlpha};
  --page-bg-blur: ${blurPx}px;
}
html, body {
  background: transparent !important;
  min-height: 100%;
}
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: var(--page-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0a0a10;
  filter: blur(var(--page-bg-blur, 0px));
  transform: scale(1.1);
}
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(10, 10, 16, var(--page-bg-scrim-alpha, 0.35));
  pointer-events: none;
}
.n4n-public-shell {
  position: relative;
  background: transparent !important;
}
.n4n-profile-root .n4n-public-shell,
body > .n4n-public-shell {
  min-height: 100%;
}
`
  return `${cssText.trimEnd()}\n${append}`
}

function platformDot(platform: string): string {
  const colors: Record<string, string> = {
    spotify: '#1DB954',
    youtube: '#FF0000',
    soundcloud: '#FF5500',
  }
  const c = colors[platform] || '#888'
  return `<span class="platform-dot" style="background:${c}" title="${esc(platform)}"></span>`
}

export function generateProfileHtml(profile: UserProfile): string {
  const likes = profile.stats.likesReceived ?? 0
  const views = profile.stats.profileViews ?? 0
  const friends = profile.stats.totalFriends ?? 0
  const sections = profile.sections
    .map((section) => {
      const songs = section.songs
        .map(
          (song) => `
      <a class="song-card" href="${esc(song.url)}" target="_blank" rel="noreferrer">
        <div class="song-art">
          <img src="${esc(song.coverArt)}" alt="" loading="lazy" />
        </div>
        <div class="song-info">
          <span class="song-title">${esc(song.title)}</span>
          <span class="song-artist">${esc(song.artist)}</span>
        </div>
        ${platformDot(song.platform)}
      </a>`,
        )
        .join('\n')

      const scrollClasses =
        section.layout === 'scroll'
          ? section.scrollNav === 'native'
            ? 'song-grid song-scroll song-scroll--native'
            : 'song-grid song-scroll'
          : 'song-grid'

      const gridInner = `
      ${songs || '<p class="empty">This section is empty.</p>'}`

      const scrollBlock =
        section.layout === 'scroll' && section.scrollNav !== 'native'
          ? `
    <div class="song-scroll-row" data-n4n-scroll>
      <button type="button" class="song-scroll-btn song-scroll-btn--prev" aria-label="Scroll songs left">‹</button>
      <div class="${scrollClasses}">${gridInner}
      </div>
      <button type="button" class="song-scroll-btn song-scroll-btn--next" aria-label="Scroll songs right">›</button>
    </div>`
          : `
    <div class="${scrollClasses}">${gridInner}
    </div>`

      return `
  <section class="section">
    <div class="section-head">
      <h2>${esc(section.name)}</h2>
      ${section.mood ? `<span class="mood">${esc(section.mood)}</span>` : ''}
    </div>${scrollBlock}
  </section>`
    })
    .join('\n')

  const avatarHtml = profile.avatar
    ? `<img class="avatar" src="${esc(profile.avatar)}" alt="${esc(profile.displayName)}" />`
    : ''

  const pageClass = resolveBackgroundVars(profile) ? 'page page--has-bg' : 'page'
  const pageInner = `<div class="${pageClass}">
  <header class="hero">
    ${avatarHtml}
    <h1 class="name">${esc(profile.displayName || 'Your Name')}</h1>
    <p class="handle">@${esc(profile.username || 'handle')}</p>
    ${profile.bio ? `<p class="bio">${esc(profile.bio)}</p>` : ''}
    <div class="social-stats">
      <button class="stat-pill stat-likes stat-like-action" type="button" data-n4n-like-btn><strong>${likes}</strong> likes</button>
      <span class="stat-pill stat-views"><strong>${views}</strong> views</span>
      <span class="stat-pill stat-friends"><strong>${friends}</strong> friends</span>
    </div>
  </header>

  <main class="sections">
    ${sections || '<p class="empty">Add a section and some songs to get started.</p>'}
  </main>

  <footer class="site-footer">
    <p>Built with <strong>Niche4Niche</strong></p>
  </footer>
</div>`

  /* Same inner structure as hosted custom pages (shell > .page) so background + Next.js host stack match. */
  return `<div class="n4n-public-shell">${pageInner}</div>`
}

/** Ensures full-page background markup exists when a URL is set (custom HTML may omit it). */
export function finalizeProfileHtmlBody(profile: UserProfile, htmlBody: string): string {
  if (!resolveBackgroundVars(profile)) return htmlBody
  if (/\bn4n-public-shell\b/.test(htmlBody)) return htmlBody
  const cls = resolveBackgroundVars(profile) ? 'page page--has-bg' : 'page'
  return `<div class="n4n-public-shell"><div class="${cls}">${htmlBody}</div></div>`
}

export function generateProfileCss(): string {
  return `*, *::before, *::after { box-sizing: border-box; margin: 0; }

body {
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #0a0a10;
  color: #eeeef6;
  line-height: 1.55;
}

.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
  position: relative;
}

/* Full-page wallpaper: ensureBackgroundCss() adds :root vars + body::before/::after when a URL is set. */

/* ---- Hero ---- */
.hero { margin-bottom: 2.5rem; }
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border: 2px solid rgba(255,255,255,0.12);
}
/* Match iframe layout on Next.js host (Tailwind preflight / max-width on img, h1 margins). */
.hero .avatar {
  display: block;
  max-width: none;
  vertical-align: top;
  margin-inline: auto;
}
.page h1.name,
.hero h1.name {
  margin: 0;
  line-height: 1.05;
}
.name { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; }
.handle { opacity: 0.55; margin-top: 0.3rem; }
.bio { margin-top: 0.6rem; max-width: 55ch; opacity: 0.85; }
.social-stats {
  margin-top: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  border-radius: 999px;
  padding: 0.26rem 0.72rem;
  font-size: 0.78rem;
  opacity: 0.9;
}
.stat-pill strong { font-size: 0.82rem; }
.stat-like-action {
  cursor: pointer;
  font-family: inherit;
  position: relative;
  z-index: 2;
}

/* ---- Sections ---- */
.sections { display: grid; gap: 2rem; }

.section {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  padding: 1.25rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-head h2 { font-size: 1.25rem; font-weight: 700; }

.mood {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  opacity: 0.7;
}

/* ---- Song Grid ---- */
.song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

/* Scroll row: arrows — customize with CSS variables on .song-scroll-row */
.song-scroll-row {
  --song-scroll-btn-size: 2.25rem;
  --song-scroll-btn-fg: rgba(255, 255, 255, 0.95);
  --song-scroll-btn-bg: rgba(0, 0, 0, 0.4);
  --song-scroll-btn-bg-hover: rgba(0, 0, 0, 0.55);
  --song-scroll-btn-border: 1px solid rgba(255, 255, 255, 0.22);
  --song-scroll-btn-radius: 999px;
  --song-scroll-gap: 0.4rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: stretch;
  gap: var(--song-scroll-gap);
}

.song-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
  min-width: 0;
}

.song-scroll-row .song-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.song-scroll-row .song-scroll::-webkit-scrollbar {
  display: none;
}

.song-scroll-btn {
  align-self: center;
  width: var(--song-scroll-btn-size);
  height: var(--song-scroll-btn-size);
  border-radius: var(--song-scroll-btn-radius);
  border: var(--song-scroll-btn-border);
  background: var(--song-scroll-btn-bg);
  color: var(--song-scroll-btn-fg);
  font-size: calc(var(--song-scroll-btn-size) * 0.52);
  line-height: 1;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: opacity 0.15s, background 0.15s;
}
.song-scroll-btn:hover:not(:disabled) {
  background: var(--song-scroll-btn-bg-hover);
}
.song-scroll-btn:disabled {
  opacity: 0.28;
  cursor: default;
}

.song-scroll--native {
  scrollbar-width: thin;
}
.song-scroll--native::-webkit-scrollbar {
  display: block;
  height: 7px;
}
.song-scroll--native::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
}

.song-scroll .song-card {
  min-width: 170px;
  max-width: 200px;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.song-card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s, border-color 0.2s;
  position: relative;
}

.song-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.22);
}

.song-art { aspect-ratio: 1; overflow: hidden; background: #111; }
.song-art img { width: 100%; height: 100%; object-fit: cover; display: block; }

.song-info { padding: 0.55rem 0.65rem 0.65rem; }
.song-title { display: block; font-weight: 600; font-size: 0.85rem; }
.song-artist { display: block; font-size: 0.75rem; opacity: 0.6; margin-top: 0.15rem; }

.platform-dot {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.empty { opacity: 0.5; font-size: 0.9rem; }

/* ---- Footer ---- */
.site-footer {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.4;
}

@media (max-width: 640px) {
  .page { padding: 1.5rem 1rem 3rem; }
  .song-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .avatar { width: 60px; height: 60px; }
  .song-scroll-row {
    --song-scroll-btn-size: 2rem;
  }
}`
}

/** Full document for iframe preview; includes scroll-button script. */
export function buildProfileSrcDocument(htmlBody: string, cssText: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssText}</style></head><body>${htmlBody}<script>${SONG_SCROLL_NAV_INLINE}</script></body></html>`
}
