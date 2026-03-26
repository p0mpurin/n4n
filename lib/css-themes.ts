import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export const CSS_THEME_MAX_CHARS = 262_144
export const CSS_THEME_TITLE_MAX = 120

export type CssThemeListItem = {
  id: string
  title: string
  description: string
  created_at: string
  author_id: string
  author_username: string
  author_display_name: string
}

export type CssThemeDetail = CssThemeListItem & {
  css: string
}

function mapRow(
  row: {
    id: string
    title: string
    description: string
    created_at: string
    author_id: string
    css?: string
  },
  author?: { username: string; display_name: string } | null,
): CssThemeListItem | CssThemeDetail {
  const base = {
    id: row.id,
    title: row.title,
    description: row.description,
    created_at: row.created_at,
    author_id: row.author_id,
    author_username: author?.username ?? 'unknown',
    author_display_name: author?.display_name ?? '',
  }
  if (row.css !== undefined) {
    return { ...base, css: row.css }
  }
  return base
}

async function attachAuthors<T extends { author_id: string }>(
  supabase: SupabaseClient,
  rows: T[],
): Promise<(T & { author: { username: string; display_name: string } })[]> {
  if (rows.length === 0) return []
  const ids = [...new Set(rows.map((r) => r.author_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, display_name')
    .in('id', ids)
  const map = new Map((profiles || []).map((p) => [p.id, p]))
  return rows.map((r) => ({
    ...r,
    author: map.get(r.author_id) ?? { username: 'unknown', display_name: '' },
  }))
}

export async function listCssThemes(supabase: SupabaseClient): Promise<CssThemeListItem[]> {
  const { data, error } = await supabase
    .from('css_themes')
    .select('id, title, description, created_at, author_id')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  const withAuthors = await attachAuthors(supabase, data)
  return withAuthors.map((r) =>
    mapRow(r, r.author) as CssThemeListItem,
  )
}

export async function getCssTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<CssThemeDetail | null> {
  const { data, error } = await supabase
    .from('css_themes')
    .select('id, title, description, css, created_at, author_id')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  const [withAuthor] = await attachAuthors(supabase, [data])
  return mapRow(withAuthor, withAuthor.author) as CssThemeDetail
}

export async function publishCssTheme(input: {
  authorId: string
  title: string
  description: string
  css: string
}): Promise<{ error?: string; id?: string }> {
  const title = input.title.trim()
  const css = input.css.trim()
  const description = input.description.trim()
  if (!title.length || title.length > CSS_THEME_TITLE_MAX) {
    return { error: 'Title must be 1–120 characters.' }
  }
  if (!css.length) {
    return { error: 'CSS cannot be empty.' }
  }
  if (css.length > CSS_THEME_MAX_CHARS) {
    return { error: `CSS must be at most ${CSS_THEME_MAX_CHARS} characters.` }
  }

  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('css_themes')
    .insert({
      author_id: input.authorId,
      title,
      description,
      css,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  if (!data?.id) return { error: 'Could not publish theme.' }
  return { id: data.id }
}

export async function deleteMyCssTheme(themeId: string, authorId: string): Promise<{ error?: string }> {
  const supabase = createBrowserClient()
  const { error } = await supabase
    .from('css_themes')
    .delete()
    .eq('id', themeId)
    .eq('author_id', authorId)

  if (error) return { error: error.message }
  return {}
}

export async function applyCssThemeToProfile(
  themeId: string,
  profileId: string,
): Promise<{ error?: string }> {
  const supabase = createBrowserClient()
  const theme = await getCssTheme(supabase, themeId)
  if (!theme) return { error: 'Theme not found.' }
  const { error } = await supabase
    .from('profiles')
    .update({ custom_page_css: theme.css })
    .eq('id', profileId)

  if (error) return { error: error.message }
  return {}
}
