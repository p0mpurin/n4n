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
    return '_(No library yet — invent placeholder sections/songs with neutral placeholder image URLs only if needed.)_'
  }
  const lines: string[] = [
    '**Copy stream links and cover URLs exactly** into your HTML `href` and `img src`. Do not swap in different images, generic CDNs, or "better" art. Titles/artists should match.',
    '',
  ]
  for (const s of profile.sections) {
    lines.push(`- **Section:** "${s.name}"${s.mood ? ` (mood: ${s.mood})` : ''}`)
    if (s.songs.length === 0) lines.push('  - _(empty section)_')
    for (const song of s.songs) {
      lines.push(
        `  - **${song.title}** — ${song.artist} (${song.platform})`,
      )
      lines.push(`    - \`href\` (exact): ${song.url}`)
      lines.push(
        `    - cover \`src\` (exact${!song.coverArt ? ', may be empty — use transparent 1×1 or leave img as app does' : ''}): ${song.coverArt || '«none»'}`,
      )
    }
    lines.push('')
  }
  lines.push(
    `**Profile:** "${profile.displayName || 'Your Name'}", @${profile.username || 'handle'}`,
  )
  if (profile.bio) lines.push(`**Bio:** ${profile.bio}`)
  return lines.join('\n')
}

/**
 * **Recommended:** Niche4Niche generates live HTML from the library. Paste **CSS only** from the model — theme applies to new sections automatically.
 */
export function buildStudioAiThemePrompt(
  profile: UserProfile,
  options: Pick<AiStudioPromptOptions, 'creativeBrief'>,
): string {
  const brief =
    options.creativeBrief.trim() ||
    'Pick a bold, cohesive visual direction (color, type, spacing, surfaces). Layout can reshape grids and hero rhythm but must keep the class names below.'

  return `You are writing a **stylesheet only** for **Niche4Niche**.

## Output

Reply with **exactly one** Markdown fenced code block: \`\`\`css … \`\`\`

**Do not** output HTML, \`<style>\` tags, explanations before the fence, or JavaScript.

## What the app does (do not fight it)

The host app **injects real HTML** from the user’s music library. That markup already contains **real stream URLs** in each \`a.song-card\` and **real cover art** in each \`img\` inside \`.song-art\`. Your CSS must **never** try to replace those with \`content:\`, fake background images on \`img\`, or alternate URLs. Style presentation only (layout, borders, filters, radius, typography).

**Do not** add platform iframes or embed widgets unless the user explicitly asks for embed players in their brief.

## Class names (required)

Your CSS must target this structure. **Keep these class names as selectors** (you may add combinators, pseudo-elements, media queries, and custom properties):

\`\`\`text
${DATA_PAGE_MARKUP_REFERENCE}
\`\`\`

You may style \`.empty\`, \`.platform-dot\`, and any element inside these regions. Do not assume extra wrapper divs exist.

Also style app chrome/social UI (same CSS is mounted outside iframe):

\`\`\`text
${APP_CHROME_REFERENCE}
\`\`\`

Use these selectors to theme likes/views/friends bars and panels consistently with the page.

## Constraints

- Plain CSS only (you may \`@import\` https fonts).
- At least one \`@media\` rule for small screens.
- Cohesive, readable, intentional (not generic gray cards unless the brief asks).
- **Do not** use \`!important\` to override \`img[src]…\` in a way that hides real cover art.
- Keep controls readable/accessible (contrast for small text and icon buttons).

## User creative direction

${brief}

---

Current profile label for tone only (HTML is app-generated): **${profile.displayName || 'Your Name'}** @${profile.username || 'handle'}`
}

/**
 * Full HTML + CSS for **Custom HTML** mode in Studio only.
 */
export function buildStudioAiFullPagePrompt(
  profile: UserProfile,
  options: AiStudioPromptOptions,
): string {
  const brief =
    options.creativeBrief.trim() ||
    'Your choice: pick a strong visual direction (mood, era, density, motion) and a layout pattern that feels intentional—not a generic centered card stack unless that truly fits.'

  const dataBlock = options.includeLibrarySnapshot
    ? `### Library (use these URLs verbatim)\n\n${librarySnapshotForFullHtml(profile)}\n`
    : `### Placeholder library\n\nUse believable placeholder content. If you invent song cards, use neutral placeholder image URLs.\n`

  return `You are the **frontend implementer** for **Niche4Niche**: optional **full custom page** mode. The host injects your **HTML body fragment** and **CSS** (no React, no Tailwind, no build step).

## Output contract (non-negotiable)

1. Reply with **exactly two** Markdown fenced code blocks, in this order: \`\`\`html then \`\`\`css
2. **HTML:** inner body content only (no \`<html>\`, \`<head>\`, \`<body>\`, \`<style>\`, \`<script>\`).
3. **No** \`<script>\`, no inline event handlers, no frameworks—**plain HTML + CSS only**.
4. **Embeds / media:** Do **not** replace the user’s **stream links** or **cover image URLs** with different URLs, stock art, or generic thumbnails. Copy **href** and **img src** **character-for-character** from the library section below. Do not wrap streams in iframes unless the user explicitly requests embed players.
5. **Semantics:** Hero with name, \`@handle\`, bio; sections with titles; song cards with cover \`<img>\`, title, artist, platform cue, \`<a target="_blank" rel="noreferrer">\`.
6. **Quality:** Valid HTML; readable class names; at least one \`@media\` breakpoint; https-only assets; optional \`@import\` fonts.

## Creative freedom

Layout, density, color, type, and decorative CSS are yours within the rules above.

## User direction

${brief}

${dataBlock}

## Reference class tree (may diverge if you rename consistently)

\`\`\`text
${DATA_PAGE_MARKUP_REFERENCE}
\`\`\`

Keep the answer to the two code blocks plus at most **3 short bullets** after.

---
_Studio: enable **Custom HTML**, paste HTML + CSS, then **Save**._`
}

export const AI_PROMPT_SHORT_HINT =
  'Studio **Code → AI prompt**: use **Theme (CSS only)** so new sections keep the same look; use full prompt only with **Custom HTML** on.'
