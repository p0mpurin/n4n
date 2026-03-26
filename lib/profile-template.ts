import type { UserProfile } from './mock-data'

export const DATA_PAGE_MARKUP_REFERENCE = `
<div class="page">
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
      <div class="song-grid"> or <div class="song-grid song-scroll"> (horizontal)
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
`.trim()

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

      const gridClass = section.layout === 'scroll' ? 'song-grid song-scroll' : 'song-grid'

      return `
  <section class="section">
    <div class="section-head">
      <h2>${esc(section.name)}</h2>
      ${section.mood ? `<span class="mood">${esc(section.mood)}</span>` : ''}
    </div>
    <div class="${gridClass}">
      ${songs || '<p class="empty">This section is empty.</p>'}
    </div>
  </section>`
    })
    .join('\n')

  const avatarHtml = profile.avatar
    ? `<img class="avatar" src="${esc(profile.avatar)}" alt="${esc(profile.displayName)}" />`
    : ''

  return `<div class="page">
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
}

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

.song-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
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
}`
}
