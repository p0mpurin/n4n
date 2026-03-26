import type { UserProfile } from './mock-data'
import { DATA_PAGE_MARKUP_REFERENCE } from './profile-template'

export type AiStudioPromptOptions = {
  creativeBrief: string
  includeLibrarySnapshot: boolean
}

const APP_CHROME_REFERENCE = `
.n4n-studio-shell
.n4n-studio-header
.n4n-studio-sidebar
.n4n-studio-tab
.n4n-studio-preview-toolbar
.n4n-studio-stats
.n4n-friends-panel
.n4n-friends-card
.n4n-public-shell
.n4n-public-bar
.n4n-public-bar-like
.n4n-public-bar-friend
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

Key classes: \`.avatar\` (circular profile picture), \`.social-stats\` + \`.stat-pill\` (likes/views/friends under bio), \`.stat-like-action\` (the **actual clickable like button**, label should remain like \"N likes\"), \`.song-scroll\` (horizontal scroll variant of \`.song-grid\`).

Also style app chrome (mounted outside iframe, same CSS):

\`\`\`text
${APP_CHROME_REFERENCE}
\`\`\`

## Constraints

- Plain CSS only (\`@import\` https fonts is fine).
- At least one \`@media\` rule for small screens.
- Do not use \`!important\` to hide real cover art.
- Keep controls readable (contrast for text/buttons).

## User creative direction

${brief}

---

Profile: **${profile.displayName || 'Your Name'}** @${profile.username || 'handle'}${profile.avatar ? ` (has avatar)` : ''}`
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

## Also style app chrome

\`\`\`text
${APP_CHROME_REFERENCE}
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
