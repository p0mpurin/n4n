import type { UserProfile } from './mock-data'
import { DATA_PAGE_MARKUP_REFERENCE } from './profile-template'

export type AiStudioPromptOptions = {
  creativeBrief: string
  includeLibrarySnapshot: boolean
}

/** Live profile page wrapper only (optional full-page background). Never target Studio editor classes. */
const PUBLIC_PAGE_WRAPPER_HINT = `
.n4n-public-shell
`.trim()

function librarySnapshotForFullHtml(profile: UserProfile): string {
  if (profile.sections.length === 0) {
    return '_(No library yet.)_'
  }
  const lines: string[] = [
    '**Copy stream links and cover URLs exactly.** Do not swap in different images or links.',
    '',
  ]
  if (profile.avatar) {
    lines.push(`**Avatar URL** (exact): ${profile.avatar}`)
    lines.push('')
  }
  if (profile.backgroundImage?.trim()) {
    lines.push(`**Background image URL** (exact): ${profile.backgroundImage.trim()}`)
    lines.push(
      `**Background scrim** (0–1 alpha on dark overlay): ${(profile.style.backgroundOverlayOpacity ?? 0.35).toFixed(2)}`,
    )
    lines.push(`**Background blur (px)**: ${profile.style.backgroundBlurPx ?? 0}`)
    lines.push('')
  }
  for (const s of profile.sections) {
    lines.push(`- **Section:** "${s.name}"${s.mood ? ` (mood: ${s.mood})` : ''}${s.layout === 'scroll' ? ' (horizontal scroll)' : ''}`)
    if (s.songs.length === 0) lines.push('  - _(empty section)_')
    for (const song of s.songs) {
      lines.push(`  - **${song.title}** — ${song.artist} (${song.platform})`)
      lines.push(`    - \`href\`: ${song.url}`)
      lines.push(`    - cover \`src\`: ${song.coverArt || '«none»'}`)
    }
    lines.push('')
  }
  lines.push(`**Profile:** "${profile.displayName || 'Your Name'}", @${profile.username || 'handle'}`)
  if (profile.bio) lines.push(`**Bio:** ${profile.bio}`)
  return lines.join('\n')
}

export function buildStudioAiThemePrompt(
  profile: UserProfile,
  options: Pick<AiStudioPromptOptions, 'creativeBrief'>,
): string {
  const brief =
    options.creativeBrief.trim() ||
    'Pick a bold, cohesive visual direction (color, type, spacing, surfaces).'

  return `You are writing a **stylesheet only** for **Niche4Niche**.

## Output

Reply with **exactly one** Markdown fenced code block: \`\`\`css … \`\`\`

**Do not** output HTML, \`<style>\` tags, explanations before the fence, or JavaScript.

## What the app does

The host app injects real HTML from the user's music library. That markup contains real stream URLs and real cover art. Your CSS must **never** replace those with \`content:\`, fake backgrounds, or alternate URLs.

## Class names (required — target these)

\`\`\`text
${DATA_PAGE_MARKUP_REFERENCE}
\`\`\`

Wallpaper: the app sets \`:root\` vars \`--page-bg-image\`, \`--page-bg-scrim-alpha\` (**0–1**), \`--page-bg-blur\` and draws \`body::before\` / \`body::after\`. Theme CSS may override those variables only — **never** swap in fake image URLs. \`.page.page--has-bg\` is still added when a wallpaper URL exists (hook for selectors). Also: \`.avatar\`; \`.social-stats\` / \`.stat-pill\`; \`.stat-like-action\`; horizontal rows: \`.song-scroll-row\` / \`.song-scroll-btn\` or \`.song-scroll.song-scroll--native\` inside \`.song-grid\`.

**Studio editor:** Users paste this CSS into Niche4Niche Studio; it is shown in the **preview iframe** and on the **published profile** only. **Do not** write selectors for \`.n4n-studio-*\`, \`.n4n-friends-*\`, or any other Studio sidebar/header UI — those elements are not styled by this file.

**Published profile (optional):** You may style the outer wrapper for full-page background:

\`\`\`text
${PUBLIC_PAGE_WRAPPER_HINT}
\`\`\`

## Constraints

- Plain CSS only (\`@import\` https fonts is fine).
- At least one \`@media\` rule for small screens.
- Do not use \`!important\` to hide real cover art.
- Keep controls readable (contrast for text/buttons).

## User creative direction

${brief}

---

Profile: **${profile.displayName || 'Your Name'}** @${profile.username || 'handle'}${profile.avatar ? ` (has avatar)` : ''}${profile.backgroundImage?.trim() ? ` — **Background image set in Data** (scrim α≈${(profile.style.backgroundOverlayOpacity ?? 0.35).toFixed(2)}, blur≈${profile.style.backgroundBlurPx ?? 0}px); keep their \`--page-bg-*\` variables valid.` : ''}`
}

export function buildStudioAiFullPagePrompt(
  profile: UserProfile,
  options: AiStudioPromptOptions,
): string {
  const brief =
    options.creativeBrief.trim() ||
    'Pick a strong visual direction and layout that feels intentional.'

  const dataBlock = options.includeLibrarySnapshot
    ? `### Library (use URLs verbatim)\n\n${librarySnapshotForFullHtml(profile)}\n`
    : `### Placeholder library\n\nUse believable placeholder content.\n`

  return `You are the **frontend implementer** for **Niche4Niche**: full custom page mode. The host injects your **HTML body fragment** and **CSS** (no React, no Tailwind, no build step).

## Output contract

1. Reply with **exactly two** Markdown code blocks: \`\`\`html then \`\`\`css
2. **HTML:** inner body only (no \`<html>\`, \`<head>\`, \`<body>\`, \`<style>\`, \`<script>\`).
3. No \`<script>\`, no inline event handlers, no frameworks.
4. Do **not** replace stream links or cover image URLs. Copy them character-for-character.
5. Include: hero with avatar (\`<img class="avatar">\`), name, @handle, bio, \`.social-stats\` with \`.stat-pill\` items and \`.stat-like-action\` for like button; sections with titles; song cards with cover, title, artist, platform cue, clickable link.
6. Valid HTML, readable class names, at least one \`@media\` breakpoint, https-only assets.
${profile.backgroundImage?.trim() ? `7. User set a **wallpaper in Data**: the host injects \`:root\` / \`body\` layers automatically. Use \`<div class="page page--has-bg">\` (or rely on the host wrap) and the **exact** wallpaper URL and overlay/blur numbers from the library block — do not invent URLs.` : ''}

**Do not** target Studio UI (\`.n4n-studio-*\`, \`.n4n-friends-*\`). Optional published-page wrapper:

\`\`\`text
${PUBLIC_PAGE_WRAPPER_HINT}
\`\`\`

## Creative freedom

Layout, density, color, type, decorative CSS — all yours within the rules.

## User direction

${brief}

${dataBlock}

## Reference class tree

\`\`\`text
${DATA_PAGE_MARKUP_REFERENCE}
\`\`\`

Keep answer to the two code blocks plus at most **3 short bullets**.`
}

export const AI_PROMPT_SHORT_HINT =
  'Studio Code tab: use **Theme (CSS only)** for best results with Claude.'
